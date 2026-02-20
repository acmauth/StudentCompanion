<script lang='ts'>
    import { sadOutline } from 'ionicons/icons';
    import { logOut } from '$src/routes/personalInfo/personalInfo.svelte';
    import { resetPersistedStores } from "$src/routes/persistedStoreDeclarations.js";
    import { Preferences } from "@capacitor/preferences";
    import Dexie from 'dexie';
    import { t } from '$lib/i18n';
    export let errorMsg: string;

    async function clearCacheAndReload() {
        await resetPersistedStores();
        Dexie.delete('cachedData');
        await tick();
        location.reload();
    }
</script>

<ion-card class="custom-card">
    <ion-icon icon={sadOutline} class="custom-icon"></ion-icon>
    <ion-title class="custom-title">Ωχ!</ion-title>
    <ion-subtitle>Φαίνεται πως προέκυψε κάποιο σφάλμα.</ion-subtitle>
    <ion-list inset={true}>
        <ion-accordion-group>
           <ion-accordion class="custom-accordion">
              <ion-item slot="header">
                 <ion-label color="medium">Περισσότερες λεπτομέρειες</ion-label>
              </ion-item>
              <ion-list slot="content">
                 <ion-item class="custom-accordion-item" text-wrap>
                    <ion-label color="medium">{errorMsg}</ion-label>
                 </ion-item>
              </ion-list>
           </ion-accordion>
     </ion-accordion-group>    
     <ion-button shape="round" style="margin-top: 1rem;" on:click={logOut}>{$t('settings.logout')}</ion-button>
     <ion-button shape="round" fill="outline" style="margin-bottom: 1rem;" on:click={clearCacheAndReload}>{$t('settings.retry')}</ion-button>
    </ion-list>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
     
</ion-card>

<style>
    .custom-card {
        text-align: center;
        padding: 10px;
        padding-bottom: 0;
    }

    .custom-icon {
        font-size: 4rem;
        padding: 10px;
        margin: 10px;

    }

    .custom-title {
        font-size: 2rem;
        margin-bottom: 15px;
    }

    .custom-accordion {
        transform: scale(0.8); 
    }

    ion-button {
        text-transform: none;
        margin:0.5rem;
    }
</style>
