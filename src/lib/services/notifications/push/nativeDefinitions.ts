import { registerPlugin } from '@capacitor/core';

export interface NotificationServicePlugin {
    initialize(): null;
}


export const NotificationService = registerPlugin<NotificationServicePlugin>('NotificationServiceInitiator');