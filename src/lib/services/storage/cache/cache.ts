import Dexie, { type Table } from "dexie";

export type CachedItem<T = any> = {
    key: string;
    exists: boolean;
    cachedAt: Date;
    life: number; //Life in seconds
    value: T | null;
    expired: boolean;
}

type CacheRow = { key: string; value: string };

class CacheDB extends Dexie {
    cachedData!: Table<CacheRow, string>;

    constructor() {
        super("cachedData");
        this.version(1).stores({
            cachedData: 'key,value'
        });
    }
}

let db: CacheDB | null = null;

function getDB(): CacheDB {
    if (!db) db = new CacheDB();
    return db;
}

export async function setCached(key: string, value: any, lifetime: number = 180): Promise<void> {
    const cachedData = {
        value,
        cachedAt: new Date(),
        life: lifetime
    };
    try {
        await getDB().cachedData.put({ key, value: JSON.stringify(cachedData) });
    } catch (error) {
        console.error(error);
    }
}

export async function getCached<T = any>(key: string): Promise<CachedItem<T>> {
    let row: CacheRow | undefined;
    try {
        row = await getDB().cachedData.get(key);
    } catch (error) {
        console.error(error);
    }

    if (!row) {
        return { key, exists: false, cachedAt: new Date(), value: null, expired: false, life: 0 };
    }

    const parsedData = JSON.parse(row.value);
    const cachedAt = new Date(parsedData.cachedAt);
    const life = parsedData.life;
    return {
        key,
        exists: true,
        cachedAt,
        life,
        value: parsedData.value,
        expired: Date.now() - cachedAt.getTime() > life * 1000
    };
}

export async function clearCache(): Promise<void> {
    if (db) {
        db.close();
        db = null;
    }
    await Dexie.delete("cachedData");
}
