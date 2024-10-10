import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';
import { cutId, calcNotifyDate, calcNotifId } from './notificationFunctions';
import { scheduleRepeatedNotifications,} from './repeatedNotifications';
import { getIds, addToScheduledNotifications, removeFromScheduledNotficiations } from "./notificationsStore";
import { getEventTypeValue } from '$lib/components/calendar/event/Event';
import { t, getLocale} from "$lib/i18n";
import { get } from 'svelte/store';

// schedules a notification at a specific date
export async function schedule(event: Event, notifyDate: Date, id: number){

    try{        
        await LocalNotifications.schedule({notifications: [{
            title: event.title,
            body: event.description ? event.description : `${get(t)("event.notification.descriptionPlaceholder")} ${getEventTypeValue(event.type, getLocale())}`,
            id: id,
            largeIcon: "res://drawable/logo.",
            smallIcon: "res://drawable/logo",
            schedule: {
                at: notifyDate,
                allowWhileIdle: true
            }
        }]});

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

// handles the calendar notifications
export async function scheduleNotification(event: Event){

    // check if the the user resubmits the same event
    const ids = getIds();
    let notifIds = [0]; 
    let flag = false;
    for (const id of ids){
        if (event.id === id.event.id){
            notifIds = [...id.notificationIds];
            flag = true;
        }
    }
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
        const notifyDate = calcNotifyDate(event);
        const storedIds = {
            event: event,
            notificationIds: [ notificationId ],
            lastNotification: notifyDate,
        };
        addToScheduledNotifications(storedIds);

        schedule(event, notifyDate, notificationId);
    }
}