import { type Event, EventRepeatType } from './event/Event';

export function isCurrentDay(event: Event, active: Date): boolean {
    const activeDate = new Date(active);
    const start = new Date(event.slot.start);

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