export interface EventTimeSlot {
    start: Date,
    end: Date
}

export enum EventType {
    TASK = "TASK",
    TEST = "TEST",
    ASSIGNMENT = "ASSIGNMENT",
    CLASS = "CLASS",
    OTHER = "OTHER"
}

export interface Event {
    id: number;
    title: string;
    slot: EventTimeSlot;
    location?: string ;
    description: string;
    professor?: string,
    type: EventType;
    repeat: EventRepeatType;
    repeatInterval?: number;
    repeatUntil?: Date;
    notify: boolean;
    notifyTime?: number;
}

export enum EventRepeatType {
    NEVER = "NEVER",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}

export function getEventTypeValue(type: string, lang?: string): string {
    const eventType = EventType[type as keyof typeof EventType];
    switch (eventType) {
        case EventType.TASK:
            return lang == 'el' ? 'Δραστηριότητα' : 'Task';
        case EventType.TEST:
            return lang == 'el' ? 'Εξέταση' : 'Test';
        case EventType.ASSIGNMENT:
            return lang == 'el' ? 'Εργασία' : 'Assignment';
        case EventType.CLASS:
            return lang == 'el' ? 'Μάθημα' : 'Class';
        case EventType.OTHER:
            return lang == 'el' ? 'Άλλο' : 'Other';
    }
}

export function getEventRepeatTypeValue(type: string, lang?: string): string {
    const eventRepeatType = EventRepeatType[type as keyof typeof EventRepeatType];
    switch (eventRepeatType) {
        case EventRepeatType.NEVER:
            return lang == 'el' ? 'Ποτέ' : 'Never';
        case EventRepeatType.DAILY:
            return lang == 'el' ? 'Καθημερινά' : 'Daily';
        case EventRepeatType.WEEKLY:
            return lang == 'el' ? 'Εβδομαδιαία' : 'Weekly';
        case EventRepeatType.MONTHLY:
            return lang == 'el' ? 'Μηνιαία' : 'Monthly';
        case EventRepeatType.YEARLY:
            return lang == 'el' ? 'Ετήσια' : 'Yearly';
    }
}

export function eventHasCorrectFormat(event: Event | undefined): boolean {
    return (event!==undefined && event.title != undefined && event.title.length > 0 && new Date(event.slot.start).getTime() <= new Date(event.slot.end).getTime());
}

// export function createEventTimeSlotList(event: EventFlat): EventTimeSlot[] {
//     const slots: EventTimeSlot[] = [];
//     let start = new Date(event.slot.start);
//     let end = new Date(event.slot.end);
//     while (start <= end) {
//         slots.push({ start: new Date(start), end: new Date(end) });
//         switch (event.repeat) {
//             case EventRepeatType.NEVER:
//                 break;
//             case EventRepeatType.DAILY:
//                 start.setTime(start.getTime() + event.repeatInterval*24*60*60*1000);
//                 end.setTime(end.getTime() + event.repeatInterval*24*60*60*1000);
//                 break;
//             case EventRepeatType.WEEKLY:
//                 start.setTime(start.getTime() + event.repeatInterval*7*24*60*60*1000);
//                 end.setTime(end.getTime() + event.repeatInterval*7*24*60*60*1000);
//                 break;
//             case EventRepeatType.MONTHLY:
//                 start.setTime(start.getTime() + event.repeatInterval*30*24*60*60*1000);
//                 end.setTime(end.getTime() + event.repeatInterval*30*24*60*60*1000);
//                 break;
//             case EventRepeatType.YEARLY:
//                 start.setFullYear(start.getFullYear() + event.repeatInterval);
//                 end.setFullYear(end.getFullYear() + event.repeatInterval);
//                 break;
//         }
//         if (event.repeatUntil && start > event.repeatUntil) {
//             break;
//         }
//     }
//     return slots;
// }