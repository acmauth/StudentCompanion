// store.js
import { writable } from 'svelte/store';

// stores if the banner is deleted
export const isDeleted = writable(false);
