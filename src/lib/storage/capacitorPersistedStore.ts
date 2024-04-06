import { Preferences } from '@capacitor/preferences';
import { writable, type Writable } from 'svelte/store';
import type { GetResult } from '@capacitor/preferences';

/**
 * Represents a persisted store that uses Capacitor's Preferences API for storage.
 * @template T - The type of the store value.
 */
class CapacitorPersistedStore<T> {
    private store: Writable<T>;
    private key: string;

    /**
     * Creates a new instance of CapacitorPersistedStore.
     * @param initialValue - The initial value of the store.
     * @param key - The key used for storing the value in Capacitor's Preferences.
     */
    constructor(initialValue: T, key: string) {
        const storedValue = this.getStoredValue(key);
        this.key = key;
        this.store = writable(initialValue);
    }
    
    /**
     * Loads the stored value from Capacitor's Preferences and sets it as the current value of the store.
     */
    public async loadFromStorage() {
        const storedValue = await this.getStoredValue(this.key);
        if (storedValue !== null) {
            this.store.set(storedValue);
        }
        this.subscribeToStoreChanges(this.key);
    }

    /**
     * Retrieves the stored value from Capacitor's Preferences.
     * @param key - The key used for storing the value.
     * @returns A promise that resolves to the stored value, or null if it doesn't exist.
     */
    private async getStoredValue(key: string): Promise<Awaited<T> | null> {
        const result: GetResult = await Preferences.get({ key });
        return result.value !== null ? JSON.parse(result.value) : null;
    }

    /**
     * Subscribes to changes in the store and updates the stored value in Capacitor's Preferences.
     * @param key - The key used for storing the value.
     */
    private subscribeToStoreChanges(key: string) {
        this.store.subscribe((value) => {
            Preferences.set({ key, value: JSON.stringify(value) });
        });
    }

    /**
     * Subscribes to changes in the store.
     * @param run - The function to be called when the store value changes.
     * @returns A function that can be called to unsubscribe from the store.
     */
    public subscribe(run: (value: T) => void) {
        return this.store.subscribe(run);
    }

    /**
     * Sets the value of the store.
     * @param value - The new value of the store.
     */
    public set(value: T) {
        this.store.set(value);
    }

    /**
     * Updates the value of the store using an updater function.
     * @param updater - A function that takes the current value of the store and returns a new value.
     */
    public update(updater: (value: T) => T) {
        this.store.update(updater);
    }
}

export default CapacitorPersistedStore;