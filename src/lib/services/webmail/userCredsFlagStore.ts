import CapacitorPersistedStore from '$services/storage/persisted/CapacitorPersistedStore';

export const webmailLoggedIn = new CapacitorPersistedStore(false, 'webmailLoggedIn');