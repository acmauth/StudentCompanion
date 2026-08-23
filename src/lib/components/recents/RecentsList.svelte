<script lang="ts">
    import { gatherRecentGrades } from "./gatherRecentGrades"
    import { gatherNotifications } from "$components/notifications/notifications";
    import RecentsDisplay from "./RecentsCard.svelte";
    import type { RecentItem } from "./types";

    export let maxCards = 6;

    const RECENT_ITEMS_CACHE_KEY = "recentItems";

    function cacheRecentItems(recentItems: RecentItem[]) {
        localStorage.setItem(RECENT_ITEMS_CACHE_KEY, JSON.stringify(recentItems));
    }

    function getCachedRecentItems(): RecentItem[] {
        const cachedItems = localStorage.getItem(RECENT_ITEMS_CACHE_KEY);
        return cachedItems ? JSON.parse(cachedItems) : [];
    }

    async function gatherRecentItems(): Promise<RecentItem[]> {
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

    const recentItemsFromCache = getCachedRecentItems();
</script>

{#await gatherRecentItems()}
    <RecentsDisplay recentItems={recentItemsFromCache} {maxCards} />
{:then recentItemsList}
    <RecentsDisplay recentItems={recentItemsList} {maxCards} />
{/await}
