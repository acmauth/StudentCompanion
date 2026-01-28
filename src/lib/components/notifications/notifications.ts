import { neoUniversisGet, neoElearningGet, neoWebmailInbox } from "$lib/dataService";
import { userTokens } from "$stores/credentials.store";
import { get } from "svelte/store";
import type { messages, elearningMessages } from "$types/messages";
import { parseMail } from '@protontech/jsmimeparser';
import { webmailLoggedIn as webmailAuthenticated} from '$components/webmailLogin/userCredsFlagStore';

let userID = get(userTokens).elearning.userID;

// Storing the IDs of notifications that have been read in a persisted store
//TODO: Add a way to remove notifications from the list
// export const readNotifications = persisted("ReadNotifications", []);


function cleanUpFullMessage(fullMessage: string) {
    let content = fullMessage;

    // Regular expression to match content between dashes
    const regex = /-{5,}\n([\s\S]*?)-{5,}/;

    // Extracting the content between dashes
    const match = fullMessage.match(regex);

    // Encapsulating URLs with anchor tags
    if (match) {
        const extractedContent = match[1];
        const replacedContent = extractedContent.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
        return replacedContent;
    } else {
        return fullMessage;
    }

}

async function getWebmailNotifications(refresh: boolean = false) {
    const options = {forceFresh: refresh, lifetime: 60 * 15}

    try {

        const messages = await neoWebmailInbox(options);
        if (messages.error) return [];
        
        let cleanMessages = messages.received.map((message: any) => {
        const {
            attachments,
            body,
            subject,
            from,
            to,
            date,
            ...rest
        } = parseMail(message.data);
        
        const cleanBody = (body.html ?? body.text ?? "");
        
        return {
            type: "webmail",
            subject: subject ? subject : "Χωρίς θέμα",
            body: cleanBody,
            sender: from?.name ? from.name : from?.email ?? "Άγνωστος αποστολέας",
            email: from?.email ?? "Άγνωστος αποστολέας",
            dateReceived: date,
            url: "https://webmail.auth.gr",
            id: date?.getTime() ?? new Date().getTime()
        };
    });
        return cleanMessages;
    }
    catch (error) {
        console.error(error);
        return [];
    }

}


async function getUniversisMessages(refresh: boolean = false) {
    const options = {forceFresh: refresh, lifetime: 60 * 15}
    const daysToFetch = 30;
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timezoneOffset);
    date.setDate(date.getDate() - daysToFetch);
    const formattedDate = date.toISOString().replace('Z', ''); // Using ISO string format
    console.log(`Fetching universis messages since ${formattedDate}`);
    const requestURL = `students/me/messages?$orderby=dateReceived desc, dateCreated desc&$filter=dateCreated gt '${formattedDate}'&$top=8`;
    console.log(`Request URL: ${requestURL}`);
    const messages = await neoUniversisGet(requestURL, options);
    if (messages.error) return [];

    const notificationMessages = messages.value.map((message: any):notification => {
        return {
            type: "universis",
            subject: message.subject ? message.subject : "Χωρίς θέμα",
            body: message.body? message.body: "Χωρίς περιεχόμενο",
            sender: "Universis",
            url: "https://universis.auth.gr",
            dateReceived: new Date(message.dateReceived? message.dateReceived : message.dateCreated),
            id: message.id
        };
    });
    return notificationMessages;
}


// filter out the elearning and universis notifications from the webmail ones, and return them seperatly
function filterWebmailNotifications(webmailNotifications: any[]){
    const notifications: {webmail: any[]; elearning: any[]; universis: any[]} = {
        webmail: [],
        elearning: [],
        universis: []
    };

    for (const webmailNotification of webmailNotifications){
        // console.log(webmailNotification);
        if (webmailNotification.sender.includes("(μέσω elearning_auth_gr)")){
            webmailNotification.type = "elearning";
            notifications.elearning.push(webmailNotification);
        } else if (webmailNotification.sender.includes("sis-no-reply@auth.gr")){
            continue;
            webmailNotification.type = "universis";
            notifications.universis.push(webmailNotification);
        }
         else {
            notifications.webmail.push(webmailNotification);
        }
    }
    return notifications;
}

type options = {
    refresh?: boolean | undefined;
    days?: number | undefined;
}

export async function gatherNotifications(options?: options){
    if (!options) options = {};

    let webmailNotifications: ConcatArray<any> = get(webmailAuthenticated) ? await getWebmailNotifications(options.refresh): [];

    const filteredNotifications = filterWebmailNotifications(webmailNotifications as any[]);
    webmailNotifications = filteredNotifications.webmail;
    const elearningNotifications = filteredNotifications.elearning;
    // const universisNotifications = filteredNotifications.universis;
    const universisNotifications = await getUniversisMessages(options.refresh);

    let notifications = elearningNotifications.concat(webmailNotifications)
                        .filter((notification, index, self) => {
                            if (notification.type === "webmail") {
                                const hasMatchingElearning = self.some((otherNotification, otherIndex) => {
                                    return (
                                        otherIndex !== index &&
                                        otherNotification.type === "elearning" &&
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
        notifications = notifications.filter((notification) => Math.floor((new Date().getTime() - notification.dateReceived.getTime()) / 1000) <= options.days! * 86400);
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
    email?: string;
};

