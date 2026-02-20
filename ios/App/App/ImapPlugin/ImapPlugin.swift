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

            fetchOp?.start { error, messages, _ in
                if let error = error {
                    let nsError = error as NSError
                    let isAuthError = nsError.code == MCOErrorCode.authentication.rawValue
                    if validate {
                        let msg = isAuthError
                            ? "Authentication failed: Invalid username or password"
                            : "Connection error: \(error.localizedDescription)"
                        call.resolve(["error": msg, "received": []])
                    } else {
                        call.resolve(["error": true, "received": []])
                    }
                    return
                }

                // If validating, credentials are confirmed valid — return empty array
                if validate {
                    call.resolve(["error": NSNull(), "received": []])
                    return
                }

                let allMessages = (messages as? [MCOIMAPMessage]) ?? []
                let messagesArray = Array(allMessages.suffix(7))
                let group = DispatchGroup()
                var results: [[String: Any]] = []
                let resultQueue = DispatchQueue(label: "imap.result.queue")

                for msg in messagesArray {
                    group.enter()
                    if let fetchDataOp = session.fetchMessageOperation(withFolder: "INBOX", uid: msg.uid) {
                        fetchDataOp.start { fetchErr, data in
                            if let _ = fetchErr {
                                resultQueue.async {
                                    group.leave()
                                }
                                return
                            }

                            var rawDataValue: Any = ""
                            if let data = data {
                                if let str = String(data: data, encoding: .utf8) {
                                    rawDataValue = str
                                } else {
                                    rawDataValue = data.base64EncodedString()
                                }
                            }

                            let item: [String: Any] = [
                                "data": rawDataValue,
                                "subject": msg.header?.subject ?? "(no subject)",
                                "sender": msg.header?.from?.displayName ?? msg.header?.from?.mailbox ?? "",
                                "date": msg.header?.date?.timeIntervalSince1970 ?? 0
                            ]

                            resultQueue.async {
                                results.append(item)
                                group.leave()
                            }
                        }
                    } else {
                        resultQueue.async {
                            group.leave()
                        }
                    }
                }

                group.notify(queue: DispatchQueue.global(qos: .userInitiated)) {
                    call.resolve(["error": NSNull(), "received": results])
                }
            }
        }
    }
}
