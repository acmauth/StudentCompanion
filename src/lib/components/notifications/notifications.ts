import { neoUniversisGet, neoElearningGet } from "$lib/dataService";
import { userTokens } from "$stores/credentials.store";
import { get } from "svelte/store";
import type { messages, elearningMessages } from "$types/messages";
import { persisted } from "svelte-persisted-store";
import { getInbox } from "$lib/-webmail/plugins/native/dataservice";
import { parseMail } from '@protontech/jsmimeparser';

let userID = get(userTokens).elearning.userID;

// Storing the IDs of notifications that have been read in a persisted store
//TODO: Add a way to remove notifications from the list
export const readNotifications = persisted("ReadNotifications", []);


function cleanUpFullMessage(fullMessage: string) {
    // Regular expression to match content between dashes
    const regex = /-{5,}\n([\s\S]*?)-{5,}/;

    // Extracting the content between dashes
    const match = fullMessage.match(regex);

    // Displaying the result
    if (match) {
    const extractedContent = match[1];
     return extractedContent;
    } else {
     return fullMessage;
    }
}

async function getElearningNotifications(refresh: boolean = false) {
    const body_Read = [
        {
            "index": 0,
            "methodname": "core_message_get_messages",
            "args": {
                "useridto": userID,
                "useridfrom": "0",
                "type": "notifications",
                "newestfirst": 1,
                "read": 1,
                "limitfrom": 0,
                "limitnum": 21
            }
        }
    ];

    const body_Unread = [
        {
            "index": 0,
            "methodname": "core_message_get_messages",
            "args": {
                "useridto": userID,
                "useridfrom": "0",
                "type": "notifications",
                "newestfirst": 1,
                "read": 0,
                "limitfrom": 0,
                "limitnum": 21
            }
        }
    ];
    const options = {forceFresh: refresh, lifetime: 60 * 15}
    const response_Read = await neoElearningGet(body_Read, options);
    const response_Unread = await neoElearningGet(body_Unread, options);

    let messages: elearningMessages;

    if (!response_Read.error){
        messages = response_Read.data;
    }
    else {
        messages = {
            messages: []
        }
    }

    if (!response_Unread.error){
        messages.messages = messages.messages.concat(response_Unread.data.messages);
    }

    let cleanMessages = messages.messages.map((message) => {
        return {
            type: message.useridfrom != -10 ? "elearning" : "system",
            subject: message.subject,
            body: cleanUpFullMessage(message.fullmessage),
            url: message.contexturl,
            sender: message.useridfrom != -10 ? message.userfromfullname : "eLearning System",
            dateReceived: new Date(message.timecreated * 1000),
            id: message.id
        };});
    return cleanMessages;
}

async function getUniversisNotifications(refresh: boolean = false) {
    const options = {forceFresh: refresh, lifetime: 60 * 60 * 24}
    let messages: messages = await neoUniversisGet("students/me/messages?$top=3", options);//&$filter=dateReceived eq null");


    let cleanMessages = messages.value.map((message) => {
        return {
            type: "universis",
            subject: message.subject ? message.subject : "Universis",
            body: message.body.toString().startsWith("<") ? message.subject : message.body.toString(),
            url: message.url,
            sender: "Universis",
            dateReceived: new Date(message.dateReceived),
            id: message.id
        };});
    return cleanMessages;
}

async function getWebmailNotifications(refresh: boolean = false) {
    const messages = await getInbox();
    if (messages.error) return [];
    
    let cleanMessages = messages.received.map((message) => {
        const {
            attachments,
            body,
            subject,
            from,
            to,
            date,
            ...rest
        } = parseMail(message.data);
        
        const cleanBody = (body.html ?? body.text ?? "").trim().replace(/<br>/g, "\n").replace(/<[^>]*>?/gm, '');

        return {
            type: "webmail",
            subject: subject ? subject : "Χωρίς θέμα",
            body: cleanBody,
            sender: from.name !== "" ? from.name : from.email ?? "Άγνωστος αποστολέας",
            dateReceived: date,
            url: "https://webmail.auth.gr",
            id: date?.getTime() ?? new Date().getTime()
        };
    });
    return cleanMessages;
}

type options = {
    refresh?: boolean | undefined;
    days?: number | undefined;
}

export async function gatherNotifications(options?: options){
    if (!options) options = {};

    let webmailNotifications = await getWebmailNotifications();
    let elearningNotifications = await getElearningNotifications(options.refresh);
    let universisNotifications = await getUniversisNotifications(options.refresh);

    let notifications = elearningNotifications.concat(webmailNotifications)
                        .filter((notification, index, self) => {
                            if (notification.type === "webmail") {
                                const hasMatchingElearning = self.some((otherNotification, otherIndex) => {
                                    return (
                                        otherIndex !== index &&
                                        ( otherNotification.type === "elearning" || otherNotification.type === "system" ) &&
                                        otherNotification.subject === notification.subject
                                    );
                                });
                                return !hasMatchingElearning;
                            }
                            return true;
                        })
                        .concat(universisNotifications)
                        .sort((a, b) => b.dateReceived.getTime() - a.dateReceived.getTime());

    if (options.days){
        notifications = notifications.filter((notification) => Math.floor((new Date().getTime() - notification.dateReceived.getTime()) / 1000) <= options.days * 86400);
    }
    return notifications;
}

export type notification = {
    type: string;
    subject: string;
    body: string;
    url: string;
    sender: string;
    dateReceived: Date;
    id: number;
};

