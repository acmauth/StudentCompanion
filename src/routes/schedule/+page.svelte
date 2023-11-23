<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
	import TaskCard from '$lib/components/schedule/task/taskCard.svelte';
    import type { TaskItem } from '$lib/components/schedule/task/TaskItem';
    
    // Uncomment the following to reset the task store.
    // taskStore.set([]);

    $: currentTasks = $taskStore.filter((task) => {
        // Get only the tasks that have a slot on the active day.
        if (task.slots.filter((slot) => {
            if (slot.day.toLowerCase().startsWith($activeDay)) { return slot; }
        }).length > 0) { return task; } })
    // Flatten the array of tasks and slots into an array of objects with a task and a slot.
    .flatMap((task) => {
        return {
            task: task,
            slots: task.slots.filter((slot) => { if (slot.day.toLowerCase().startsWith($activeDay)) { return slot; } })   
        }; })
    // Flatten the array so that each task has only one slot, for each slot.
    .flatMap((task) => {
        let occurences: Array<{task: TaskItem, slot: any }> = [];
        task.slots.forEach((slot) => {
            occurences.push({
                task: task.task,
                slot: slot
            });
        });
        return occurences; })
    // Sort the array by the start time of the slot.
    .sort((a,b) => new Date("1970-01-01T" + a.slot.timeStart) < new Date("1970-01-01T" + b.slot.timeStart) ? -1 : 0)
    // Rename the properties of the array to match the names of the props of the TaskCard component.
    .map(({ task, slot }) => ({ taskItem: task, start: slot.timeStart, end: slot.timeEnd }));
</script>

<ion-page style="overflow-y: auto;">
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
</ion-page>