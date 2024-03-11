import { persisted } from 'svelte-persisted-store'

export const flag = persisted('flag', new Boolean(true));
