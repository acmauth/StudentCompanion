<script lang="ts">
    import { gatherRecentGrades } from "./gatherRecentGrades"
    import { gatherNotifications } from "$components/notifications/notifications";
    import RecentsDisplay from "./RecentsCard.svelte";
    import type { RecentItem } from "./types";
    import { neoUniversisGet } from "$lib/dataService";

    interface Props {
        maxCards?: number;
    }

    let { maxCards = 6 }: Props = $props();

    const RECENT_ITEMS_CACHE_KEY = "recentItems";

    function cacheRecentItems(recentItems: RecentItem[]) {
        localStorage.setItem(RECENT_ITEMS_CACHE_KEY, JSON.stringify(recentItems));
    }

    function getCachedRecentItems(): RecentItem[] {
        const cachedItems = localStorage.getItem(RECENT_ITEMS_CACHE_KEY);
        // Never show a cached easter egg before checking this student's eligibility.
        return cachedItems ? (JSON.parse(cachedItems) as RecentItem[]).filter(item => !(item.id === 666)) : [];
    }

    async function gatherRecentItems(refresh: boolean = false): Promise<RecentItem[]> {
        // Temporary ACM easter egg: CS undergraduates in years 1–2 only.
        const showACMNotification = neoUniversisGet(
            'Students/me?$expand=studyProgram($expand=studyLevel), department',
            { lifetime: 86000 }
        ).then(student => String(student?.department?.id) === "64"
            && student?.studyProgram?.studyLevel?.alternateName === "undergraduate"
            && [1, 2, 3, 4].includes(Number(student?.semester))
        ).catch(() => false);

        const notifications = await gatherNotifications({ days: 7, refresh });
        const recentGrades = await gatherRecentGrades(refresh);

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

    // Show the cached items straight away, then the fresh ones once they arrive.
    let recentItems: RecentItem[] = $state(getCachedRecentItems());
    // RecentsDisplay reads its items only once, when created, so it is re-created
    // (via {#key}) every time a new list arrives.
    let version = $state(0);

    async function load(refresh: boolean) {
        try {
            recentItems = await gatherRecentItems(refresh);
            version++;
        } catch (error) {
            // Keep showing the current list if loading fails
            console.warn('Could not load recent items:', error);
        }
    }

    load(false);

    /** Re-fetch the recent items, bypassing the caches (used by the homepage's pull-to-refresh). */
    export async function refresh() {
        await load(true);
    }
</script>

{#key version}
    <RecentsDisplay {recentItems} {maxCards} />
{/key}
