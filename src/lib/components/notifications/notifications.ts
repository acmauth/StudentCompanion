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
            attachments, // [{ contentType: 'image/gif', fileName: 'smile.gif', content: Uint8Array[71, 73, 70..], ... }]
            body, // { text: 'Hello Alice.\nThis is..', html: '' }
            subject, // 'Test message'
            from, // // { name: 'Bob Example', email: 'bob@internet.com' }
            to, // [{ name: 'Alice Example', email: 'alice@internet.com' }]
            date, // Date('Wed, 20 Aug 2003 16:02:43 -0500')
            ...rest // headers and more
          } = parseMail(message.Body);

          return {
            type: "webmail",
            subject: subject ? subject : "Χωρίς θέμα",
            body: body.html ? body.html : body.text,
            sender: from ? from.name : message.From_Address,
            dateReceived: date,
            url: "https://webmail.auth.gr",
            id: parseInt(message.Id)
          }

        return {
            type: "webmail",
            subject: message.Subject ? new String(message.Subject).split(" ").map(encodedWordsToText).join("") : "Χωρίς θέμα",
            body: message.Body ? formatWebmailBody(new String(message.Body)) : "Χωρίς περιεχόμενο",
            sender: message.From_Name ? new String(message.From_Name).split(" ").map(encodedWordsToText).join("") : message.From_Address,
            dateReceived: new Date(message.Date),
            url: "https://webmail.auth.gr",
            id: parseInt(message.Id)
        };});

    return cleanMessages;
}

function formatWebmailBody(body: String) {
    if (body.includes("MIME format") && body.includes("Content-Type:")) {
        return (body.toString());
    } else if (body.includes("=?UTF-8")) {
        return body.split(" ").map(encodedWordsToText).join("")
    } else {
        return body;
    }

}

function encodedWordsToText(encodedWords: string): string {     
    const encodedWordRegex = /\=\?(.+)\?([B|Q])\?(.+)\?\=/;
    const match = encodedWords.match(encodedWordRegex);
    if (!match) {
        return " " + encodedWords + " ";
    }
    const [, charset, encoding, encodedText] = match;
    let byteString: Buffer;
    if (encoding === 'B') {
        byteString = Buffer.from(encodedText, 'base64');
    } else if (encoding === 'Q') {
        byteString = Buffer.from(encodedText, 'binary');
    } else {
        return " " + encodedWords + " ";
    }
    return byteString.toString(charset);
}

type options = {
    refresh?: boolean | undefined;
    days?: number | undefined;
}

export async function gatherNotifications(options?: options){
    if (!options) options = {};

    // TODO: Use credentials from the credentials store and invoke them in the -webmail folder, instead of here for consistency (see -universis authentication)
    // So the call in here should look like this: webmailDataservice.getInbox();
    // Also might be worth to consider caching in the future
    let webmailNotifications = await getWebmailNotifications();
    let elearningNotifications = await getElearningNotifications(options.refresh);
    let universisNotifications = await getUniversisNotifications(options.refresh);

    let notifications = elearningNotifications.concat(webmailNotifications).concat(universisNotifications).sort((a, b) => b.dateReceived.getTime() - a.dateReceived.getTime());

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

