import type { Event } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getIds } from './notificationsStore';
import { cancelNotifications } from './scheduleNotifications';
import { removeFromScheduledNotficiations } from './notificationsStore';
import { scheduleRepeatedNotifications } from './repeatedNotifications';

// taking the id from the event and removing the first 4 digits, because on Android it's a 32-bit int
export function cutId(id: number){
    let idStr = id.toString();
    if (idStr.length > 4){
        idStr = idStr.slice(4);
    }
    const notifId = parseInt(idStr, 10);
    return notifId;
}

// calculate the date that the notification should be send
export function calcNotifDate(event: Event){
    let notifyDate: Date;

    if (event.notifyTime){
        //converting to milliseconds
        const notifyMinsEarly = event.notifyTime * 60 * 1000;
        let notifyTime = 0;

        // if the user resubmits the event event.slot.start is a string instead of a Date
        if (event.slot.start instanceof Date){
            notifyTime = event.slot.start.getTime() - notifyMinsEarly;
        }else{
            const startDate = new Date(event.slot.start);
            notifyTime = startDate.getTime() - notifyMinsEarly;
        }     
        notifyDate = new Date(notifyTime);

    } else {
        notifyDate = event.slot.start;
    }

    return notifyDate;
}

// ensuring that the notification id is not already pending
export async function calcNotifId(notificationId: number){
    try {
        // Get all pending notifications
        const { notifications } = await LocalNotifications.getPending();

        notificationId++;
        // Check if the specific notification is pending
        let isPending = notifications.some(notification=> notification.id === notificationId);
        while (isPending){
            notificationId+=50;
            isPending = notifications.some(notification=> notification.id === notificationId);
        }

        return notificationId;
    } catch (error) {
        console.error('Error fetching pending notifications', error);
        return notificationId;
    }
}

function cancelEventNotifications(event: Event){
    const notifIds = getIds();
    for (const notifid of notifIds){
        if (!notifid.notificationids) continue;

        if (notifid.event?.id !== event.id){
            cancelNotifications(notifid.notificationids);
            break;
        }
    }
}

// cancels all the notifications after the events are deleted
export function deleteEventNotifications(event: Event){
    cancelEventNotifications(event);
    removeFromScheduledNotficiations(event.id);
}

// cancels a specific notification after the event is deleted
export function deleteSingleEventNotification(event: Event){
    scheduleRepeatedNotifications(event); // this
}