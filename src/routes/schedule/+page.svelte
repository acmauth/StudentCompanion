<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
	import TaskCard from '$lib/components/schedule/task/taskCard.svelte';
    import type { TaskItem } from '$lib/components/schedule/task/TaskItem';
    // taskStore.set([]);

    $: currentTasks = $taskStore.filter((task) => {
        if (task.slots.filter((slot) => {
            if (slot.day.toLowerCase().startsWith($activeDay)) {
                return slot;
            }
        }).length > 0) {
            return task;
        }
    })
    .flatMap((task) => {
        return {
            task: task,
            slots: task.slots.filter((slot) => {
                if (slot.day.toLowerCase().startsWith($activeDay)) {
                    return slot;
                }
            })   
        };
    })
    .flatMap((task) => {
        let occurences: Array<{task: TaskItem, slot: any }> = [];
        task.slots.forEach((slot) => {
            occurences.push({
                task: task.task,
                slot: slot
            });
        });
        return occurences;
    })
    .sort((a,b) => {
        let aTime = new Date("1970-01-01T" + a.slot.timeStart);
        let bTime = new Date("1970-01-01T" + b.slot.timeStart);
        return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
    }).map((task) => {
        return {
            taskItem: task.task,
            start: task.slot.timeStart,
            end: task.slot.timeEnd
        };
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

        {#each currentTasks as task}
            <TaskCard task={task.taskItem} start={task.start} end={task.end}/>
        {/each}
        
    </ion-grid>
</ion-page>