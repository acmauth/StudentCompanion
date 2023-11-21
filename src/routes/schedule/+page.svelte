<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import {taskStore} from '$lib/components/schedule/task/taskStore';
    import {activeDay} from '$lib/components/schedule/day/activeDay';
	import { onMount } from 'svelte';
	import TaskCard from '$lib/components/schedule/task/taskCard.svelte';

    onMount(() => {

        // TODO: Sort the $taskStore list for each day each slot by timeStart
        // let store = $taskStore;

        // Enable below to reset taskStore
        // taskStore.set([]);
        // $taskStore.forEach((task) => {console.log(task)})
    });

</script>

<ion-page class="card-container" style="overflow-y: auto;">
    <ion-fab horizontal="end" vertical="bottom" slot="fixed">
        <ion-fab-button href="/schedule/addTask" color="add">
            <ion-icon icon={allIonicIcons.add} />
        </ion-fab-button>
    </ion-fab>
    <ion-grid style="height: 100%">
        <ion-header>
            <ion-toolbar>
              <ion-title>Schedule</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-row style="position:sticky">
            <Days />
        </ion-row>
        {#each $taskStore as task}
            {#each task.slots as slot}
                {#if slot.day.toLowerCase().startsWith($activeDay)}
                    <TaskCard task={task} start={slot.timeStart} end={slot.timeEnd}/>
                {/if}
            {/each}
        {/each}
    </ion-grid>

</ion-page>

<style>
    .card-container {
        display: flex;
        justify-content: center;
    }
</style>