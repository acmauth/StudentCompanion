import { persisted } from 'svelte-persisted-store';


// Store for the dismissed items
export const dismissedItems = persisted('dismissedItems', []);