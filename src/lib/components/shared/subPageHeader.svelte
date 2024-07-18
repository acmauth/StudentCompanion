<script lang="ts">
    import { Capacitor } from '@capacitor/core';
    import { chevronBack, arrowBack } from 'ionicons/icons';
    import {navController} from 'ionic-svelte'
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let genericHeader: boolean = false;
    export let stackedNav: boolean = false; // Are we in a stacked navigation scenario, or are we using the browser's history?

    // Going back; if stackedNav is true, we use the navController to pop the page, otherwise we use the browser's history
    function goBack(){
        if (stackedNav) {
            navController.pop();
        } else {
            window.history.back();
        }
    }
</script>

<ion-header collapse="condense" mode="ios" class="mildShadow">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
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
        <ion-icon class="backIcon" aria-hidden/>
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