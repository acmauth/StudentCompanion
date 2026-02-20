import { EventRepeatType, EventType, type Event } from './event/Event';
import { isCurrentDay } from './CalendarFunctions';
import { getLocale } from '$src/lib/i18n';
import { universisGet } from '$src/lib/dataService';
import { EventStore } from '$lib/components/calendar/event/EventStore';
import { get } from 'svelte/store';


export interface DayObject {
    day: number;
    isCurrentMonth: boolean;
    hasEvents: boolean;
    eventCount: number;
}

export interface SelectedDay {
    day: number;
    month: number;
    year: number;
}

/**
 * Get localized weekday names (first letter, capitalized)
 */
export function getWeekdayNames(): string[] {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(2024, 0, i);
        const fullName = date.toLocaleDateString(getLocale(), { weekday: 'long' });
        return fullName.charAt(0).toUpperCase();
    });
}

/**
 * Build calendar weeks for a given month and year
 */
export function buildCalendarWeeks(
    month: number,
    year: number,
    events: Event[]
): DayObject[][] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const tempWeeks: DayObject[][] = [];
    let week: DayObject[] = [];

    // Fill previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        week.push({ day: prevMonthDays - i, isCurrentMonth: false, hasEvents: false, eventCount: 0 });
    }

    // Fill current month's days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateToCheck = new Date(year, month, d);
        const eventsOnDay = events.filter((event) => isCurrentDay(event, dateToCheck));
        const hasEventOnDay = eventsOnDay.length > 0;
        week.push({ day: d, isCurrentMonth: true, hasEvents: hasEventOnDay, eventCount: eventsOnDay.length });
        if (week.length === 7) {
            tempWeeks.push(week);
            week = [];
        }
    }

    // Fill next month's days
    if (week.length > 0) {
        let nextDay = 1;
        while (week.length < 7) {
            week.push({ day: nextDay++, isCurrentMonth: false, hasEvents: false, eventCount: 0 });
        }
        tempWeeks.push(week);
    }

    return tempWeeks;
}

/**
 * Compute days with events for the current month (including recurring events)
 */
export function computeDaysWithEvents(
    month: number,
    year: number,
    events: Event[]
): Set<string> {
    const days = new Set<string>();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateToCheck = new Date(year, month, day);
        const hasEventOnDay = events.some((event) => isCurrentDay(event, dateToCheck));
        if (hasEventOnDay) {
            days.add(day.toString());
        }
    }
    return days;
}

/**
 * Check if a day object is the selected day
 */
export function isSelectedDay(
    dayObj: DayObject | null,
    selectedDay: SelectedDay | null,
    month: number,
    year: number
): boolean {
    if (!selectedDay || !dayObj || !dayObj.isCurrentMonth) return false;
    return (
        selectedDay.day === dayObj.day &&
        selectedDay.month === month &&
        selectedDay.year === year
    );
}

/**
 * Check if a day object is today
 */
export function isToday(dayObj: DayObject | null, month: number, year: number): boolean {
    if (!dayObj || !dayObj.isCurrentMonth) return false;
    const today = new Date();
    return (
        today.getDate() === dayObj.day &&
        today.getMonth() === month &&
        today.getFullYear() === year
    );
}

/**
 * Navigate to the next month
 */
export function getNextMonth(month: number, year: number): { month: number; year: number } {
    if (month === 11) {
        return { month: 0, year: year + 1 };
    }
    return { month: month + 1, year };
}

/**
 * Navigate to the previous month
 */
export function getPreviousMonth(month: number, year: number): { month: number; year: number } {
    if (month === 0) {
        return { month: 11, year: year - 1 };
    }
    return { month: month - 1, year };
}


export async function getCoursesEvents() {
        // console.log("Fetching courses events from Universis...");
        let fetchedExams = (await universisGet('students/me/availableCourseExamEvents?$top=-1'))?.value;
        // console.log(fetchedExams);
        await EventStore.loadFromStorage();
        let currentEvents = get(EventStore);

        const newExams = fetchedExams?.map((exam: any) => {
            const existingIndex = currentEvents.findIndex(x => x.id == exam.id);
            if (existingIndex == -1) {
                return {
                    id: exam.id,
                    title: exam.courseExam.name,
                    type: EventType.TEST,
                    repeat: EventRepeatType.NEVER,
                    notify: false,
                    location: exam.location?.description,
                    locationCode: exam.location?.alternateName,
                    slot: {
                        start: new Date(exam.startDate),
                        end: new Date(exam.endDate)
                    }
                };
            } else {
                return null; // Return null if the exam already exists in $EventStore
            }
        }).filter((event: any) => event !== null); // Filter out null values

        if (newExams && newExams.length > 0) {
            EventStore.update(events => [...events, ...newExams]);
        }

        let fetchedClasses = (await universisGet('students/me/teachingEvents?$top=-1&$expand=location,performer'))?.value;
        // console.log(fetchedClasses);
        
        currentEvents = get(EventStore); // Refresh current events

        const newClasses = fetchedClasses?.map((classEvent: any) => {
            const existingIndex = currentEvents.findIndex(x => x.id == classEvent.id);
            if (existingIndex == -1) {
                return {
                    id: classEvent.id,
                    title: classEvent.name,
                    type: EventType.CLASS,
                    professor: classEvent.performer?.alternateName,
                    repeat: EventRepeatType.NEVER,
                    notify: false,
                    location: classEvent.location?.description,
                    slot: {
                        start: new Date(classEvent.startDate),
                        end: new Date(classEvent.endDate)
                    },
                    locationCode: classEvent.location?.alternateName
                };
            } else {
                return null; // Return null if the class already exists in $EventStore
            }
        }).filter((event: any) => event !== null); // Filter out null values

        if (newClasses && newClasses.length > 0) {
            EventStore.update(events => [...events, ...newClasses]);
        }
        
    }