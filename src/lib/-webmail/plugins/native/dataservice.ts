import { WebMailInboxPlugins } from "./nativeDefinitions";
import { userCreds } from "$stores/credentials.store";
import { get } from "svelte/store";
import appConfig from "$src/app.config";
import type { WebmailInboxRequestResponse } from "$lib/-webmail/types.ts";

export async function getInbox(): Promise<WebmailInboxRequestResponse> {
    const username = get(userCreds).username;
    const password = get(userCreds).password;
    const server = appConfig.webmail.server;
    const port = appConfig.webmail.port;
    const validate = false;
    const response = await WebMailInboxPlugins.getInbox({username, password, server, port, validate});

    if (response.error) {
        return {error: response.error};
    } else {
        let data = response.received;
        return {error: null, received : data};
    }
}

export async function validate(username: string, password: string): Promise<boolean> {
    const server = appConfig.webmail.server;
    const port = appConfig.webmail.port;
    const validate = true;
    const response = await WebMailInboxPlugins.getInbox({username, password, server, port, validate});
    return (!response.error);
}