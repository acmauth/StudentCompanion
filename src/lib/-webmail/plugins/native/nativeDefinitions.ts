import { registerPlugin } from '@capacitor/core';

export type WebmailInboxRequestResponse = {
    error: string;
    received?: undefined;
} | {
    error: null;
    received: any;
}

export type WebmailInboxRequest = {
    username: string,
    password: string,
    server: string,
    port: string
}

export interface WebMailInboxPlugin {
    getInbox(options: { username: string, password: string, server: string, port: string }): Promise<WebmailInboxRequestResponse>;
}


export const WebMailInboxPlugins = registerPlugin<WebMailInboxPlugin>('WebmailInboxScraper');