import { type Event, type EventTimeSlot, EventRepeatType } from './event/Event';

export function isCurrentDay(event: Event, active: Date): boolean {
    const activeDate = new Date(active);
    const start = new Date(event.slot.start);

    if(event.inactiveDates?.includes(activeDate.getTime())) return false;

    if(event.repeat == EventRepeatType.NEVER) {
        return (
            start.getFullYear() === activeDate.getFullYear() &&
            start.getMonth() === activeDate.getMonth() &&
            start.getDate() === activeDate.getDate()
        );
    }
    
    if (!event.repeatUntil || !event.repeatInterval) return false;

    const repeatUntil = new Date(event.repeatUntil);
    const repeatInterval = event.repeatInterval;
    
    let distance: number = 0;

    if(event.repeat == EventRepeatType.DAILY) {
        const intervalMilliseconds = repeatInterval * 24 * 60 * 60 * 1000;
        const totalDuration = repeatUntil.getTime() - start.getTime();
        const fullIntervals = Math.floor(totalDuration / intervalMilliseconds);
        const lastOccurrence = new Date(start.getTime() + fullIntervals * intervalMilliseconds);

        const dayDistance = (date1: Date, date2: Date) => {
            const diffTime = date2.getTime() - date1.getTime();
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const distance = dayDistance(start, activeDate);
        return (
            distance >= 0 &&
            distance % repeatInterval === 0 &&
            activeDate.getTime() <= lastOccurrence.getTime()
        );
    }

    if (event.repeat == EventRepeatType.WEEKLY) {
        const dayDistance = (date1: Date, date2: Date): number => {
            return (new Date(date1.setHours(0,0,0,0)).getTime() - new Date(date2.setHours(0,0,0,0)).getTime()) / (1000 * 60 * 60 * 24);
        }

        const intervalMilliseconds = repeatInterval * 7 * 24 * 60 * 60 * 1000;
        const totalDuration = repeatUntil.getTime() - start.getTime();
        const fullIntervals = Math.floor(totalDuration / intervalMilliseconds);
        const lastOccurrence = new Date(start.getTime() + fullIntervals * intervalMilliseconds);
        
        distance = dayDistance(activeDate, start);
        return (
            distance >= 0 && 
            distance % (repeatInterval * 7) === 0 && 
            activeDate.getTime() <= lastOccurrence.getTime() && 
            start.getDay() === activeDate.getDay());
    }

    if (event.repeat == EventRepeatType.MONTHLY) {
        const getMonthsDifference = (startDate: Date, endDate: Date) => {
            return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        };

        const totalMonths = getMonthsDifference(start, repeatUntil);
        const fullIntervals = Math.floor(totalMonths / repeatInterval);
        const lastOccurrence = new Date(start);
        lastOccurrence.setMonth(start.getMonth() + fullIntervals * repeatInterval);

        const isSameDayOfMonth = (date1: Date, date2: Date) => date1.getDate() === date2.getDate();

        const monthDistance = getMonthsDifference(start, activeDate);
        return (
            monthDistance >= 0 &&
            monthDistance % repeatInterval === 0 &&
            activeDate.getTime() <= lastOccurrence.getTime() &&
            isSameDayOfMonth(start, activeDate)
        );
    }

    if(event.repeat == EventRepeatType.YEARLY) {
        const getYearsDifference = (startDate: Date, endDate: Date) => {
            return endDate.getFullYear() - startDate.getFullYear();
        };

        const totalYears = getYearsDifference(start, repeatUntil);
        const fullIntervals = Math.floor(totalYears / repeatInterval);
        const lastOccurrence = new Date(start);
        lastOccurrence.setFullYear(start.getFullYear() + fullIntervals * repeatInterval);

        const isSameDayOfYear = (date1: Date, date2: Date) => {
            return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
        };

        const yearDistance = getYearsDifference(start, activeDate);
        return (
            yearDistance >= 0 &&
            yearDistance % repeatInterval === 0 &&
            activeDate.getTime() <= lastOccurrence.getTime() &&
            isSameDayOfYear(start, activeDate)
        );
    }

    return false;
}

// checking if the date1:Date and date2:milliscs are in the same day, month and year 
function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
}

// checking if a certain date is deleted for an event
export function isInactiveDate(date: Date, event: Event): boolean {
    const inactiveDates = event.inactiveDates;
    for (const inactiveDate of inactiveDates || []) {
        if (isSameDay(date, new Date(inactiveDate))) {
            return true;
        }
    }
    return false;
}

// finds the next occurrence (start/end) of an event on or after "from",
// walking day by day through the same isCurrentDay logic the calendar uses,
// so repeated events whose original slot.start is in the past can still surface
export function getNextOccurrence(event: Event, from: Date = new Date()): EventTimeSlot | null {
    const start = new Date(event.slot.start);
    const end = new Date(event.slot.end);
    const duration = end.getTime() - start.getTime();

    if (event.repeat == EventRepeatType.NEVER) {
        return start.getTime() >= from.getTime() ? { start, end } : null;
    }

    if (!event.repeatUntil || !event.repeatInterval) return null;

    const repeatUntil = new Date(event.repeatUntil);
    repeatUntil.setHours(23, 59, 59, 999);

    const cursor = new Date(Math.max(start.getTime(), from.getTime()));
    cursor.setHours(0, 0, 0, 0);

    while (cursor.getTime() <= repeatUntil.getTime()) {
        if (isCurrentDay(event, cursor)) {
            const occurrenceStart = new Date(cursor);
            occurrenceStart.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
            if (occurrenceStart.getTime() >= from.getTime()) {
                return { start: occurrenceStart, end: new Date(occurrenceStart.getTime() + duration) };
            }
        }
        cursor.setDate(cursor.getDate() + 1);
    }

    return null;
}