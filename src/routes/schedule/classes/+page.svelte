<script lang="ts">
    import type { ClassItem } from '$lib/components/schedule/class/ClassItem';
    import Days from '$lib/components/schedule/day/dayList.svelte';
    import {add, createOutline} from 'ionicons/icons';
    import { classStore } from '$components/schedule/class/ClassStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
	import ClassCard from '$components/schedule/class/classCard.svelte';
	import { universisGet } from '$lib/dataService';
    // Uncomment the following to reset the task store.
    // courseClassStore.set([]);
    
    // $: currentClasses = $classStore.filter((courseClass) => {
    //     // Get only the tasks that have a slot on the active day.
    //     if (courseClass.slots.filter((slot) => {
    //         if (slot.day.toLowerCase().startsWith($activeDay)) { return slot; }
    //     }).length > 0) { return courseClass; } })
    // // Flatten the array of tasks and slots into an array of objects with a task and a slot.
    // .flatMap((task) => {
    //     return {
    //         task: task,
    //         slots: task.slots.filter((slot) => { if (slot.day.toLowerCase().startsWith($activeDay)) { return slot; } })   
    //     }; })
    // // Flatten the array so that each task has only one slot, for each slot.
    // .flatMap((task) => {
    //     let occurences: Array<{task: ClassItem, slot: any }> = [];
    //     task.slots.forEach((slot) => {
    //         occurences.push({
    //             task: task.task,
    //             slot: slot
    //         });
    //     });
    //     return occurences; })
    // // Sort the array by the start time of the slot.
    // .sort((a,b) => new Date("1970-01-01T" + a.slot.timeStart) < new Date("1970-01-01T" + b.slot.timeStart) ? -1 : 0)
    // // Rename the properties of the array to match the names of the props of the TaskCard component.
    // .map(({ task, slot }) => ({ taskItem: task, start: slot.timeStart, end: slot.timeEnd }));
    
    onMount(async() => {
        let classes = (await universisGet('students/me/teachingEvents?$expand=location,performer&$filter=startDate ne null&$top=-1&$orderby=startDate')).value;
        console.log(classes);
    });



</script>


<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title>Πρόγραμμα Μαθημάτων</ion-title>
    </ion-toolbar>
</ion-header>

<ion-fab horizontal="start" vertical="bottom">
    <ion-fab-button href="/schedule/tasks" color="secondary">
        <ion-icon icon={createOutline} />
    </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
    <ion-fab-button href="/schedule/addcourseClass" color="primary">
        <ion-icon icon={add} />
    </ion-fab-button>
</ion-fab>


<ion-content fullscreen={true}>
    <Days />    

    <ion-grid style="padding: 0%">
        <!-- {#each currentClasses as courseClass}
            <ClassCard classCourse={courseClass.taskItem} start={courseClass.start} end={courseClass.end}/>
        {/each} -->
    </ion-grid>
</ion-content>