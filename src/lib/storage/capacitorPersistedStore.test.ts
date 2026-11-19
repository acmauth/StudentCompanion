import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory stand-in for Capacitor Preferences, so the namespacing and the
// migration logic can be exercised without a device runtime.
const storage = new Map<string, string>();

vi.mock('@capacitor/preferences', () => ({
	Preferences: {
		get: vi.fn(async ({ key }: { key: string }) => ({ value: storage.has(key) ? storage.get(key)! : null })),
		set: vi.fn(async ({ key, value }: { key: string; value: string }) => {
			storage.set(key, value);
		}),
		remove: vi.fn(async ({ key }: { key: string }) => {
			storage.delete(key);
		}),
		clear: vi.fn(async () => storage.clear())
	}
}));

// svelte-persisted-store writes to window.localStorage, which vitest's node
// environment does not provide; a plain writable passthrough is enough here
// because Capacitor Preferences is the storage under test.
vi.mock('svelte-persisted-store', async (importOriginal) => {
	const { writable } = await import('svelte/store');
	return {
		persisted: (key: string, initialValue: unknown) => writable(initialValue)
	};
});

import CapacitorPersistedStore from './capacitorPersistedStore';

describe('CapacitorPersistedStore user scoping', () => {
	beforeEach(() => {
		storage.clear();
		vi.clearAllMocks();
	});

	it('keeps the plain key when no user id is set', async () => {
		const store = new CapacitorPersistedStore<number>(0, 'counter');
		store.set(41);
		await store.loadFromStorage();
		expect(storage.get('counter')).toBe('41');
	});

	it('stores under "<key>__<user id>" once a scope is applied', async () => {
		const store = new CapacitorPersistedStore<number>(0, 'counter');
		store.setScope('user-A');
		store.set(7);
		expect(storage.get('counter__user-A')).toBe('7');
		expect(storage.has('counter')).toBe(false);
	});

	it('keeps two users in separate namespaces', async () => {
		const storeA = new CapacitorPersistedStore<number>(0, 'counter');
		storeA.setScope('user-A');
		storeA.set(1);

		const storeB = new CapacitorPersistedStore<number>(0, 'counter');
		storeB.setScope('user-B');
		storeB.set(2);

		await storeA.loadFromStorage();
		await storeB.loadFromStorage();
		expect(storage.get('counter__user-A')).toBe('1');
		expect(storage.get('counter__user-B')).toBe('2');
	});

	it('leaves device-wide stores unnamespaced even with a scope', () => {
		const store = new CapacitorPersistedStore<string>('el', 'lang', false);
		store.setScope('user-A');
		store.set('en');
		expect(storage.get('lang')).toBe('"en"');
		expect(storage.has('lang__user-A')).toBe(false);
	});

	it('adopts a pre-namespace value into the user namespace on first load', async () => {
		// Simulate an install updated from single-user storage.
		storage.set('counter', '3');

		const store = new CapacitorPersistedStore<number>(0, 'counter');
		store.setScope('user-A');
		await store.loadFromStorage();

		expect(storage.get('counter__user-A')).toBe('3');
	});

	it('reset() drops the namespaced value and the legacy one', async () => {
		storage.set('counter', '3');
		const store = new CapacitorPersistedStore<number>(0, 'counter');
		store.setScope('user-A');
		await store.loadFromStorage();
		store.set(9);

		await store.reset();

		expect(storage.has('counter__user-A')).toBe(false);
		expect(storage.has('counter')).toBe(false);
	});
});
