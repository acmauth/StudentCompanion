<!--
    Shared bottom-sheet modal (used by the calendar event modal and the notification details).
    Provides the rounded-top frame, a header with a round close button, a centred title/subtitle
    and an optional round primary action, and a scrollable body.

    Body content goes in the default slot. Wrap blocks in `class="sheet-group"` to get the
    rounded card surface. The `--group-bg` CSS variable is available for matching backgrounds.

    The ionModalWillPresent, ionModalDidDismiss and ionBreakpointDidChange events are forwarded.
-->
<script lang="ts">
    import { close } from 'ionicons/icons';
    import { t } from '$lib/i18n';

    // Types of the events forwarded from <ion-modal>
    interface $$Events {
        ionModalWillPresent: CustomEvent<void>;
        ionModalDidDismiss: CustomEvent<{ data?: unknown; role?: string }>;
        ionBreakpointDidChange: CustomEvent<{ breakpoint: number }>;
    }

    export let isOpen: boolean;
    export let title: string;
    export let subtitle: string | undefined = undefined;
    /** Long titles (e.g. email subjects) can wrap to 2 lines instead of being cut to 1 */
    export let titleLines: 1 | 2 = 1;

    export let closeLabel: string | undefined = undefined;

    /** Round primary button on the right of the header; omitted when onAction is not set */
    export let actionIcon: string | undefined = undefined;
    export let actionLabel: string | undefined = undefined;
    export let onAction: (() => void) | undefined = undefined;

    export let initialBreakpoint: number = 0.5;
    export let breakpoints: number[] = [0, 0.5, 1];
    export let handleBehavior: 'none' | 'cycle' | undefined = undefined;
    export let keepContentsMounted: boolean = false;

    // Closing only flips isOpen: Ionic animates the dismissal and then fires ionModalDidDismiss
    function requestClose() {
        isOpen = false;
    }

    function handleDidDismiss() {
        isOpen = false;
    }
</script>

<ion-modal
    class="bottom-sheet"
    is-open={isOpen}
    initial-breakpoint={initialBreakpoint}
    {breakpoints}
    handle-behavior={handleBehavior}
    keep-contents-mounted={keepContentsMounted}
    on:ionModalDidDismiss={handleDidDismiss}
    on:ionModalDidDismiss
    on:ionModalWillPresent
    on:ionBreakpointDidChange
>
    <ion-header class="ion-no-border">
        <div class="sheet-header">
            <!-- ion-button renders a native <button> internally, so it is keyboard-accessible -->
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <ion-button class="round-btn neutral" fill="solid" on:click={requestClose} aria-label={closeLabel ?? $t('common.cancel')}>
                <ion-icon slot="icon-only" icon={close}></ion-icon>
            </ion-button>
            <div class="sheet-titles">
                <h2 class:multiline={titleLines > 1}>{title}</h2>
                {#if subtitle}
                    <span>{subtitle}</span>
                {/if}
            </div>
            {#if onAction}
                <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
                <ion-button class="round-btn primary" fill="solid" on:click={onAction} aria-label={actionLabel}>
                    <ion-icon slot="icon-only" icon={actionIcon}></ion-icon>
                </ion-button>
            {:else}
                <span class="round-btn-spacer"></span>
            {/if}
        </div>
    </ion-header>
    <ion-content force-overscroll class="sheet-body">
        <slot />
    </ion-content>
</ion-modal>

<style>
    .bottom-sheet {
        /* Round only the top corners; the sheet sits flush with the bottom of the screen */
        --border-radius: 1.5rem 1.5rem 0 0;
        --background: var(--ion-background-color, #fff);
        --box-shadow: rgba(100, 100, 111, 0.2) 0px -7px 29px 0px;
    }

    ion-header {
        background: var(--ion-background-color, #fff);
    }

    .sheet-header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 1rem 0.75rem;
    }

    .sheet-titles {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 0;
        text-align: center;
    }

    .sheet-titles h2 {
        margin: 0;
        max-width: 100%;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--ion-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .sheet-titles h2.multiline {
        font-size: 1.1rem;
        line-height: 1.3;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow-wrap: anywhere;
    }

    .sheet-titles span {
        margin-top: 0.15rem;
        font-size: 0.85rem;
        color: var(--ion-color-step-600, #999);
    }

    .round-btn {
        --border-radius: 50%;
        --padding-start: 0;
        --padding-end: 0;
        --box-shadow: none;
        width: 1.9rem; /* ≈37px with this app's root font size */
        height: 1.9rem;
        margin: 0;
        font-size: 0.8rem;
    }

    .round-btn-spacer {
        width: 1.9rem; /* keeps the title centred when there is no action button */
    }

    .round-btn.neutral {
        --background: var(--ion-color-step-100, #e6e6e6);
        --background-activated: var(--ion-color-step-200, #ccc);
        --color: var(--ion-color-step-700, #4d4d4d);
    }

    .round-btn.primary {
        --background: var(--ion-color-primary);
        --color: var(--ion-color-primary-contrast, #fff);
    }

    .sheet-body {
        /* card surface: white on the light grey sheet (like the homepage cards), step-50 in dark mode */
        --group-bg: #fff;
        --background: var(--ion-background-color, #fff);
        --padding-start: 1rem;
        --padding-end: 1rem;
        --padding-bottom: 2rem;
    }

    :global(body.dark) .sheet-body {
        --group-bg: var(--ion-color-step-50, #1e1e1e);
    }

    /* Rounded card blocks inside the body */
    .sheet-body :global(.sheet-group) {
        margin-bottom: 1rem;
        border-radius: 1rem;
        overflow: hidden;
        background: var(--group-bg);
    }
</style>
