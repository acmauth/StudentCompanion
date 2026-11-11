<script lang="ts">
    import { Capacitor } from '@capacitor/core';
    import { chevronBack, arrowBack } from 'ionicons/icons';
    import {navController} from '$components/shared/StackedNav';
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    interface Props {
        title: string;
        subtitle?: string | undefined;
        genericHeader?: boolean;
        stackedNav?: boolean; // Are we in a stacked navigation scenario, or are we using the browser's history?
        showSave?: boolean; // Show a Save action on the right of the header
        saveLabel?: string;
    }

    let {
        title,
        subtitle = undefined,
        genericHeader = false,
        stackedNav = false,
        showSave = false,
        saveLabel = ''
    }: Props = $props();

    const dispatch = createEventDispatcher();

    // Going back; if stackedNav is true, we use the navController to pop the page, otherwise we use the browser's history
    function goBack(){
        if (stackedNav) {
            navController.pop();
        } else {
            window.history.back();
        }
    }

    // Commit the save, then navigate back the same way the back button does
    function onSaveClick(){
        dispatch('save');
        goBack();
    }

    // Hijacking the back button on Android to go back
    
</script>

<ion-header collapse="condense" mode="ios" class="mildShadow">
    <ion-toolbar mode="md">
    <div class="headerContent ion-padding-horizontal">
        {#if genericHeader}
            <ion-icon class="backIcon" aria-hidden></ion-icon>
        {:else}
            <ion-icon class="backIcon" slot="start" icon={chevronBack} onclick={goBack} aria-hidden></ion-icon>
        {/if}
        <div class="headerTitle ">
            <ion-title class="ion-no-padding">{title}</ion-title>
            {#if subtitle}
                <ion-subtitle>{subtitle}</ion-subtitle>
            {/if}
        </div>
        {#if showSave}
            <ion-button fill="clear" size="small" class="saveButton" onclick={onSaveClick} transition:fly={{ x: 12, duration: 250, easing: backOut }}>{saveLabel}</ion-button>
        {:else}
            <ion-icon class="backIcon" aria-hidden></ion-icon>
        {/if}
        </div>
    </ion-toolbar>
</ion-header>
    
<style>
    .headerContent {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-between;
    }
    .backIcon {
        font-size: 2rem;
        flex-shrink: 0;
    }
    .headerTitle {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>