import { WebMailInboxPlugins } from "./nativeDefinitions";
import { userCreds } from "$stores/credentials.store";
import { get } from "svelte/store";
import type { WebmailInboxRequestResponse } from "$lib/-webmail/types.ts";

export async function getInbox(): Promise<WebmailInboxRequestResponse> {
    const username = get(userCreds).username;
    const password = get(userCreds).password;
    const server = 'mail.auth.gr';
    const port = '993';
    const response = await WebMailInboxPlugins.getInbox({username, password, server, port});

    if (response.error) {
        return {error: response.error};
    } else {
        let data = response.received;
        return {error: null, received : data};
    }
}