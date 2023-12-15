interface Day {
    en: string;
    el: string;
  }
  
  interface Weekday {
    [key: string]: Day;
  }
  
  export const weekdays: Weekday[] = [
    { mon: { en: 'Monday', el: 'Δευτέρα' } },
    { tue: { en: 'Tuesday', el: 'Τρίτη' } },
    { wed: { en: 'Wednesday', el: 'Τετάρτη' } },
    { thu: { en: 'Thursday', el: 'Πέμπτη' } },
    { fri: { en: 'Friday', el: 'Παρασκευή' } },
    // { sat: { en: 'Saturday', el: 'Σάββατο' } },
    // { sun: { en: 'Sunday', el: 'Κυριακή' } },
  ];
  
export function getDayIndex(day: string): number {
    const dayCode = day.slice(0, 3).toLowerCase();
    return weekdays.findIndex(weekday => weekday.hasOwnProperty(dayCode));
} 

export function getDayByIndex(index: number): string {
    return Object.keys(weekdays[index - 1])[0].toUpperCase().slice(0, 3);
}