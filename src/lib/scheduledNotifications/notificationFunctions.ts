import type { Event } from '$lib/components/calendar/event/Event';

// taking the id from the event and removing the first 4 digits, because on Android it's a 32-bit int
export function cutId(id: number){
    let idStr = id.toString();
    if (idStr.length > 4){
        idStr = idStr.slice(4);
    }
    const notifId = parseInt(idStr, 10);
    return notifId;
}


export function calcNotifyDate(event: Event){
    let notifyDate: Date;

    // notifyTime can not be undefined, but checking just to avoid the warning
    if (event.notifyTime){

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