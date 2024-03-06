import { persisted } from 'svelte-persisted-store';


// Store for the dismissed grades
export const dismissedGrades = persisted('dismissedGrades', []);