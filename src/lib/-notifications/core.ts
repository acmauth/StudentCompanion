import { Capacitor } from "@capacitor/core";
import { NotificationService } from "./nativedefs";
const isNative = Capacitor.isNativePlatform();

export default async function initializeNotifications() {
    if (isNative){
        await NotificationService.initialize();
    }
    else {
        return;
    }
}