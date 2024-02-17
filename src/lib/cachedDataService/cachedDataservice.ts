import { universisGet, elearningGet } from "$lib/dataService"

type cachedItem = {
    key: string;
    exists: boolean;
    cachedAt: Date;
    life: number; //Life in seconds
    value: any;
    expired: boolean;
}

type options = {
    forceFresh?: boolean | undefined;
    lifetime?: number | undefined;
}

export async function cachedUniversisGet (endpoint: string, options?: options): Promise<any> {
    if (!options) options = {};
    const key = `universis_${endpoint}`;
    const cached = getFromCache(key);
    if (cached.exists && !cached.expired && !options.forceFresh) {
        return cached.value;
    } else {
        const response = await universisGet(endpoint);
        cacheItem(key, response, options.lifetime);
        return response;
    }
}

export async function cachedElearningGet(data: any, options?: options): Promise<any> {
    if (!options) options = {};
    const key = `elearning_${JSON.stringify(data)}`;
    const cached = getFromCache(key);
    if (cached.exists && !cached.expired && !options.forceFresh) {
        return cached.value;
    } else {
        const response = await elearningGet(data);
        cacheItem(key, response, options.lifetime);
        return response;
    }
    
}

function cacheItem(key: string, value: any, lifetime: number = 180) {
    const now = new Date();
    const cachedData = {
        value,
        cachedAt: now,
        life: lifetime
    };
    localStorage.setItem(key, JSON.stringify(cachedData));
}

function getFromCache(key: string): cachedItem {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const now = new Date();
        const cachedAt = new Date(parsedData.cachedAt);
        const life = parsedData.life;
        const expired = now.getTime() - cachedAt.getTime() > life * 1000;
        return {
            key,
            exists: true,
            cachedAt,
            life,
            value: parsedData.value,
            expired
        };
    } else {
        return {
            key,
            exists: false,
            cachedAt: new Date(),
            value: null,
            expired: false,
            life: 0
        };
    }
}