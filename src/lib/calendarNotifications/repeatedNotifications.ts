import { addToScheduledNotifications, getIds, removeFromScheduledNotficiations } from "./notificationsStore";
import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { cutId, calcNotifyDate } from './notificationFunctions';
import { schedule } from './scheduleNotifications';

// const daysToSchedule = 365;
const daysToSchedule = 5; // 5 minutes for testing

// true if date is within the threshold
function isDateInThreshold(date: Date) {
    const now = new Date();
    const threshold = new Date(now);
    
    // threshold.setDate(now.getDate() + daysToSchedule);
    threshold.setMinutes(now.getMinutes() + daysToSchedule);
    // Check if the given date is before the threshold
    return date < threshold;
}

export function schedulePendingNotifications(){
    let storedIds = getIds();
    console.log('length'+storedIds.length);
    for (const storedId of storedIds){
        if (storedId.event.repeat != EventRepeatType.NEVER){
            let repeatUntil = new Date();
            if (storedId.event.repeatUntil) repeatUntil = new Date(storedId.event.repeatUntil);

            let notifyDate = new Date(storedId.lastNotification);
            let lastDate = new Date(notifyDate);
            notifyDate = nextNotifDate(storedId.event, notifyDate);
            let storedNotifIds = [...storedId.notificationIds];
            let notificationId = storedNotifIds[storedNotifIds.length - 1];
            console.log(storedId.event.title);
            console.log("last id"+notificationId);
            console.log("last date"+ storedId.lastNotification);
            while (isDateInThreshold(notifyDate) && notifyDate < repeatUntil ){
                schedule(storedId.event, notifyDate, notificationId);
                lastDate = new Date(notifyDate);
                notifyDate = nextNotifDate(storedId.event, notifyDate);
                storedNotifIds.push(notificationId);
                notificationId++;
            }
            console.log(storedNotifIds)
            const Ids = {
                event: storedId.event,
                notificationIds: storedNotifIds,
                lastNotification: lastDate
            };
            removeFromScheduledNotficiations(storedId.event.id);
            addToScheduledNotifications(Ids);
        }
    }

}

// calculates the next date of a notification from a repeated event
function nextNotifDate(event: Event, previousNotifDate: Date){
    let repeatInterval = 0;
    if (event.repeatInterval) repeatInterval = event.repeatInterval;

    let notifDate = new Date();   
    if(event.repeat == EventRepeatType.DAILY) {
        notifDate = new Date(previousNotifDate);
        // notifDate.setDate(previousNotifDate.getDate() + repeatInterval);    
        notifDate.setMinutes(previousNotifDate.getMinutes() + repeatInterval); // for testing
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
export function scheduleRepeatedNotifications(event: Event){
    let repeatUntil = new Date();
    if (event.repeatUntil) repeatUntil = new Date(event.repeatUntil);

    let notificationId = cutId(event.id);
    let notifyDate = calcNotifyDate(event);
    let lastDate = new Date();
    let ids:number[] = [];
    while (isDateInThreshold(notifyDate) && notifyDate < repeatUntil){ 
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