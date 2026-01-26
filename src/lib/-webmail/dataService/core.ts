import { Capacitor } from "@capacitor/core";
import { getInbox as webInboxRequest, validate as webValidate } from "../plugins/webserver/dataservice";
import { getInbox as nativeIboxRequest, validate as nativeValidate } from "../plugins/native/dataservice";

export async function webmailInboxRequest() {
  return Capacitor.isNativePlatform()? await nativeIboxRequest() : await webInboxRequest();
}

export async function webmailCheckCredentials(username: string, password: string){
  return Capacitor.isNativePlatform()? await nativeValidate(username, password) : await webValidate(username, password);
}