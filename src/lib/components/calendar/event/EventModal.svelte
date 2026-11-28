<script lang="ts">
    import { checkmark } from 'ionicons/icons';
    import EventDetails from './EventDetails.svelte';
    import BottomSheet from '$common/BottomSheet.svelte';
    import type { Event } from './event';
    import { EventCheckFormat, getEventTypeValue } from './event';
    import { toastController } from 'ionic-svelte';
    import type { ToastOptions } from '@ionic/core';
    import { t, getLocale } from '$methods/i18n';

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

<BottomSheet
    bind:isOpen
    title={tmpEvent?.type ? getEventTypeValue(tmpEvent.type, getLocale()) : $t('event.type')}
    closeLabel={$t('event.cancel')}
    actionIcon={checkmark}
    actionLabel={$t('common.save')}
    onAction={submit}
    keepContentsMounted
    on:ionBreakpointDidChange={handleBreakpointChange}
    on:ionModalDidDismiss={handleModalDismiss}
    on:ionModalWillPresent={handleModalPresent}
>
    {#key tmpEvent?.id}
        <EventDetails bind:copyEvent={tmpEvent} onDelete={canDelete ? handleDelete : undefined} />
    {/key}
</BottomSheet>
