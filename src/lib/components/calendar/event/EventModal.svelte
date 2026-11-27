<script lang="ts">
    import { close, checkmark } from 'ionicons/icons';
    import EventDetails from './EventDetails.svelte';
    import type { Event } from './Event';
    import { EventCheckFormat, getEventTypeValue } from './Event';
    import { toastController } from 'ionic-svelte';
    import type { ToastOptions } from '@ionic/core';
    import { t, getLocale } from '$lib/i18n';

    export let isOpen: boolean;
    export let event: Event;
    export let onSubmit: (event: Event) => void;
    export let onDelete: (event: Event) => void;
    export let onClose: () => void;

    let tmpEvent: Event = JSON.parse(JSON.stringify(event));
    let lastEventId: number | undefined = event?.id;

    // When the parent passes a different event, clone it into tmpEvent.
    // This triggers the {#key} block to recreate EventDetails with fresh state.
    $: if (event && event.id !== lastEventId) {
        lastEventId = event.id;
        tmpEvent = JSON.parse(JSON.stringify(event));
    }

    function handleModalPresent() {
        tmpEvent = JSON.parse(JSON.stringify(event));
        lastEventId = event?.id;
    }

    function handleBreakpointChange(e: CustomEvent) {
        isOpen = e.detail.breakpoint !== 0;
        if (!isOpen) {
            onClose();
        }
    }

    function handleModalDismiss() {
        isOpen = false;
        onClose();
    }

    async function submit() {
        const formatCheck = EventCheckFormat(tmpEvent);
        if (formatCheck.error) {
            await showToast({
                color: 'danger',
                duration: 3000,
                message: formatCheck.description,
                mode: 'ios',
                translucent: true,
                layout: 'stacked',
                positionAnchor: "bottom",
                cssClass: 'custom-toast'
            });
            return;
        }
        onSubmit(tmpEvent);
    }

    async function showToast(toast: ToastOptions) {
        const toast_ = await toastController.create(toast);
        toast_.present();
    }

    function handleDelete() {
        onDelete(tmpEvent);
    }

    // Existing events can be deleted; the "new event" prototype has an empty title
    $: canDelete = event?.title !== "";
</script>

<ion-modal
    class="event-sheet"
    is-open={isOpen}
    initial-breakpoint={0.5}
    breakpoints={[0, 0.5, 1]}
    on:ionBreakpointDidChange={handleBreakpointChange}
    on:ionModalDidDismiss={handleModalDismiss}
    on:ionModalWillPresent={handleModalPresent}
    keep-contents-mounted
>
    <ion-header class="ion-no-border">
        <div class="sheet-header">
            <!-- ion-button renders a native <button> internally, so it is keyboard-accessible -->
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <ion-button id="cancel" class="round-btn neutral" fill="solid" on:click={onClose} aria-label={$t('event.cancel')}>
                <ion-icon slot="icon-only" icon={close}></ion-icon>
            </ion-button>
            <div class="sheet-titles">
                <h2>{tmpEvent?.type ? getEventTypeValue(tmpEvent.type, getLocale()) : $t('event.type')}</h2>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
            <ion-button id="submit" class="round-btn primary" fill="solid" on:click={submit} aria-label={$t('common.save')}>
                <ion-icon slot="icon-only" icon={checkmark}></ion-icon>
            </ion-button>
        </div>
    </ion-header>
    {#key tmpEvent?.id}
        <EventDetails bind:copyEvent={tmpEvent} onDelete={canDelete ? handleDelete : undefined} />
    {/key}
</ion-modal>

<style>
    /* Sheet styling in line with the room panel on the maps page */
    .event-sheet {
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

    .round-btn.neutral {
        --background: var(--ion-color-step-100, #e6e6e6);
        --background-activated: var(--ion-color-step-200, #ccc);
        --color: var(--ion-color-step-700, #4d4d4d);
    }

    .round-btn.primary {
        --background: var(--ion-color-primary);
        --color: var(--ion-color-primary-contrast, #fff);
    }
</style>
