<script lang="ts">
    import { Capacitor } from '@capacitor/core';
    import { chevronBack, arrowBack } from 'ionicons/icons';
    export let title: string;
    export let subtitle: string | undefined = undefined;

</script>

<ion-header collapse="condense" mode="ios" class="mildShadow">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
    <div class="headerContent ion-padding-horizontal">
        <ion-icon class="backIcon" slot="start" icon={chevronBack} on:click={() => {console.log('back clicked'); window.history.back()}} aria-hidden/>
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