<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
	import TaskCard from '$lib/components/schedule/task/taskCard.svelte';

    // taskStore.set([]);

    $: currentTasks = $taskStore.filter((task) => {
        if (task.slots.filter((slot) => {
            if (slot.day.toLowerCase().startsWith($activeDay)) {
                return slot;
            }
        }).length > 0) {
            return task;
        }
    }).flatMap((task) => {return task.slots.forEach(element => {
            return {tile: task.title, timeStart: element.timeStart, timeEnd: element.timeEnd};
            });
        });
</script>

<ion-page style="overflow-y: auto;">
    <ion-fab horizontal="end" vertical="bottom">
        <ion-fab-button href="/schedule/addTask" color="add">
            <ion-icon icon={allIonicIcons.add} />
        </ion-fab-button>
    </ion-fab>

    <ion-grid style="padding: 0%">
        <ion-header>
            <ion-toolbar>
                <ion-title>Schedule</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-row style="position:sticky;">
            <Days />
        </ion-row>

        {#each currentTasks as task1}
            <TaskCard task={task.title} start={slot.timeStart} end={slot.timeEnd}/>
        {/each}
    </ion-grid>
</ion-page>