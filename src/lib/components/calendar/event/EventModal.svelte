<script lang="ts">
    import { run } from 'svelte/legacy';
    import { onDestroy } from 'svelte';

    import { close, checkmark } from 'ionicons/icons';
    import EventDetails from './EventDetails.svelte';
    import type { Event } from './Event';
    import { EventCheckFormat, getEventTypeValue } from './Event';
    import { toastController } from 'ionic-svelte';
    import type { ToastOptions } from '@ionic/core';
    import { t, getLocale } from '$lib/i18n';

    interface Props {
        isOpen: boolean;
        event: Event;
        onSubmit: (event: Event) => void;
        onDelete: (event: Event) => void;
        onClose: () => void;
    }

    let {
        isOpen = $bindable(),
        event = $bindable(),
        onSubmit,
        onDelete,
        onClose
    }: Props = $props();

    let modalEl: HTMLIonModalElement | undefined = $state();
    let destroyed = false;

    // How closing works: while presented, Ionic "teleports" <ion-modal> under <ion-app> (leaving a
    // marker comment in place) and moves it back right *after* firing ionModalDidDismiss.
    // So every close path (X, save, delete, swipe down) only sets isOpen = false, Ionic dismisses,
    // and onClose() - which makes the parent unmount us - runs once Ionic has moved the modal back.
    // If the parent still unmounts us while presented, Svelte 5 can't remove the teleported element,
    // so as a safety net we dismiss and remove it ourselves.
    onDestroy(() => {
        destroyed = true;
        const el = modalEl;
        if (!el) return;
        if ((el as any).presented) {
            el.dismiss().catch(() => {}).finally(() => el.remove());
        } else {
            el.remove();
        }
    });

    function requestClose() {
        if (!destroyed) isOpen = false;
    }

    let tmpEvent: Event = $state(JSON.parse(JSON.stringify(event)));
    let lastEventId: number | undefined = $state(event?.id);

    // When the parent passes a different event, clone it into tmpEvent.
    // This triggers the {#key} block to recreate EventDetails with fresh state.
    run(() => {
        if (event && event.id !== lastEventId) {
            lastEventId = event.id;
            tmpEvent = JSON.parse(JSON.stringify(event));
        }
    });

    function handleModalPresent() {
        tmpEvent = JSON.parse(JSON.stringify(event));
        lastEventId = event?.id;
    }

    function handleBreakpointChange(e: CustomEvent) {
        // Swiped down to 0: Ionic dismisses the modal itself; ionModalDidDismiss then closes us
        if (e.detail.breakpoint === 0) requestClose();
    }

    function handleModalDismiss() {
        if (destroyed) return; // our own safety-net dismiss after the parent already unmounted us
        isOpen = false;
        // Defer: Ionic moves the teleported modal back into place right after this event
        setTimeout(() => { if (!destroyed) onClose(); });
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
    let canDelete = $derived(event?.title !== "");
</script>

<ion-modal
    bind:this={modalEl}
    class="event-sheet"
    is-open={isOpen}
    initial-breakpoint={0.5}
    breakpoints={[0, 0.5, 1]}
    onionBreakpointDidChange={handleBreakpointChange}
    onionModalDidDismiss={handleModalDismiss}
    onionModalWillPresent={handleModalPresent}
    keep-contents-mounted
>
    <ion-header class="ion-no-border">
        <div class="sheet-header">
            <ion-button id="cancel" class="round-btn neutral" fill="solid" onclick={requestClose} aria-label={$t('event.cancel')}>
                <ion-icon slot="icon-only" icon={close}></ion-icon>
            </ion-button>
            <div class="sheet-titles">
                <h2>{tmpEvent?.type ? getEventTypeValue(tmpEvent.type, getLocale()) : $t('event.type')}</h2>
            </div>
            <ion-button id="submit" class="round-btn primary" fill="solid" onclick={submit} aria-label={$t('common.save')}>
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
        --border-radius: 1.5rem;
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
