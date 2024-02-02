<script lang="ts">
    import {createOutline, schoolOutline} from 'ionicons/icons';
    import type { ExamItem } from '$components/schedule/exam/ExamItem';
    import ExamCard from '$components/schedule/exam/examCard.svelte';
    import { getDayByIndex } from '$components/schedule/day/days';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';

    let exams : Array<ExamItem> = [];
    onMount(async() => {
        let fetchedExams = (await universisGet('students/me/availableCourseExamEvents?$top=-1')).value;
        exams = fetchedExams.map((exam: any) => {
            return {
                subject: exam.name,
                classroom: exam.location.name,
                date: {
                    weekDay: getDayByIndex((new Date(exam.startDate)).getDay(), 'el', true),
                    monthDate: (new Date(exam.startDate)).getDate() + '/' + ((new Date(exam.startDate)).getMonth() + 1),
                    startTime: (new Date(exam.startDate)).getHours() + ':' + (new Date(exam.startDate)).getMinutes(),
                    endTime: (new Date(exam.endDate)).getHours() + ':' + (new Date(exam.endDate)).getMinutes()
                }
            }   
        });
        console.log(exams);
    });



</script>

<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title>Πρόγραμμα Εξετάσεων</ion-title>
    </ion-toolbar>
</ion-header>

<ion-fab horizontal="start" vertical="bottom">
    <ion-fab-button href="/schedule/tasks" color="secondary">
        <ion-icon icon={createOutline} />
    </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
    <ion-fab-button href="/schedule/classes" color="primary">
        <ion-icon icon={schoolOutline} />
    </ion-fab-button>
</ion-fab>


<ion-content >
    <ion-grid style="padding: 0%">
        {#each exams as examItem}
            <ExamCard {examItem} />
        {/each}
    </ion-grid>
</ion-content>