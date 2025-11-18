import { writable, derived } from 'svelte/store';
import type { SelectedDay } from './calendarUtils';

function createCalendarState() {
    const currentDate = new Date();
    const month = writable(currentDate.getMonth());
    const year = writable(currentDate.getFullYear());
    const selectedDay = writable<SelectedDay | null>(null);
    const activeDate = writable(new Date());

    return {
        month,
        year,
        selectedDay,
        activeDate,
        
        nextMonth: () => {
            month.update(m => {
                if (m === 11) {
                    year.update(y => y + 1);
                    return 0;
                }
                return m + 1;
            });
        },
        
        previousMonth: () => {
            month.update(m => {
                if (m === 0) {
                    year.update(y => y - 1);
                    return 11;
                }
                return m - 1;
            });
        },
        
        setMonth: (newMonth: number) => month.set(newMonth),
        setYear: (newYear: number) => year.set(newYear),
        setSelectedDay: (day: SelectedDay | null) => selectedDay.set(day),
        setActiveDate: (date: Date) => activeDate.set(date)
    };
}

export const calendarState = createCalendarState();
