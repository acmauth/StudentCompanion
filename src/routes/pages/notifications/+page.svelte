<script lang="ts">
    import { Capacitor } from '@capacitor/core';
    import Chips from './chips.svelte';
    import { gatherNotifications } from './notifications';
    import Notification from './notification.svelte';
    import { toggles } from './notificationToggles';
    import { flip } from "svelte/animate";
    import { quintOut } from 'svelte/easing';
    import NotifSkeleton from './notifSkeleton.svelte';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';

    let refresher: HTMLIonRefresherElement;
    let notificationsPromise = gatherNotifications();
    
    const refreshNotifications = async () => {
        notificationsPromise = gatherNotifications(true);
        refresher.complete();
    }

    const randList = (length: number) => {
        const randomLength = Math.floor(Math.random() * length) + 2;
        return Array.from({ length: randomLength }, (_, i) => i + 1);
    }

</script>

<ion-tab tab="notifications">
    <ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
            <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
              <ion-title>Ειδοποιήσεις</ion-title>
            </ion-toolbar>
    </ion-header>

    <ion-content fullscreen={true}>
        <ion-header collapse="condense" mode="ios">
            <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
                <ion-title size="large">Ειδοποιήσεις</ion-title>
            </ion-toolbar>
                <Chips/>
        </ion-header>
      
        <ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refreshNotifications}>
            <ion-refresher-content />
         </ion-refresher>
      
        {#await notificationsPromise}
            <ion-progress-bar type="indeterminate"/>
            {#each randList(5) as rand (rand)}
                <NotifSkeleton/>
            {/each}
        {:then notifications}
            {#each notifications as notification (notification.id)}
                <div animate:flip={{ duration: 500, easing: quintOut }}>
                    {#if $toggles.all || ($toggles.universis && notification.type === 'universis') || ($toggles.elearning && notification.type === 'elearning') || ($toggles.elSystem && notification.type === 'system')}
                        <Notification {notification}/>
                    {/if}
                </div>    
            {/each}
      
        {:catch error}
            <ErrorLandingCard errorMsg={error.message}/>
        {/await}
    </ion-content>
</ion-tab>
