import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';
import { cutId, calcNotifyDate } from './notificationFunctions';
import { scheduleRepeatedNotifications } from './repeatedNotifications';
import { getIds, removeFromScheduledNotficiations, addToScheduledNotifications} from "./notificationsStore";



// schedules a notification at a specific date
export async function schedule(event: Event, date: Date | undefined, id: number){
    
    let notifyDate: Date;
    if (date){
        notifyDate = new Date(date);
    } else {
        notifyDate = calcNotifyDate(event);
    }
    console.log(notifyDate);
    
    try{        
        await LocalNotifications.schedule({notifications: [{
            title: event.title,
            body: event.description ? event.description : "Νέα ειδοποίηση",
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

//cancels a scheduled notification
async function cancelNotifications(ids: number[]){ 
    console.log("cancel");
    try{    
        await LocalNotifications.cancel({
            notifications: ids.map(id => ({ id }))
        });
    }catch(ex){
        console.log(JSON.stringify(ex));
    }
}

// checking if a notification is scheduled for an event
async function isNotificationScheduled(id: number): Promise<boolean> {
    const notificationId = cutId(id);

    const pendingNotifications = await LocalNotifications.getPending();
    return pendingNotifications.notifications.some(notification => notification.id === notificationId);
}

export function scheduleNotification(event: Event, date: Date | undefined){
    // permissionsService.ensurePermission("POST_NOTIFICATIONS"); 
    const ids = getIds();
    let notifIds = [0];
    let flag = false;
    for (const id of ids){
        console.log(event.id+"-"+id.eventId);
        if (event.id === id.eventId){
            notifIds = [...id.notificationIds];
            flag = true;
        }
    }
    console.log(flag);
    console.log(notifIds);
    if (flag){
        cancelNotifications(notifIds);
        removeFromScheduledNotficiations(event.id);
    }

    if (event.repeat != EventRepeatType.NEVER){     
        scheduleRepeatedNotifications(event);
    } else {
        let notificationId = cutId(event.id);
        const storedIds = {
            eventId: event.id,
            notificationIds: [ notificationId ],
            repeats: false
        };
        addToScheduledNotifications(storedIds);

        schedule(event, undefined, notificationId);
    }
    getIds();
}