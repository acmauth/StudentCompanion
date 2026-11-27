import { Preferences } from '@capacitor/preferences';
import { get, type Writable } from 'svelte/store';
// import { writable, type Writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';
import type { GetResult } from '@capacitor/preferences';

/**
 * Represents a persisted store that uses Capacitor's Preferences API for storage.
 * @template T - The type of the store value.
 */
class CapacitorPersistedStore<T> {
    protected store: Writable<T>;
    protected key: string;
    private initial_value: T;
    /** Whether the stored value belongs to a specific user, allowing multiple users to keep separate contexts. */
    private user_scoped: boolean;
    /** The user id the store is currently namespaced under, empty until a user is resolved at startup. */
    private user_id: string;

    /**
     * Creates a new instance of CapacitorPersistedStore.
     * @param initialValue - The initial value of the store.
     * @param key - The key used for storing the value in Capacitor's Preferences.
     * @param userScoped - When true (default) the value is stored per user, so switching accounts keeps each user's context. Pass false for device-wide settings such as theme or language.
     */
    constructor(initialValue: T, key: string, userScoped = true) {
        this.key = key;
        this.initial_value = initialValue;
        this.user_scoped = userScoped;
        this.user_id = "";
        // this.store = writable(initialValue);
        this.store = persisted("capPeristedWorkaround_" + this.namespacedKey(), initialValue);
    }

    /**
     * The key the value is stored under: "<key>__<user id>" for user-scoped
     * stores once a user is resolved, otherwise the plain key.
     */
    private namespacedKey(): string {
        return this.user_scoped && this.user_id ? this.key + "__" + this.user_id : this.key;
    }

    /**
     * Namespaces the store under a user id. Meant for the startup routine,
     * before loadFromStorage(), so the store recovers that user's context.
     * A no-op for stores that were created with userScoped=false.
     * @param userId - The id of the user whose context should be recovered.
     */
    public setScope(userId: string) {
        if (!this.user_scoped || userId === this.user_id) {
            return;
        }
        this.user_id = userId;
        // Rebuild the persisted store under the namespaced key, no subscription
        // is active yet at startup time.
        this.store = persisted("capPeristedWorkaround_" + this.namespacedKey(), this.initial_value);
    }

    public async reset(){
        this.store.set(this.initial_value);
        await Preferences.remove({key: this.namespacedKey()});
        if (this.user_id) {
            // Also drop the pre-namespace value so a different user never adopts it.
            await Preferences.remove({key: this.key});
        }
    }

    /**
     * Loads the stored value from Capacitor's Preferences and sets it as the current value of the store.
     */
    public async loadFromStorage() {
        let storedValue = await this.getStoredValue(this.namespacedKey());
        if (storedValue === null && this.user_id) {
            // Migration: an install that predates per-user storage kept its
            // value under the plain key. Adopt it into this user's namespace
            // so existing data is not lost on first launch after the update.
            storedValue = await this.getStoredValue(this.key);
            if (storedValue !== null) {
                await Preferences.set({ key: this.namespacedKey(), value: JSON.stringify(storedValue) });
            }
        }
        if (storedValue !== null) {
            this.store.set(storedValue);
        }
        this.subscribeToStoreChanges(this.namespacedKey());
    }

    /**
     * Retrieves the stored value from Capacitor's Preferences.
     * @param key - The key used for storing the value.
     * @returns A promise that resolves to the stored value, or null if it doesn't exist.
     */
    protected async getStoredValue(key: string): Promise<Awaited<T> | null> {
        const result: GetResult = await Preferences.get({ key });
        return result.value !== null ? JSON.parse(result.value) : null;
    }

    /**
     * Subscribes to changes in the store and updates the stored value in Capacitor's Preferences.
     * @param key - The key used for storing the value.
     */
    protected subscribeToStoreChanges(key: string) {
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
        Preferences.set({ key: this.namespacedKey(), value: JSON.stringify(value) });
        this.store.set(value);
    }

    /**
     * Updates the value of the store using an updater function.
     * @param updater - A function that takes the current value of the store and returns a new value.
     */
    public update(updater: (value: T) => T) {
        this.store.update(updater);
        const newValue = get(this.store);
        Preferences.set({ key: this.namespacedKey(), value: JSON.stringify(newValue) });
    }
}

export default CapacitorPersistedStore;
