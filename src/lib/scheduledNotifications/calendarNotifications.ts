import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';

// taking the id from the event and removing the first 4 digits, because on Android it's a 32-bit int
function cutId(id: number){
    let idStr = id.toString();
    if (idStr.length > 4){
        idStr = idStr.slice(4);
    }
    const notifId = parseInt(idStr, 10);
    return notifId;
}

// schedules a notification at a specific date
export async function scheduleNotification(event: Event){
    
    let notifyDate: Date;
    console.log(event);
    
    // notifyTime can not be undefined, but checking to avoid the warning
    if (event.notifyTime){

        const notifyMinsEarly = event.notifyTime * 60 * 1000;
        let notifyTime = 0;

        // if the user resubmits event.slot.start is a string instead of a Date
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
    console.log(notifyDate.toString());
    
    const notificationId = cutId(event.id);
    console.log(notificationId);
    
    if (event.repeat == EventRepeatType.NEVER){   
        try{   
            console.log(1111111);      
            await LocalNotifications.schedule({notifications: [{
                title: event.title,
                body: event.description ? event.description : "Νέα ειδοποίηση",
                id: notificationId,
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
    } else {
        try{     
            console.log(222222);
                
            await LocalNotifications.schedule({notifications: [{
                title: event.title,
                body: event.description ? event.description : "Νέα ειδοποίηση",
                id: notificationId,
                largeIcon: "res://drawable/logo.",
                smallIcon: "res://drawable/logo",
                schedule: {
                    at: notifyDate,
                    allowWhileIdle: true,
                    every: 'hour'
                }
            }]});
        }catch(ex){
            console.log(JSON.stringify(ex));
            
        }
    }
}

//cancels a scheduled notification
export async function cancelNotification(id: number){
    const notificationId = cutId(id);
    console.log(1234);
    
    try{    
        await LocalNotifications.cancel({notifications: [{
            id: notificationId
        }]});
    }catch(ex){
        console.log(JSON.stringify(ex));
    }
}

// checking if a notification is scheduled for an event
export async function isNotificationScheduled(id: number): Promise<boolean> {
    const notificationId = cutId(id);

    const pendingNotifications = await LocalNotifications.getPending();
    return pendingNotifications.notifications.some(notification => notification.id === notificationId);
}