<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
	import TaskCard from '$lib/components/schedule/task/taskCard.svelte';
	import IonNav from 'ionic-svelte/components/IonNav.svelte';
    import type { TaskItem } from '$lib/components/schedule/task/TaskItem';
    
    // Uncomment the following to reset the task store.
    // taskStore.set([]);
    
    onMount(() => {

        // TODO: Sort the $taskStore list for each day each slot by timeStart
        // let store = $taskStore;

        // Enable below to reset taskStore
        // taskStore.set([]);
        // $taskStore.forEach((task) => {console.log(task)})
    });

</script>

<ion-tab tab="schedule">
<ion-content style="overflow-y: auto;">
        
    <ion-fab horizontal="end" vertical="bottom">
        <ion-fab-button href="/schedule/addTask" color="primary">
            <ion-icon icon={allIonicIcons.add} />
        </ion-fab-button>
    </ion-fab>

    <ion-grid style="padding: 0%">
        <ion-header>
            <ion-toolbar>
                <ion-title>Schedule</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-row style="position: relative; z-index: 1000">
            <Days />
        </ion-row>

        {#each currentTasks as task}
            <TaskCard task={task.taskItem} start={task.start} end={task.end}/>
        {/each}
    </ion-grid>
</ion-content>
</ion-tab>