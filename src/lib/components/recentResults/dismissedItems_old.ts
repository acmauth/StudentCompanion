// import { persisted } from 'svelte-persisted-store';


// // Store for the dismissed items
// export const dismissedItems = persisted('dismissedItems', []);
import { Preferences } from '@capacitor/preferences';
import { derived, get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const dismissedItems = {
    async get() {
        const result = await Preferences.get({ key: 'dismissedItems' });
        if (result.value) {
            return JSON.parse(result.value);
        } else {
            return [];
        }
    },
    async update(updateFunction: any) {
        let oldValue = await this.get();
        let newValue = updateFunction(oldValue);
        const newValueString = JSON.stringify(newValue);
        await Preferences.set({ key: 'dismissedItems', value: newValueString });
    }
};