<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    // import Days from '$lib/components/schedule/day/days.svelte';
    import {add, createOutline} from 'ionicons/icons';
    import { subjectStore } from '$components/schedule/subject/SubjectStore';
    import { activeDay } from '$lib/components/schedule/day/activeDay';
    import type { SubjectItem } from '$components/schedule/subject/SubjectItem';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
	import SubjectCard from '$components/schedule/subject/subjectCard.svelte';
	import { universisGet } from '$lib/dataService';

    // Uncomment the following to reset the task store.
    // subjectStore.set([]);
    
    $: currentSubjects = $subjectStore.filter((subject) => {
        // Get only the tasks that have a slot on the active day.
        if (subject.slots.filter((slot) => {
            if (slot.day.toLowerCase().startsWith($activeDay)) { return slot; }
        }).length > 0) { return subject; } })
    // Flatten the array of tasks and slots into an array of objects with a task and a slot.
    .flatMap((task) => {
        return {
            task: task,
            slots: task.slots.filter((slot) => { if (slot.day.toLowerCase().startsWith($activeDay)) { return slot; } })   
        }; })
    // Flatten the array so that each task has only one slot, for each slot.
    .flatMap((task) => {
        let occurences: Array<{task: SubjectItem, slot: any }> = [];
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
    
    
        
    
    onMount(async() => {
        let classes = (await universisGet('students/me/teachingEvents?$expand=location,performer&$filter=startDate ne null&$top=-1&$orderby=startDate')).value;
        let exams = (await universisGet('students/me/availableCourseExamEvents?$top=-1')).value;

        console.log(classes);
        console.log(exams);

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
    <ion-fab-button href="/schedule/addSubject" color="primary">
        <ion-icon icon={add} />
    </ion-fab-button>
</ion-fab>


<ion-content fullscreen={true}>
    <Days />    

    <ion-grid style="padding: 0%">
        {#each currentSubjects as task}
            <SubjectCard task={task.taskItem} start={task.start} end={task.end}/>
        {/each}
    </ion-grid>
</ion-content>