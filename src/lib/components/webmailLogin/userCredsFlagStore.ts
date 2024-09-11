import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

export const userCredsFlag = new CapacitorPersistedStore(false, 'userCredsFlag');