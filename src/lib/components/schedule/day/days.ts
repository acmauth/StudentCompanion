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
  
  
//console.log(weekdays.tue.el); // Output: Τρίτη
  