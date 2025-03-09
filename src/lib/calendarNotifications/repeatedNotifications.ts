import { addToScheduledNotifications, getIds, removeFromScheduledNotficiations } from "./notificationsStore";
import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { cutId, calcNotifDate, calcNotifId } from './notificationFunctions';
import { schedule } from './scheduleNotifications';
import { getEvents } from '$lib/components/calendar/event/EventStore';

// removes from the store the notifications that are already send
export function removePastNotifications(){
    let storedIds = getIds();
    const now = new Date();

    for (const storedId of storedIds){
        if (storedId.event.repeat != EventRepeatType.NEVER){
            const repeatUntil = new Date(storedId.event.repeatUntil);
            if ( now > repeatUntil ){
                removeFromScheduledNotficiations(storedId.event.id);
            }
        } else {
            const lastNotification = new Date(storedId.lastNotification);
            if ( now > calcNotifDate(storedId.event) ){
                removeFromScheduledNotficiations(storedId.event.id);              
            }
        }
    }
}

// checking if the date1:Date and date2:milliscs are in the same day, month and year 
function isSameDay(date1: Date, millisecs: number){
    const date2 = new Date(millisecs);

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
}

// checking if a certain date is deleted for an event
function isInactiveDate(notifDate: Date, eventId: number){
    const events = getEvents();
    const index = events.findIndex(x => x.id == eventId);
    const inactiveDates = events[index].inactiveDates; 

    for (const inactiveDate of inactiveDates || []){
        if (isSameDay(notifDate, inactiveDate)){
            return true;
        }
    }
    return false;
}

type options = {
    date: Date,
    isInactive: boolean
};

// calculates the next date of a notification from a repeated event
function nextNotifDate(event: Event, previousNotifDate: Date) :options {
    let repeatInterval = 0;
    if (event.repeatInterval) repeatInterval = event.repeatInterval;
    if (repeatInterval <= 0) repeatInterval = 1;

    let notifDate = new Date();  
    // repeats daily 
    if(event.repeat == EventRepeatType.DAILY) {
        notifDate = new Date(previousNotifDate);
        notifDate.setDate(previousNotifDate.getDate() + repeatInterval);    

    // repeats weekly
    } else if (event.repeat == EventRepeatType.WEEKLY) {
        notifDate = new Date(previousNotifDate);
        notifDate.setDate(previousNotifDate.getDate() + (repeatInterval * 7));

    // repeats monthly
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

    // repeats yearly
    } else if (event.repeat == EventRepeatType.YEARLY){
        const isSameDayOfYear = (date1: Date, date2: Date) => {
            return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
        };
        notifDate.setFullYear(previousNotifDate.getFullYear() + repeatInterval);
        while (!isSameDayOfYear(previousNotifDate, notifDate)){
            notifDate.setFullYear(notifDate.getFullYear() + repeatInterval);
        }

    }

    return {
        date: notifDate,
        isInactive: isInactiveDate(notifDate, event.id)
    };
}

// scheduling as many notifications inside the "daysToSchedule" threshold
export async function scheduleRepeatedNotifications(event: Event){
    let repeatUntil = new Date();
    if (event.repeatUntil) repeatUntil = new Date(event.repeatUntil);

    let notificationId = await calcNotifId(cutId(event.id));
    let notifyDate = calcNotifDate(event);
    let isInactive = isInactiveDate(notifyDate, event.id);
    let ids:number[] = [];
    
    while ( notifyDate < repeatUntil ){ 
        if (!isInactive){
            schedule(event, notifyDate, notificationId);
            ids.push(notificationId);
            notificationId++;
        }
        notifyDate = nextNotifDate(event, notifyDate).date;
        isInactive = isInactiveDate(notifyDate, event.id);
    }

    const storedIds = {
        event: event,
        notificationIds: ids
    };
    addToScheduledNotifications(storedIds);
}