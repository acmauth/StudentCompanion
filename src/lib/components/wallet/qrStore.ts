import type { qrItem } from './qrItem';
import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

export const qrStore = new CapacitorPersistedStore(new Array<qrItem>(), 'qrStore');