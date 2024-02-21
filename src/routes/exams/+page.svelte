<script lang="ts">
    import {bookOutline, createOutline, schoolOutline} from 'ionicons/icons';
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
                id: exam.courseExam.course,
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
    });
</script>

    <ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
        <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
        <ion-title>Πρόγραμμα Εξετάσεων</ion-title>
        </ion-toolbar>
    </ion-header>

<ion-fab horizontal="start" vertical="bottom">
    <ion-fab-button href="/tasks" color="secondary">
        <ion-icon icon={createOutline} />
    </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
    <ion-fab-button href="/schedule" color="primary">
        <ion-icon icon={bookOutline} />
    </ion-fab-button>
</ion-fab>

<ion-tab tab="schedule"></ion-tab>

<ion-content >
    <ion-grid style="padding: 0%">
        {#each exams as examItem}
            <ExamCard {examItem} />
        {/each}
    </ion-grid>
    <ion-row class="custom-center-label">
        {#if exams.length === 0}
            <ion-icon icon={schoolOutline} size="large" style="padding: 15px"></ion-icon>
            <ion-label>Δεν υπάρχουν προγραμματισμένες εξετάσεις.</ion-label>
        {/if}
    </ion-row>
</ion-content>

<style>
    .custom-center-label {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
    }
</style>