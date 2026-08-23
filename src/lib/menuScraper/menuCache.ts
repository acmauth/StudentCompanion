import { Preferences } from '@capacitor/preferences';

const MENU_CACHE_KEY = 'menu_cache';
const MENU_CACHE_TIMESTAMP_KEY = 'menu_cache_timestamp';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface MenuCacheData {
    menu: string[];
    clubOpen?: boolean;
    timestamp: number;
}

/**
 * Save menu data to cache
 */
export async function saveMenuToCache(menuData: string[], clubOpen?: boolean): Promise<void> {
    try {
        const cacheData: MenuCacheData = {
            menu: menuData,
            clubOpen,
            timestamp: Date.now()
        };
        await Preferences.set({
            key: MENU_CACHE_KEY,
            value: JSON.stringify(cacheData)
        });
    } catch (error) {
        console.error('Error saving menu to cache:', error);
    }
}

/**
 * Get cached menu data, along with the club-open status that was in effect
 * when it was cached (so callers can avoid flashing an open menu that will
 * immediately be replaced by a "closed for holidays" state).
 */
export async function getMenuFromCache(): Promise<{ menu: string[]; clubOpen?: boolean } | null> {
    try {
        const result = await Preferences.get({ key: MENU_CACHE_KEY });
        if (result.value) {
            const cacheData: MenuCacheData = JSON.parse(result.value);
            return { menu: cacheData.menu, clubOpen: cacheData.clubOpen };
        }
        return null;
    } catch (error) {
        console.error('Error reading menu from cache:', error);
        return null;
    }
}

/**
 * Check if cached data is still valid (less than 24 hours old)
 */
export async function isCacheValid(): Promise<boolean> {
    try {
        const result = await Preferences.get({ key: MENU_CACHE_KEY });
        if (result.value) {
            const cacheData: MenuCacheData = JSON.parse(result.value);
            const age = Date.now() - cacheData.timestamp;
            return age < CACHE_DURATION_MS;
        }
        return false;
    } catch (error) {
        console.error('Error checking cache validity:', error);
        return false;
    }
}

/**
 * Clear the menu cache
 */
export async function clearMenuCache(): Promise<void> {
    try {
        await Preferences.remove({ key: MENU_CACHE_KEY });
    } catch (error) {
        console.error('Error clearing menu cache:', error);
    }
}
