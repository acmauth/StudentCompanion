<script lang="ts">
    import { Capacitor } from '@capacitor/core';
    import { chevronBack, arrowBack } from 'ionicons/icons';
    import {navController} from '$components/shared/StackedNav';
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let genericHeader: boolean = false;
    export let stackedNav: boolean = false; // Are we in a stacked navigation scenario, or are we using the browser's history?
    export let showSave: boolean = false; // Show a Save action on the right of the header
    export let saveLabel: string = '';

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
            <ion-icon class="backIcon" aria-hidden/>
        {:else}
            <ion-icon class="backIcon" slot="start" icon={chevronBack} on:click={goBack} aria-hidden/>
        {/if}
        <div class="headerTitle ">
            <ion-title class="ion-no-padding">{title}</ion-title>
            {#if subtitle}
                <ion-subtitle>{subtitle}</ion-subtitle>
            {/if}
        </div>
        {#if showSave}
            <ion-button fill="clear" size="small" class="saveButton" on:click={onSaveClick} transition:fly={{ x: 12, duration: 250, easing: backOut }}>{saveLabel}</ion-button>
        {:else}
            <ion-icon class="backIcon" aria-hidden/>
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
    }
    .headerTitle {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>