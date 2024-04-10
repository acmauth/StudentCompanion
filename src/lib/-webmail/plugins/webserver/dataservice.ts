// import { connect } from 'imap-simple';
import { userCreds } from "$stores/credentials.store";
import { get } from "svelte/store";
import type { WebmailInboxRequestResponse } from "$lib/-webmail/types.ts";

export async function getInbox(): Promise<WebmailInboxRequestResponse> {
    const inboxData = await fetch("/_webmailService", {
        method: "POST",
        body: JSON.stringify({  username : get(userCreds).username,
                                password : get(userCreds).password,
                                server : 'mail.auth.gr',
                                port : 993,
                                count : 8
                              })
    });

    let response = await inboxData.json();
    
    return response as WebmailInboxRequestResponse;
}
