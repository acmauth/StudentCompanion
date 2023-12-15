<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import {add, calendarOutline} from 'ionicons/icons';
    import { taskStore } from '$components/schedule/task/TaskStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
	import TaskCard from '$components/schedule/task/taskCard.svelte';
    import type { TaskItem } from '$components/schedule/task/TaskItem';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';

    
    // Uncomment the following to reset the task store.
    // taskStore.set([]);

    
	// const task: TaskItem = {
	// 	id: Math.random(),
	// 	slot: {
	// 		date: new Date(),
	// 		timeStart: '10:00',
	// 		timeEnd: '11:00'
	// 	},
	// 	title: 'Sample Task',
	// 	description: 'This is a sample task'
	// };
    
	// onMount(() => {
	// 	$taskStore = $taskStore.concat(task);
	// });

</script>

<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title>Εργασίες και εξετάσεις</ion-title>
    </ion-toolbar>

</ion-header>


<ion-fab horizontal="start" vertical="bottom">
    <ion-fab-button href="/schedule" color="secondary">
        <ion-icon icon={calendarOutline} />
    </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
    <ion-fab-button href="/schedule/tasks/addTask" color="primary">
        <ion-icon icon={add} />
    </ion-fab-button>
</ion-fab>

<ion-content fullscreen={true}>
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
            <ion-title size="large">Εργασίες και εξετάσεις</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-grid style="padding: 0%">
        {#each $taskStore as task}
            <TaskCard task={task}/>
        {/each}
    </ion-grid>
</ion-content>