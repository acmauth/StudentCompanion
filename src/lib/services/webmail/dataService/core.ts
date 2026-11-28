import { Capacitor } from "@capacitor/core";
import { getInbox as webInboxRequest, validate as webValidate } from "$services/webmail/plugins/webserver/dataService";
import { getInbox as nativeIboxRequest, validate as nativeValidate } from "$services/webmail/plugins/native/dataService";

export async function webmailInboxRequest() {
  return Capacitor.isNativePlatform()? await nativeIboxRequest() : await webInboxRequest();
}

export async function webmailCheckCredentials(username: string, password: string){
  return Capacitor.isNativePlatform()? await nativeValidate(username, password) : await webValidate(username, password);
}