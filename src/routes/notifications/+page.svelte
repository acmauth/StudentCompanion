<script lang="ts">
    import { Capacitor } from '@capacitor/core';
    import Chips from './chips.svelte';
    import { gatherNotifications } from './notifications';
    import Notification from './notification.svelte';
    import { toggles } from './notificationToggles';
    import { flip } from "svelte/animate";
    import { quintOut } from 'svelte/easing';
    
</script>

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
    
    {#await gatherNotifications()}
        
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
        <!-- <ion-skeleton-text animated style="width: 80px"></ion-skeleton-text> -->
        <!-- TODO skeletos -->
        
    {:then notifications}
        {#each notifications as notification (notification.id)}
            <div animate:flip={{ duration: 500, easing: quintOut }}>
                {#if $toggles.all || ($toggles.universis && notification.type === 'universis') || ($toggles.elearning && notification.type === 'elearning') || ($toggles.elSystem && notification.type === 'system')}
                    <Notification {notification}/>
                {/if}
            </div>    
        {/each}
    {:catch error}
        <p>{error.message}</p>
    {/await}

    
</ion-content>


