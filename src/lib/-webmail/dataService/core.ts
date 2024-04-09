import { Capacitor } from "@capacitor/core";
import { getInbox as webInboxRequest } from "../plugins/webserver/dataservice";
import { getInbox as nativeIboxRequest } from "../plugins/native/dataservice";

export async function webmailInboxRequest() {
  return Capacitor.isNativePlatform()? await nativeIboxRequest() : await webInboxRequest();
}