import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

// Store for the last scheduled repeated notification from each event
export const scheduledNotifications = new CapacitorPersistedStore([], 'scheduledNotifications');