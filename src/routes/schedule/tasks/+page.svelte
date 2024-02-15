<script lang="ts">
    import {bookOutline, schoolOutline, add} from 'ionicons/icons';
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import type { TaskItem } from '$lib/components/schedule/task/TaskItem';
	import TaskCard from '$components/schedule/task/taskCard.svelte';
    import { Capacitor } from '@capacitor/core';    
	import { onMount } from 'svelte';

    let groupedTasks : { [key: string]: TaskItem[] }= {};
    
    let tasks : Array<TaskItem> = $taskStore;
    
    onMount(async() => {    
        // Group tasks by date
        tasks.forEach(task => {
            const startDate = new Date(task.date.startDate);
            const weekday = startDate.toLocaleDateString('el-GR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
            if (!groupedTasks[weekday]) {
                groupedTasks[weekday] = [];
            }
            groupedTasks[weekday].push(task);
        });
    });
</script>

<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title>Συμβάντα</ion-title>
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

<ion-content style="overflow-y: auto;">
    <ion-grid>
        {#each Object.entries(groupedTasks) as [weekday, tasks]}
            <ion-div>
                <br />
                <ion-label style="margin-left: 8px">{weekday}</ion-label>
                {#each tasks as task}
                    <TaskCard taskItem={task} />
                {/each}
            </ion-div>
        {/each}
    </ion-grid>
</ion-content>
