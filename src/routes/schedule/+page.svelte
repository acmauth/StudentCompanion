<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
	import { onMount } from 'svelte';
	import TaskCard from '$lib/components/schedule/task/taskCard.svelte';
	import type { TaskItem } from '$lib/components/schedule/task/TaskItem';
	import { getDayIndex, weekdays } from '$lib/components/schedule/day/days';

    export     let weeklyTaskList = new Array<TaskItem[]>();

    onMount(() => {
            
        // $taskStore = new Array<TaskItem>();     
        if($taskStore?.length == 0) {
            $taskStore = new Array<TaskItem>();     
        } else {
            let dayList = weekdays;
            for (let i = 0; i < dayList.length; i++) {
                let dayTasks = new Array<TaskItem>();
                $taskStore.filter((task) => {
                    if (task.slots.filter((slot) => {
                        if (slot.day.toLowerCase().startsWith(Object.keys(dayList[i])[0])) {
                            return slot;
                        }
                    }).length > 0) {
                        dayTasks.push(task);
                    }
                });
                weeklyTaskList.push(dayTasks);
            }

            for (let  i = 0; i < weeklyTaskList.length ; i++) {
                weeklyTaskList[i].sort((a,b) => {
                    let aTime = new Date("1970-01-01T" + a.slots.filter((slot) => {
                        if (slot.day.toLowerCase().startsWith(Object.keys(dayList[i])[0])) {
                            return slot;
                        }
                    })[0].timeStart);
                    let bTime = new Date("1970-01-01T" + b.slots.filter((slot) => {
                        if (slot.day.toLowerCase().startsWith(Object.keys(dayList[i])[0])) {
                            return slot;
                        }
                    })[0].timeStart);
                    return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
                });
            }            
        }
        console.log(weeklyTaskList);
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

        {#each weeklyTaskList[getDayIndex($activeDay)] as task}
                {#each task.slots as slot}
                    {#if slot.day.toLowerCase().startsWith($activeDay)}
                        <TaskCard task={task} start={slot.timeStart} end={slot.timeEnd}/>
                    {/if}
                {/each}
        {/each}
    </ion-grid>
</ion-page>