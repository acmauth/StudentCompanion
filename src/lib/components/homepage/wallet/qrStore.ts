import type { qrItem } from './qrItem';
import CapacitorPersistedStore from '$services/storage/persisted/CapacitorPersistedStore';

export const qrStore = new CapacitorPersistedStore(new Array<qrItem>(), 'qrStore');