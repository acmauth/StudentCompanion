interface Day {
    en: string;
    el: string;
  }
  
  interface Weekday {
    [key: string]: Day;
  }
  
  export const weekdays: Weekday[] = [
    { sun: { en: 'Sunday', el: 'Κυριακή' } },
    { mon: { en: 'Monday', el: 'Δευτέρα' } },
    { tue: { en: 'Tuesday', el: 'Τρίτη' } },
    { wed: { en: 'Wednesday', el: 'Τετάρτη' } },
    { thu: { en: 'Thursday', el: 'Πέμπτη' } },
    { fri: { en: 'Friday', el: 'Παρασκευή' } },
    { sat: { en: 'Saturday', el: 'Σάββατο' } },
  ];
  
export function getDayIndex(day: string): number {
    const dayCode = day.slice(0, 3).toLowerCase();
    return weekdays.findIndex(weekday => weekday.hasOwnProperty(dayCode));
} 

export function getDayByIndex(index: number, lang: string = "en", upperCase?: boolean, length: number=3): string {
  const day = weekdays[index];
  const abbreviatedDay = (Object.values(day)[0] as any)[lang].slice(0, length);
  if (upperCase) {
    return removeDiacritics(abbreviatedDay.toUpperCase());
  } else {
    return abbreviatedDay;
  }
}

function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}