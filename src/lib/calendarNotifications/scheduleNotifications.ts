import type { Event } from '$lib/components/calendar/event/Event';
import { Capacitor } from '@capacitor/core';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';
import { cutId, calcNotifDate, calcNotifId } from './notificationFunctions';
import { scheduleRepeatedNotifications,} from './repeatedNotifications';
import { getIds, addToScheduledNotifications, removeFromScheduledNotficiations } from "./notificationsStore";
import { getEventTypeValue } from '$lib/components/calendar/event/Event';
import { t, getLocale} from "$lib/i18n";
import { get } from 'svelte/store';

// schedules a notification at a specific date
export async function schedule(event: Event, notifyDate: Date, id: number){
    try{     
        const notification: any = {  
            title: event.title,
            body: event.description ? event.description : `${get(t)("event.notification.descriptionPlaceholder")} ${getEventTypeValue(event.type, getLocale())}`,
            id: id,
            schedule: {
                at: notifyDate,
                allowWhileIdle: true
            }
        };
        
        // largeIcon and smallIcon are Android-only parameters
        if (Capacitor.getPlatform() === 'android') {
            notification.largeIcon = "res://drawable/logo.";
            notification.smallIcon = "res://drawable/logo";
        }
        
        await LocalNotifications.schedule({notifications: [notification]});

    }catch(ex){
        console.log(JSON.stringify(ex));
        
    }
}

//cancels certain scheduled notifications
export async function cancelNotifications(ids: number[]){ 
    try{    
        await LocalNotifications.cancel({
            notifications: ids.map(id => ({ id }))
        });
    }catch(ex){
        console.log(JSON.stringify(ex));
    }
}

function isResubmitted(event: Event){
    // check if the the user resubmits the same event
    const ids = getIds();
    for (const id of ids){
        if (event.id === id.event.id){
            return {
                flag: true,
                notifIds: id.notificationIds
            };
        }
    }
    return {
        flag: false,
        notifIds: []
    };
}


// handles the calendar notifications
export async function scheduleNotification(event: Event){
    const resubmitted = isResubmitted(event);
    const notifIds = resubmitted.notifIds;
    const flag = resubmitted.flag;
    
    // cancel the previous notifications if the user resubmits
    if (flag){
        cancelNotifications(notifIds);
        removeFromScheduledNotficiations(event.id);
    }

    // schedule repeated or single notifications
    if (event.repeat != EventRepeatType.NEVER){     
        scheduleRepeatedNotifications(event);

    } else {
        const notificationId = await calcNotifId(cutId(event.id));
        const notifyDate = calcNotifDate(event);
        const storedIds = {
            event: event,
            notificationIds: [ notificationId ],
            lastNotification: notifyDate,
        };
        addToScheduledNotifications(storedIds);

        schedule(event, notifyDate, notificationId);
    }
}