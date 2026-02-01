import { writable } from 'svelte/store';

export interface CalendarNavigationParams {
    date?: Date;
    eventId?: number;
}

function createCalendarNavigationStore() {
    const { subscribe, set, update } = writable<CalendarNavigationParams | null>(null);

    return {
        subscribe,
        setNavigation: (params: CalendarNavigationParams) => set(params),
        clear: () => set(null)
    };
}

export const calendarNavigation = createCalendarNavigationStore();
