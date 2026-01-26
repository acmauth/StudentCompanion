// import { connect } from 'imap-simple';
import { userCreds } from "$stores/credentials.store";
import { get } from "svelte/store";
import appConfig from "$src/app.config";
import type { WebmailInboxRequestResponse } from "$lib/-webmail/types.ts";

export async function getInbox(): Promise<WebmailInboxRequestResponse> {
    const inboxData = await fetch("/_webmailService", {
        method: "POST",
        body: JSON.stringify({  username : get(userCreds).username,
                                password : get(userCreds).password,
                                server : appConfig.webmail.server,
                                port : appConfig.webmail.port,
                                count : 8
                              })
    });

    let response = await inboxData.json();
    
    return response as WebmailInboxRequestResponse;
}

export async function validate(username: string, password: string): Promise<boolean> {
    const inboxData = await fetch("/_webmailService", {
        method: "POST",
        body: JSON.stringify({  username : username,
                                password : password,
                                server : appConfig.webmail.server,
                                port : appConfig.webmail.port,
                                validate : true,
                                count : 8
                              })
    });

    return inboxData.ok;
}