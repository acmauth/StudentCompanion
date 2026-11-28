import { Network } from '@capacitor/network';
import { apiRequest as internalElearningGet } from "./elearning/dataService/core";
import { apiRequest as internalUniversisGet } from "./universis/dataService/core";
import { webmailInboxRequest as internalWebmailInbox} from "./webmail/dataService/core";
import { getCached, setCached } from "./storage/cache/cache";
import { AuthExpiredError } from "./errors";

type options = {
    forceFresh?: boolean | undefined;
    lifetime?: number | undefined;
}

// This is a wrapper for the Universis API.
// It's a simple GET request with a token in the header.
export const universisGet = async (endpoint: string) => {

  const response = await internalUniversisGet(endpoint);
  return response;

};

export async function elearningGet(dataArguments: any){

  const response =  await internalElearningGet(dataArguments);
  return response;

}

export async function webmailInboxRequest() {

  const response = await internalWebmailInbox();
  return response;

}

async function cachedWebmailInbox (options?: options): Promise<any> {
    if (!options) options = {};
    const key = `webmail_inbox`;
    const cached = await getCached(key);
    if (cached.exists && (!cached.expired && !options.forceFresh || !(await Network.getStatus()).connected)){
        return cached.value;
    } else {
        const response = await webmailInboxRequest();
        setCached(key, response, options.lifetime);
        return response;
    }
}

async function cachedUniversisGet (endpoint: string, options?: options): Promise<any> {
    if (!options) options = {};
    const key = `universis_${endpoint}`;
    const cached = await getCached(key);
    if (cached.exists && (!cached.expired && !options.forceFresh || !(await Network.getStatus()).connected)){
        return cached.value;
    }

    try {
        const response = await universisGet(endpoint);
        setCached(key, response, options.lifetime);
        return response;
    } catch (error) {
        if (cached.exists && !(error instanceof AuthExpiredError)) {
            console.warn(`[cachedUniversisGet] Serving stale ${key}:`, error);
            return cached.value;
        }
        throw error;
    }
}

async function cachedElearningGet(data: any, options?: options): Promise<any> {
    if (!options) options = {};
    const key = `elearning_${JSON.stringify(data)}`;
    const cached = await getCached(key);
    if (cached.exists && (!cached.expired && !options.forceFresh || !(await Network.getStatus()).connected)){
        return cached.value;
    } else {
        const response = await elearningGet(data);
        setCached(key, response, options.lifetime);
        return response;
    }

}

export { cachedUniversisGet as neoUniversisGet, cachedElearningGet as neoElearningGet, cachedWebmailInbox as neoWebmailInbox};
