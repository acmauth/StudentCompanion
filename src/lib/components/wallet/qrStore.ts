import { persisted } from 'svelte-persisted-store'
import type { qrItem } from './qrItem';

export const qrStore = persisted('qrStore', new Array<qrItem>());