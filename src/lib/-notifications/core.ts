import { Capacitor } from "@capacitor/core";
import { NotificationService } from "./nativedefs";
import { PushNotifications } from '@capacitor/push-notifications';
const isNative = Capacitor.isNativePlatform();

export default async function initializeNotifications() {
    if (isNative){
        await registerNotifications();
        await NotificationService.initialize();
    }
    else {
        return;
    }
}

const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
  
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
  
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

  }