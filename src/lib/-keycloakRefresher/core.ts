import { Capacitor } from "@capacitor/core";
import { PushNotifications } from '@capacitor/push-notifications';
const isNative = Capacitor.isNativePlatform();

export default async function initializeRefresherService() {
    if (isNative){
        await RefresherService.initialize();
    }
    else {
        return;
    }
}

import { registerPlugin } from '@capacitor/core';

export interface RefresherServicePlugin {
    initialize(): null;
}


export const RefresherService = registerPlugin<RefresherServicePlugin>('RefresherServiceInitiator');