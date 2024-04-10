<script>
    import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
    import { onMount } from 'svelte';

    let myStore = new CapacitorPersistedStore("testValue", 'myStore');
    let myOtherStore = new CapacitorPersistedStore("testValue", 'myOtherStore');

    onMount( async () => {
        await myStore.loadFromStorage();
        await myOtherStore.loadFromStorage();
    });

</script>

<ion-content>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Δοκιμή</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <p>{$myStore}</p>
            <ion-button onClick={() => myStore.set('Δοκιμή')}>Αλλαγή</ion-button>
            <p>{$myOtherStore}</p>
            <ion-button onClick={() => myOtherStore.set('Δεύτερη Δοκιμή')}>Αλλαγή</ion-button>
        </ion-card-content>
    </ion-card>
</ion-content>
