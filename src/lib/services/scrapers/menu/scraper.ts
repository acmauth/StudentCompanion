import axios from 'axios';
import DOMPurify from 'dompurify';
import { get, writable, type Readable, type Writable } from 'svelte/store';
import Config from "$src/app.config";
import { getCached, setCached } from '$services/storage/cache/cache';
import { getLocale } from '$methods/i18n';

export type MenuDay = { full: string; breakfast: string; lunch: string; dinner: string };

export type MenuState = {
    status: 'loading' | 'ready' | 'error';
    days: MenuDay[] | null; // Monday=0 ... Sunday=6
    clubOpen: boolean | undefined;
    stale: boolean; // showing the cached copy; the fresh fetch is pending or failed
    error: string | null;
};

type CachedMenu = { days: MenuDay[]; clubOpen?: boolean };
type MenuFeed = { store: Writable<MenuState>; refreshing: Promise<void> | null };

const MENU_CACHE_LIFETIME = 24 * 60 * 60;
const INITIAL_STATE: MenuState = { status: 'loading', days: null, clubOpen: undefined, stale: false, error: null };

// One feed per locale, kept for the app's lifetime so a remounted page renders
// the last menu immediately.
const feeds = new Map<string, MenuFeed>();

function sanitizeDay(day: Record<string, unknown>): MenuDay {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(day)) {
        clean[key] = typeof value === 'string' ? DOMPurify.sanitize(value, { SANITIZE_NAMED_PROPS: true }) : value;
    }
    return clean as MenuDay;
}

async function fetchMenu(locale: string): Promise<CachedMenu> {
    const response = await axios.get(`${Config.menu.apiBase}?locale=${locale}`, { timeout: 5000 });
    const days = response.data?.menu?.days;
    if (!Array.isArray(days)) throw new Error('Menu API returned no days');
    return { days: days.map(sanitizeDay), clubOpen: response.data?.club_open };
}

async function refresh(locale: string, store: Writable<MenuState>) {
    const key = `menu_${locale}`;

    if (get(store).status === 'error') store.set(INITIAL_STATE);

    if (!get(store).days) {
        const cached = (await getCached<CachedMenu>(key)).value;
        if (cached?.days?.length && !get(store).days) {
            store.set({ status: 'ready', days: cached.days, clubOpen: cached.clubOpen, stale: true, error: null });
        }
    }

    try {
        const fresh = await fetchMenu(locale);
        await setCached(key, fresh, MENU_CACHE_LIFETIME);
        store.set({ status: 'ready', days: fresh.days, clubOpen: fresh.clubOpen, stale: false, error: null });
    } catch (error) {
        console.error('Error while fetching menu data:', error);
        store.update((state) =>
            state.days
                ? { ...state, stale: true }
                : { ...state, status: 'error', error: 'Error while fetching menu data' }
        );
    }
}

// Shows the last known menu (memory, then the persisted cache) right away and
// refreshes it from the API in the background.
export function getMenu(locale: string = getLocale()): Readable<MenuState> {
    let feed = feeds.get(locale);
    if (!feed) {
        feed = { store: writable(INITIAL_STATE), refreshing: null };
        feeds.set(locale, feed);
    }

    if (!feed.refreshing) {
        const current = feed;
        current.refreshing = refresh(locale, current.store).finally(() => {
            current.refreshing = null;
        });
    }

    return { subscribe: feed.store.subscribe };
}
