// import { universisGet as internalUniversisGet } from "./universisAuthentication/universisDataService";
import { apiRequest as internalElearningGet } from "./-elearning-deprecated/dataService/core";
import { apiRequest as internalUniversisGet } from "./-universis/dataService/core";
import { webmailInboxRequest as internalWebmailInbox} from "./-webmail/dataService/core";
import { cachedUniversisGet, cachedElearningGet, cachedWebmailInbox } from "./cachedDataService/cachedDataservice";

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

export { cachedUniversisGet as neoUniversisGet, cachedElearningGet as neoElearningGet, cachedWebmailInbox as neoWebmailInbox};