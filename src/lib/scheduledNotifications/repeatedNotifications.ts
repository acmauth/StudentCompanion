import { scheduledNotifications } from "./scheduledNotifications";
import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { cutId, calcNotifyDate } from './notificationFunctions';
import { scheduleNotification } from './calendarNotifications';

const daysToSchedule = 30;

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
    return date >= now && date < threshold;
}

function repeatedNotifDate(event: Event, previousNotifDate: Date){
    let repeatInterval = 0;
    if (event.repeatInterval) repeatInterval = event.repeatInterval;

    let notifDate = new Date();
    if(event.repeat == EventRepeatType.DAILY) {
        notifDate.setDate(previousNotifDate.getDate() + repeatInterval);
        return notifDate;
    } else if (event.repeat == EventRepeatType.WEEKLY) {
        notifDate.setDate(previousNotifDate.getDate() + (repeatInterval * 7));
        return notifDate;
    } else if (event.repeat == EventRepeatType.MONTHLY){
        const isSameDayOfMonth = (date1: Date, date2: Date) => date1.getDate() === date2.getDate();
    }
}

// scheduling as many notifications inside the "daysToSchedule" threshold
function scheduleRepeatedNotifications(event: Event){
    let repeatUntil = new Date();
    if (event.repeatUntil) repeatUntil = new Date(event.repeatUntil);

    const notifyDate = calcNotifyDate(event);
    while (isDateInThreshold(notifyDate) && notifyDate < repeatUntil){
        scheduleNotification(event, notifyDate);
    }

}