import { universisGet, elearningGet } from "$lib/dataService";
import UserInfoStore from "$stores/userinfo.store";
import { get } from "svelte/store";
import type { messages, elearningMessages } from "$types/messages";
import { persisted } from "svelte-persisted-store";


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

async function getElearningNotifications() {
    const body_Read = [
        {
            "index": 0,
            "methodname": "core_message_get_messages",
            "args": {
                "useridto": get(UserInfoStore).userId,
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
                "useridto": get(UserInfoStore).userId,
                "useridfrom": "0",
                "type": "notifications",
                "newestfirst": 1,
                "read": 0,
                "limitfrom": 0,
                "limitnum": 21
            }
        }
    ];
    
    const response_Read = await elearningGet(body_Read);
    const response_Unread = await elearningGet(body_Unread);

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
    console.log(cleanMessages);
    return cleanMessages;
}

async function getUniversisNotifications() {
    let messages: messages = await universisGet("students/me/messages?$top=3");//&$filter=dateReceived eq null");
    
    console.log(messages);

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
    console.log(cleanMessages);
    return cleanMessages;
}

export async function gatherNotifications(){

    let elearningNotifications = await getElearningNotifications();
    let universisNotifications = await getUniversisNotifications();

    let notifications = elearningNotifications.concat(universisNotifications).sort((a, b) => b.dateReceived.getTime() - a.dateReceived.getTime());
    
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

