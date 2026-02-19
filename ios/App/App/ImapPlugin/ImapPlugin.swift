//
//  ImapPlugin.swift
//  App
//
//  Created by test on 19/2/26.
//

import Capacitor

@objc(ImapPlugin)
public class ImapPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "WebmailInboxScraper"
    public let jsName = "WebmailInboxScraper"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getInbox", returnType: CAPPluginReturnPromise)
    ]

    @objc func getInbox(_ call: CAPPluginCall) {
        guard
            let host = call.getString("server"),
            let username = call.getString("username"),
            let password = call.getString("password"),
            let portString = call.getString("port")
        else {
            call.reject("Missing required parameters: host, username, password")
            return
        }

        let port = UInt32(portString) ?? 993
        let validate = call.getBool("validate") ?? true

        DispatchQueue.global(qos: .userInitiated).async {
            let session = MCOIMAPSession()
            session.hostname = host
            session.port = port
            session.username = username
            session.password = password
            session.connectionType = .TLS

            let fetchOp = session.fetchMessagesByNumberOperation(
                withFolder: "INBOX",
                requestKind: [.headers, .flags, .size],
                numbers: MCOIndexSet(range: MCORangeMake(1, UINT64_MAX))
            )
            print("here")
            fetchOp?.start { error, messages, _ in
                if let error = error {
                    call.resolve(["error": error.localizedDescription, "received": []])
                    return
                }

                let result = (messages as? [MCOIMAPMessage] ?? []).map { msg -> [String: Any] in
                    return [
                        "uid": msg.uid,
                        "subject": msg.header?.subject ?? "(no subject)",
                        "from": msg.header?.from?.displayName ?? msg.header?.from?.mailbox ?? "",
                        "date": msg.header?.date?.timeIntervalSince1970 ?? 0,
                        "size": msg.size,
                        "isRead": !msg.flags.contains(.seen) ? false : true
                    ]
                }

                call.resolve(["error": NSNull(), "received": result])
            }
        }
    }
}
