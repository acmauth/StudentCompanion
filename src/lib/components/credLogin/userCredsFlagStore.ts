import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

export const userCredsFlag = new CapacitorPersistedStore(new Boolean, 'userCredsFlag');