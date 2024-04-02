import { WebMailInboxPlugins } from "./nativeDefinitions";
import type { WebmailInboxRequest, WebmailInboxRequestResponse } from "./nativeDefinitions";

export async function getInbox(request: WebmailInboxRequest): Promise<WebmailInboxRequestResponse> {
    const {username, password, server, port} = request;
    const response = await WebMailInboxPlugins.getInbox({username, password, server, port});

    console.log(response);

    if (response.error) {
        return {error: response.error};
    } else {
        let data = JSON.parse(response.received);
        return {error: null, received : data};
    }
}