<script lang="ts">
    import {bookOutline, schoolOutline, add} from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
	import TaskCard from '$components/schedule/task/taskCard.svelte';
    import { Capacitor } from '@capacitor/core';    
	import { onMount } from 'svelte';

    //TODO: sort tasks by date
    // $taskStore = [];
    console.log($taskStore)
    onMount(async() => {
        // $taskStore.forEach(task => { console.log(task); })
        // taskStore.update(tasks => tasks.sort((a, b) => a.date.startDate.getTime() - b.date.startDate.getTime()));
    });
</script>

<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title>Εργασίες και πρόοδοι</ion-title>
      <ion-buttons slot="end">
        <ion-button href="/schedule/tasks/addTask">
          <ion-icon slot="icon-only" icon={add}></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
</ion-header>

<ion-fab horizontal="start" vertical="bottom">
    <ion-fab-button href="/schedule/exams" color="secondary">
        <ion-icon icon={schoolOutline} />
    </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
    <ion-fab-button href="/schedule/classes" color="primary">
        <ion-icon icon={bookOutline} />
    </ion-fab-button>
</ion-fab>


<ion-content >
    <ion-grid style="padding: 0%">
        {#each $taskStore as task}
            <TaskCard taskItem={task} />
        {/each}
    </ion-grid>
</ion-content>