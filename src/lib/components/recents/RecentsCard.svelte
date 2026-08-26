<script lang="ts">
    import SwipeCard from "./swipeCard.svelte";
    import RecentGrade from "./RecentsGradeCard.svelte";
    import Notification from "$components/notifications/notification.svelte";
    import { dismissedItems } from "./dismissedItems";
    import { refresh, sparklesOutline } from "ionicons/icons";
    import { flip } from "svelte/animate";
    import { quintOut } from 'svelte/easing';
    import { t } from "$lib/i18n";
    import type { RecentItem } from "./types";
    import { getItemDate, groupItemsByPeriod, type PeriodKey } from "./periodGrouping";

    export let recentItems: RecentItem[] = [];
    export let maxCards = 6;

    let recentlyDismissedItem: number;
    let allRecentItems: RecentItem[] = [];
    let showUndoButton = false;
    let undoTimer: ReturnType<typeof setTimeout>;

    const UNDO_TIMEOUT_MS = 8000;
    const OUTSIDE_INTERACTION_EVENTS = ['touchstart', 'touchmove'] as const;

    initializeRecentItems();

    // Runs once at component creation: a fresh RecentsDisplay instance is mounted
    // each time recents.svelte's {#await} block resolves, so this doesn't need to be reactive.
    function initializeRecentItems() {
        allRecentItems = [...recentItems];

        recentItems = recentItems
            .filter(item => !$dismissedItems.includes(item.id))
            .sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime())
            .slice(0, maxCards);
    }

    $: groupedItems = groupItemsByPeriod(recentItems);

    // Unicode combining diacritical marks (U+0300–U+036F), stripped after NFD normalization
    const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g');

    function formatPeriodLabel(period: PeriodKey): string {
        return $t(`recentgrades.period.${period}`)
            .normalize("NFD")
            .replace(COMBINING_MARKS, "")
            .toUpperCase();
    }

    // ── Dismiss / undo ───────────────────────────────────────────────────

    function dismissItem(id: number) {
        dismissedItems.update(ids => [...ids, id]);
        recentlyDismissedItem = id;
    }

    // Undo only ever needs to restore the single most-recently dismissed item,
    // so clearing the whole store here has the same effect as removing just that id.
    function clearDismissedItems() {
        dismissedItems.update(() => []);
    }

    function handleDeleteCard(event: CustomEvent<number>) {
        const deletedId = event.detail;
        recentItems = recentItems.filter(item => item.id !== deletedId);
        dismissItem(deletedId);
        showUndoButton = true;
    }

    function restoreDeletedCard() {
        clearDismissedItems();

        const restoredItem = allRecentItems.find(item => item.id === recentlyDismissedItem);
        if (!restoredItem) return;

        // Re-insert the restored item and put every item back in allRecentItems' original order.
        const visibleIds = new Set([...recentItems, restoredItem].map(item => item.id));
        recentItems = allRecentItems.filter(item => visibleIds.has(item.id));
        hideUndoButton();
    }

    function hideUndoButton() {
        showUndoButton = false;
        clearTimeout(undoTimer);
    }

    // ── Auto-hide the undo button on the next outside interaction ────────

    function handleOutsideInteraction(event: Event) {
        if ((event.target as HTMLElement).closest('.undoButton')) return;
        hideUndoButton();
        removeOutsideInteractionListeners();
    }

    function addOutsideInteractionListeners() {
        for (const eventName of OUTSIDE_INTERACTION_EVENTS) {
            document.addEventListener(eventName, handleOutsideInteraction);
        }
        document.addEventListener('focus', handleOutsideInteraction, true);
    }

    function removeOutsideInteractionListeners() {
        for (const eventName of OUTSIDE_INTERACTION_EVENTS) {
            document.removeEventListener(eventName, handleOutsideInteraction);
        }
        document.removeEventListener('focus', handleOutsideInteraction, true);
    }

    $: if (showUndoButton) {
        addOutsideInteractionListeners();
        undoTimer = setTimeout(hideUndoButton, UNDO_TIMEOUT_MS);
    } else {
        removeOutsideInteractionListeners();
        clearTimeout(undoTimer);
    }
