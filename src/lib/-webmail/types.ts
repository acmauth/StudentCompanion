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