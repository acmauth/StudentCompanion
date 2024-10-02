import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

// Store for the dismissed items
export const dismissedItems = new CapacitorPersistedStore<number[]>([], 'dismissedItems');