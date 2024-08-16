import { scheduledNotifications } from "./notificationsStore";
import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { cutId, calcNotifyDate } from './notificationFunctions';
import { scheduleNotification } from './scheduleNotifications';
import { logoGithub, logoOctocat } from "ionicons/icons";

const daysToSchedule = 900;

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
        notifDate.setDate(previousNotifDate.getDate() + repeatInterval);
        console.log(notifDate.toString());
        
        return notifDate;

    } else if (event.repeat == EventRepeatType.WEEKLY) {
        notifDate.setDate(previousNotifDate.getDate() + (repeatInterval * 7));
        return notifDate;

    } else if (event.repeat == EventRepeatType.MONTHLY){        
        const isSameDayOfMonth = (date1: Date, date2: Date) => date1.getDate() === date2.getDate();
        notifDate.setMonth(previousNotifDate.getMonth() + repeatInterval);
        console.log(notifDate.toString());
        
        while (!isSameDayOfMonth(previousNotifDate, notifDate)){
            console.log(3333);
            
            notifDate.setMonth(notifDate.getMonth() + repeatInterval);
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
    while (isDateInThreshold(notifyDate) && notifyDate < repeatUntil){
        console.log(notifyDate);  
        notifyDate = nextNotifDate(event, notifyDate);
    }
    
}