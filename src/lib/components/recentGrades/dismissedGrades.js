import { persisted } from 'svelte-persisted-store'

// Store for the recent grades that the user has already seen
export const dismissedGrades = persisted('dismissedGrades', [])