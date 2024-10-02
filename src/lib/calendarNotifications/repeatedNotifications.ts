import { addToScheduledNotifications, getIds, removeFromScheduledNotficiations } from "./notificationsStore";
import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { cutId, calcNotifyDate, calcNotifId } from './notificationFunctions';
import { schedule, scheduleNotification } from './scheduleNotifications';
import { LocalNotifications } from '@capacitor/local-notifications';

// removes from the store the notifications that are already send
export function removePastNotifications(){
    let storedIds = getIds();
    const now = new Date();
    
    for (const storedId of storedIds){
        if (storedId.event.repeat != EventRepeatType.NEVER){
            if ( now > storedId.event.repeatUntil ){
                removeFromScheduledNotficiations(storedId.event.id);
            }
        } else {
            if ( now > storedId.lastNotification ){
                removeFromScheduledNotficiations(storedId.event.id);              
            }
        }
    }
}

// calculates the next date of a notification from a repeated event
function nextNotifDate(event: Event, previousNotifDate: Date){
    let repeatInterval = 0;
    if (event.repeatInterval) repeatInterval = event.repeatInterval;
    if (repeatInterval <= 0) repeatInterval = 1;

    let notifDate = new Date();   
    if(event.repeat == EventRepeatType.DAILY) {
        notifDate = new Date(previousNotifDate);
        notifDate.setDate(previousNotifDate.getDate() + repeatInterval);    
        return notifDate;

    } else if (event.repeat == EventRepeatType.WEEKLY) {
        notifDate = new Date(previousNotifDate);
        notifDate.setDate(previousNotifDate.getDate() + (repeatInterval * 7));
        return notifDate;

    } else if (event.repeat == EventRepeatType.MONTHLY){        
        const isSameDayOfMonth = (date1: Date, date2: Date) => date1.getDate() === date2.getDate();

        notifDate = new Date(previousNotifDate);
        notifDate.setMonth(previousNotifDate.getMonth() + repeatInterval);
        let i = 0;
        while (!isSameDayOfMonth(previousNotifDate, notifDate)){
            i++;
            notifDate = new Date(previousNotifDate);
            notifDate.setMonth(previousNotifDate.getMonth() + (repeatInterval * i));
        }
        return notifDate;

    } else if (event.repeat == EventRepeatType.YEARLY){
        const isSameDayOfYear = (date1: Date, date2: Date) => {
            return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
        };
        notifDate.setFullYear(previousNotifDate.getFullYear() + repeatInterval);
        while (!isSameDayOfYear(previousNotifDate, notifDate)){
            notifDate.setFullYear(notifDate.getFullYear() + repeatInterval);
        }
        return notifDate;

    }
    return new Date();
}

// scheduling as many notifications inside the "daysToSchedule" threshold
export async function scheduleRepeatedNotifications(event: Event){
    let repeatUntil = new Date();
    if (event.repeatUntil) repeatUntil = new Date(event.repeatUntil);

    let notificationId = await calcNotifId(cutId(event.id));
    let notifyDate = calcNotifyDate(event);
    let lastDate = new Date();
    let ids:number[] = [];
    
    while ( notifyDate < repeatUntil ){ 
        schedule(event, notifyDate, notificationId);
        lastDate = new Date(notifyDate);
        notifyDate = nextNotifDate(event, notifyDate);
        ids.push(notificationId);
        notificationId++;
    }

    const storedIds = {
        event: event,
        notificationIds: ids,
        lastNotification: lastDate
    };
    addToScheduledNotifications(storedIds);
}