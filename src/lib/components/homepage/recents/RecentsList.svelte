<script lang="ts">
    import { gatherRecentGrades } from "./gatherRecentGrades"
    import { gatherNotifications } from "$services/notifications/notifications";
    import RecentsDisplay from "./RecentsCard.svelte";
    import type { RecentItem } from "./types";
    import { neoUniversisGet } from "$services/dataService";
    import { getCached, setCached } from "$services/storage/cache/cache";

    export let maxCards = 6;

    const RECENT_ITEMS_CACHE_KEY = "recentItems";

    // Legacy localStorage snapshot
    localStorage.removeItem(RECENT_ITEMS_CACHE_KEY);

    function cacheRecentItems(recentItems: RecentItem[]) {
        setCached(RECENT_ITEMS_CACHE_KEY, recentItems);
    }

    async function getCachedRecentItems(): Promise<RecentItem[]> {
        const cachedItems = (await getCached<RecentItem[]>(RECENT_ITEMS_CACHE_KEY)).value;
        // Never show a cached easter egg before checking this student's eligibility.
        return cachedItems ? cachedItems.filter(item => !(item.id === 666)) : [];
    }

    async function gatherRecentItems(): Promise<RecentItem[]> {
        // Temporary ACM easter egg: CS undergraduates in years 1–2 only.
        const showACMNotification = neoUniversisGet(
            'Students/me?$expand=studyProgram($expand=studyLevel), department',
            { lifetime: 86000 }
        ).then(student => String(student?.department?.id) === "64"
            && student?.studyProgram?.studyLevel?.alternateName === "undergraduate"
            && [1, 2, 3, 4].includes(Number(student?.semester))
        ).catch(() => false);

        const notifications = await gatherNotifications({ days: 7 });
        const recentGrades = await gatherRecentGrades();

        const recentItems: RecentItem[] = [
            ...recentGrades.map((recentGrade: any): RecentItem => ({
                type: "recentGrade",
                content: recentGrade,
                id: recentGrade.courseExam.id
            })),
            ...notifications.map((notification: any): RecentItem => ({
                type: "notification",
                content: notification,
                id: notification.id
            }))
        ];

        cacheRecentItems(recentItems);
        return recentItems;
    }

    let recentItemsFromCache: RecentItem[] = [];
    getCachedRecentItems().then((items) => (recentItemsFromCache = items));
</script>

{#await gatherRecentItems()}
    <RecentsDisplay recentItems={recentItemsFromCache} {maxCards} />
{:then recentItemsList}
    <RecentsDisplay recentItems={recentItemsList} {maxCards} />
{/await}
