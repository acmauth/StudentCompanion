import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';
import { cutId, calcNotifyDate } from './functions';



// schedules a notification at a specific date
export async function scheduleNotification(event: Event){
    
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
                    at: calcNotifyDate(event),
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