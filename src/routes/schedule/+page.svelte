<script lang="ts">
    import { setupIonicBase } from 'ionic-svelte';
    import  Dates  from '$lib/components/schedule/day.svelte';

    /* Call Ionic's setup routine */
    setupIonicBase();

    /* Import all components - or do partial loading - see below */
    import 'ionic-svelte/components/all';

</script>

<ion-card class="day-panel">
    <ion-card-header>
      hello
    </ion-card-header>
    <ion-card-content>
        <Dates day="Monday"/>
    </ion-card-content>
</ion-card>