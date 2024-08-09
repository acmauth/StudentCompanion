import { scheduledNotifications } from "./scheduledNotifications";
import type { Event } from '$lib/components/calendar/event/Event';
import { cutId, calcNotifyDate } from './functions';
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

// scheduling as many notifications inside the "daysToSchedule" threshold
function scheduleRepeatedNotifications(event: Event){
    const notifyDate = calcNotifyDate(event);
    while (isDateInThreshold(notifyDate)){
        scheduleNotification(event, notifyDate);
    }

}