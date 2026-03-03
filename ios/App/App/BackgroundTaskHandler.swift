import Foundation
import BackgroundTasks
import Capacitor

class BackgroundTaskHandler {
    static let shared = BackgroundTaskHandler()
    
    private let taskID = "gr.auth.aristomate.webmail.fetch"
    
    func scheduleBackgroundFetch() {
        let request = BGAppRefreshTaskRequest(identifier: taskID)
        request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60) // 15 minutes
        
        do {
            try BGTaskScheduler.shared.submit(request)
            print("[BG] Background fetch scheduled successfully")
        } catch {
            print("[BG] Failed to schedule background fetch: \(error)")
        }
    }
    
    func registerBackgroundTask() {
        BGTaskScheduler.shared.register(forTaskWithIdentifier: taskID, using: nil) { task in
            self.handleBackgroundFetch(task as! BGAppRefreshTask)
        }
    }
    
    private func handleBackgroundFetch(_ task: BGAppRefreshTask) {
        print("[BG] Starting background webmail fetch...")
        
        // Schedule the next background fetch
        scheduleBackgroundFetch()
        
        // Fetch webmail notifications
        fetchWebmailNotifications { success in
            if success {
                print("[BG] Background fetch completed successfully")
                task.setTaskCompleted(success: true)
            } else {
                print("[BG] Background fetch failed")
                task.setTaskCompleted(success: false)
            }
        }
        
        // Handle task expiration
        task.expirationHandler = {
            print("[BG] Background task expired")
            task.setTaskCompleted(success: false)
        }
    }
    
    private func fetchWebmailNotifications(completion: @escaping (Bool) -> Void) {
        // Get stored credentials from UserDefaults (Capacitor Preferences uses this)
        let defaults = UserDefaults.standard
        guard let username = defaults.string(forKey: "webmail_username"),
              let password = defaults.string(forKey: "webmail_password") else {
            print("[BG] No stored credentials found")
            completion(false)
            return
        }
        
        print("[BG] Retrieved stored credentials")
        
        // Create IMAP session
        let session = MCOIMAPSession()
        session.hostname = "mail.auth.gr"
        session.port = 993
        session.username = username
        session.password = password
        session.connectionType = .TLS
        
        print("[BG] Connecting to IMAP server...")
        
        // Fetch last 7 messages
        let fetchOp = session.fetchMessagesOperation(
            withFolder: "INBOX",
            requestKind: [.headers, .flags, .size],
            uids: MCOIndexSet(range: MCORangeMake(1, UINT64_MAX))
        )
        
        fetchOp?.start { error, messages, _ in
            if let error = error {
                print("[BG] IMAP error: \(error.localizedDescription)")
                completion(false)
                return
            }
            
            guard let allMessages = messages as? [MCOIMAPMessage] else {
                print("[BG] No messages found")
                completion(true)
                return
            }
            
            let recentMessages = Array(allMessages.suffix(7))
            print("[BG] Found \(recentMessages.count) recent messages")
            
            if recentMessages.isEmpty {
                completion(true)
                return
            }
            
            // Fetch full message data and display notifications
            let group = DispatchGroup()
            var displayedCount = 0
            
            for msg in recentMessages {
                group.enter()
                
                if let fetchDataOp = session.fetchMessageOperation(withFolder: "INBOX", uid: msg.uid) {
                    fetchDataOp.start { fetchErr, data in
                        defer { group.leave() }
                        
                        if let _ = fetchErr {
                            print("[BG] Error fetching message: \(String(describing: fetchErr))")
                            return
                        }
                        
                        self.displayNotification(
                            subject: msg.header?.subject ?? "(no subject)",
                            sender: msg.header?.from?.displayName ?? msg.header?.from?.mailbox ?? "Unknown",
                            uid: msg.uid
                        )
                        displayedCount += 1
                    }
                } else {
                    group.leave()
                }
            }
            
            group.notify(queue: .main) {
                print("[BG] Displayed \(displayedCount) notifications")
                completion(true)
            }
        }
    }
    
    private func displayNotification(subject: String, sender: String, uid: UInt32) {
        let content = UNMutableNotificationContent()
        content.title = sender
        content.body = subject
        content.sound = .default
        content.badge = NSNumber(value: UIApplication.shared.applicationIconBadgeNumber + 1)
        
        // Add custom data to identify the notification source
        content.userInfo = ["source": "webmail", "uid": uid]
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(
            identifier: "webmail_\(uid)",
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("[BG] Failed to schedule notification: \(error)")
            } else {
                print("[BG] Notification scheduled for: \(subject)")
            }
        }
    }
}
