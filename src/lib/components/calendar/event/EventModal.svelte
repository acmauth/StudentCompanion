<script lang="ts">
    import { close, checkmark, trash } from 'ionicons/icons';
    import EventDetails from './EventDetails.svelte';
    import type { Event } from './Event';
    import { EventCheckFormat } from './Event';
    import { toastController } from 'ionic-svelte';
    import type { ToastOptions } from '@ionic/core';
    import { t } from '$lib/i18n';

    export let isOpen: boolean;
    export let event: Event;
    export let onSubmit: (event: Event) => void;
    export let onDelete: (event: Event) => void;
    export let onClose: () => void;

    let tmpEvent: Event = { ...event };

    function handleModalPresent() {
        tmpEvent = JSON.parse(JSON.stringify(event));
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
</script>

<ion-modal 
    is-open={isOpen} 
    initial-breakpoint={0.5} 
    breakpoints={[0, 0.5, 1]} 
    on:ionBreakpointDidChange={handleBreakpointChange}
    on:ionModalDidDismiss={handleModalDismiss}
    on:ionModalWillPresent={handleModalPresent}
    keep-contents-mounted
>
    <ion-toolbar>
        <ion-buttons slot="end">
            {#if event?.title !== ""}
            <ion-button id="delete" on:click={handleDelete} aria-hidden>
                <ion-icon slot="icon-only" icon={trash}/>
            </ion-button>
            {/if}
            <ion-button id="submit" on:click={submit} aria-hidden>
                <ion-icon slot="icon-only" icon={checkmark}/>
            </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
            {event.title || $t('event.title')}
        </ion-title>
        <ion-buttons slot="start">
            <ion-button id="cancel" on:click={onClose} aria-hidden>
                <ion-icon slot="icon-only" icon={close}/>
            </ion-button>
        </ion-buttons>
    </ion-toolbar>
    <EventDetails bind:copyEvent={tmpEvent} />
</ion-modal>

<style>
    ion-button {
        text-transform: none;
    }
</style>
