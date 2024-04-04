<script>
    import { capacitorPersistedStore } from "$lib/storage/capacitorPersistedStore";
    import { onMount } from 'svelte';

    async function doThing(){
        setTimeout(() => {
            console.log("Hello world!");
        }, 0);
    }
    console.log("1");
    doThing();
    console.log("2");
    // const storeThing = await capacitorPersistedStore('test', {count: 0});

</script>

<ion-content>
    <ion-card>
        <ion-card-header>
            <ion-card-title>Δοκιμή</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <p></p>
        </ion-card-content>
    </ion-card>
</ion-content>