</script>

<div class="recentGrades">

    {#if recentItems.length === 0}
        <div class="empty-msg">
            <ion-icon icon={sparklesOutline}></ion-icon>
            <p>{$t('recentgrades.nonews')}</p>
        </div>
    {:else}
        <div class="timeline">
            {#each groupedItems as group, gi}

                <!-- Period label row with dot -->
                <div class="tl-row period-row">
                    <div class="tl-left" class:first={gi === 0}>
                        <div class="tl-dot"></div>
                    </div>
                    <span class="tl-period">
                        {formatPeriodLabel(group.period)}
                    </span>
                </div>

                <!-- Card rows for this period -->
                {#each group.items as item, ii (item.id)}
                    {@const isLast = gi === groupedItems.length - 1 && ii === group.items.length - 1}
                    <div class="tl-row" animate:flip={{ duration: 500, easing: quintOut }}>
                        <div class="tl-left" class:last={isLast}></div>
                        <div class="tl-card">
                            <SwipeCard id={item.id} on:delete-card={handleDeleteCard}>
                                {#if item.type === "recentGrade"}
                                    <RecentGrade subject={item.content} />
                                {:else}
                                    <Notification notification={item.content} />
                                {/if}
                            </SwipeCard>
                        </div>
                    </div>
                {/each}

            {/each}
        </div>
    {/if}

    <div class="button-container">
        {#if showUndoButton}
            <ion-button class="undoButton" on:click={restoreDeletedCard} aria-hidden>
                <ion-icon icon={refresh}></ion-icon>
            </ion-button>
        {/if}
    </div>

</div>

<style>
    .empty-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 2rem 1rem;
        color: var(--ion-color-medium);
        text-align: center;
    }

    .empty-msg ion-icon {
        font-size: 1.75rem;
    }

    .empty-msg p {
        margin: 0;
        font-size: 0.9rem;
    }

    /* ── Timeline layout ─────────────────────────────────────────── */

    .timeline {
        display: flex;
        flex-direction: column;
    }

    .tl-row {
        display: flex;
        align-items: flex-start;
    }

    /* Breathing room between period groups (skip the very first one) */
    .period-row:not(:first-child) {
        margin-top: 0.5rem;
    }

    /*
     * Left column: fixed-width track that holds the dot and/or line.
     * align-self: stretch makes it fill the full row height so ::before
     * can draw a continuous vertical line from top to bottom of each row.
     */
    .tl-left {
        width: 24px;
        flex-shrink: 0;
        position: relative;
        align-self: stretch;
        display: flex;
        justify-content: center;
    }

    /* The continuous vertical line */
    .tl-left::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--ion-color-medium);
        opacity: 0.35;
        transform: translateX(-50%);
    }

    /*
     * First dot: hide the line above the dot so it doesn't
     * extend into empty space at the top.
     */
    .tl-left.first::before {
        top: 18px; /* dot margin-top (6px) + dot diameter (10px) + 2px */
    }

    /* Last card: taper the line so it ends at the card midpoint */
    .tl-left.last::before {
        bottom: 50%;
    }

    /* Period dot — sits on top of the line via z-index */
    .tl-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--ion-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.15);
        margin-top: 6px;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
    }

    /* Period label */
    .tl-period {
        padding-left: 8px;
        padding-top: 2px;
        padding-bottom: 4px;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.07em;
        color: var(--ion-color-medium);
    }

    /* Card area — fills remaining width, with bottom gap between cards */
    .tl-card {
        flex: 1;
        min-width: 0;
        padding-left: 8px;
        padding-bottom: 0.4rem;
    }

    /* ── Undo button ─────────────────────────────────────────────── */

    .button-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 999;
    }

    .undoButton {
        --border-radius: 1rem;
        --box-shadow: var(--shadow-short-md);
    }
</style>