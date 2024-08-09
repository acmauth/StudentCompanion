import { scheduledNotifications } from "./scheduledNotifications";
import type { Event } from '$lib/components/calendar/event/Event';

const daysToSchedule = 30;

//Adding the exam to the dismissed items
function addToScheduledNotifications(id: number){
    scheduledNotifications.update(ids => [...ids, id]);
}

// Removing the exam from the dismissed items
function removeFromScheduledNotficiations(id: number){
    scheduledNotifications.update((items) => items.filter((item) => false));
}

// scheduling as many notifications inside the "daysToSchedule" threshold
function scheduleRepeatedNotifications(event: Event){
    

}