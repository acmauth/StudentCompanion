import type { Event } from '$lib/components/calendar/event/Event';
import { EventRepeatType } from '$lib/components/calendar/event/Event';
import { LocalNotifications } from '@capacitor/local-notifications';

export async function setNotif(event: Event){
    
    let notifyDate: Date;
    if (event.notifyTime){
        const notifyMinsEarly = event.notifyTime * 60 * 1000;

        const notifyTime = event.slot.start.getTime() - notifyMinsEarly;
        notifyDate = new Date(notifyTime);
    } else {
        notifyDate = event.slot.start;
    }
    console.log(notifyDate.toString());
    
    if (event.repeat == EventRepeatType.NEVER){
        console.log(1111111111);
        await LocalNotifications.schedule({notifications: [{
            title: event.title? event.title : 'Νέα ειδοποίηση',
            body: event.description? event.description : 'Υπάρχει μια νέα ενημέρωση που μπορεί να σας ενδιαφέρει.',
            id: event.id,
            schedule: {
                at: notifyDate,
                allowWhileIdle: true
            }
        }]})
    } else {
        console.log(2222222);
        
        await LocalNotifications.schedule({notifications: [{
            title: event.title? event.title : 'Νέα ειδοποίηση',
            body: event.description? event.description : 'Υπάρχει μια νέα ενημέρωση που μπορεί να σας ενδιαφέρει.',
            id: event.id,
            schedule: {
                at: notifyDate,
                allowWhileIdle: true,
                every: event.repeat
            }
        }]})
    }
}