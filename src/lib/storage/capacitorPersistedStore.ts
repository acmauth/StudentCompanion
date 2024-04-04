import { Preferences } from '@capacitor/preferences';
import { writable, type Writable } from 'svelte/store';
import type { GetResult } from '@capacitor/preferences';


export async function capacitorPersistedStore<T>(key: string, initialValue: T): Promise<Writable<T>> {
    const { get, set } = Preferences;

    const { value } = await get({key: key});
    
    const storedValue = value ? JSON.parse(value as string) : initialValue;

    const { subscribe, set: setStore, update } = writable(storedValue);

    subscribe((value) => {
        set({key, value: JSON.stringify(value)});
    });

    return { subscribe, set: setStore, update };

}