import { registerPlugin } from '@capacitor/core';

export interface WebMailInboxPlugin {
    getInbox(options: { username: string, password: string, server: string, port: string }): Promise<WebmailInboxRequestResponse>;
}


export const WebMailInboxPlugins = registerPlugin<WebMailInboxPlugin>('WebmailInboxScraper');