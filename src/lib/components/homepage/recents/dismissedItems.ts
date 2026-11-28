import CapacitorPersistedStore from '$services/storage/persisted/CapacitorPersistedStore';

// Store for the dismissed items
export const dismissedItems = new CapacitorPersistedStore<number[]>([], 'dismissedItems');