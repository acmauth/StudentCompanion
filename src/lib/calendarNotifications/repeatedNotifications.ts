import { scheduledNotifications } from "./notificationsStore";
import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { calcNotifyDate } from './notificationFunctions';
import { schedule } from './scheduleNotifications';

const daysToSchedule = 365;

//Adding the exam to the dismissed items
function addToScheduledNotifications(id: number){
    scheduledNotifications.update(ids => [...ids, id]);
}

// Removing the exam from the dismissed items
function removeFromScheduledNotficiations(id: number){
    scheduledNotifications.update((items) => items.filter((item) => false));
}

// true if date is within the threshold
function isDateInThreshold(date: Date) {
    const now = new Date();
    const threshold = new Date(now);
    
    // Adjust for x days later
    threshold.setDate(now.getDate() + daysToSchedule);

    // Check if the given date is between now and x days from now
    return date < threshold;
}

function nextNotifDate(event: Event, previousNotifDate: Date){
    let repeatInterval = 0;
    if (event.repeatInterval) repeatInterval = event.repeatInterval;
    
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
export function scheduleRepeatedNotifications(event: Event){
    let repeatUntil = new Date();
    if (event.repeatUntil) repeatUntil = new Date(event.repeatUntil);

    let notifyDate = calcNotifyDate(event);  
    let date = new Date();  
    while (isDateInThreshold(notifyDate) && notifyDate < repeatUntil){
        console.log(notifyDate);  
        schedule(event, notifyDate);
        notifyDate = nextNotifDate(event, notifyDate);
    }
}