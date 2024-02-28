<script lang="ts">
    import type { ClassItemFlat } from '$lib/components/schedule/class/ClassItem';
    import {add, bookOutline, createOutline, schoolOutline} from 'ionicons/icons';
    import { Capacitor } from '@capacitor/core';
    import ClassCard from '$components/schedule/class/classCard.svelte';
    import { universisGet } from '$lib/dataService';
    import { getDayByIndex, getDayIndex, weekdays } from "$lib/components/schedule/day/days";
    import { classStore } from '$components/schedule/class/classStore';

    // Clear class store
    // $classStore = [];

	let activeDay: string;
    $: activeDay = getDayByIndex(new Date().getDay()).toLowerCase();

    let currentClasses: ClassItemFlat[];
    $: currentClasses = $classStore.flatMap(item =>
        item.slots.map(slot => ({
            id: item.id,
            title: item.title,
            professor: item.professor,
            classroom: item.classroom,
            day: slot.day,
            startTime: new Date(slot.startTime).toTimeString().substring(0, 5),
            endTime: new Date(slot.endTime).toTimeString().substring(0, 5)
        }))).filter(slot => slot.day === (weekdays.findIndex((day) => Object.keys(day)[0] === activeDay))).sort((a, b) => a.startTime.localeCompare(b.startTime));

    // classes = (await universisGet('students/me/teachingEvents?$expand=location,performer&$filter=startDate ne null&$top=-1&$orderby=startDate')).value;

</script>

<ion-header collapse="condense" mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title class="ion-padding-vertical" size="large">Πρόγραμμα μαθημάτων</ion-title>
      <ion-buttons slot="end">
        <ion-button href="/pages/classes/addClass">
          <ion-icon slot="icon-only" icon={add}></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
</ion-header>

<ion-fab horizontal="start" vertical="bottom">
    <ion-fab-button href="/pages/tasks" color="secondary">
        <ion-icon icon={createOutline} />
    </ion-fab-button>
</ion-fab>

<ion-fab horizontal="end" vertical="bottom">
    <ion-fab-button href="/pages/exams" color="primary">
        <ion-icon icon={schoolOutline} />
    </ion-fab-button>
</ion-fab>

<ion-tab tab="schedule"></ion-tab>

<ion-content fullscreen={true}>
    <div>
        <ion-segment id="day-list" value={activeDay} scrollable on:ionChange={() => {activeDay = (document.getElementById("day-list")).value}} mode='md'>
            {#each weekdays as day}
                {#each Object.keys(day) as key }
                    <ion-segment-button value={key}>
                        <ion-label>{getDayByIndex(getDayIndex(key.charAt(0).toUpperCase() + key.slice(1)), 'el', true)}</ion-label>
                    </ion-segment-button>
                {/each}
            {/each}
    </div>

    <ion-grid style="padding: 0%">
        {#each currentClasses as courseClass}
            <ClassCard classItem={courseClass} />
        {/each}
    </ion-grid>

    <ion-row class="custom-center-label">
        {#if currentClasses.length === 0}
            <ion-icon icon={bookOutline} size="large" style="padding: 15px"></ion-icon>
            <ion-label>Δεν υπάρχουν προγραμματισμένα μαθήματα αυτή τη μέρα.</ion-label>
        {/if}
    </ion-row>
</ion-content>

<style>
    ion-segment-button {
        --color-checked: var(--ion-color-primary);
    }

    ion-segment-button::part(indicator-background) {
        background: var(--ion-color-primary);
    }

    ion-segment {
        margin-top: 5px;
        --background: #fff;
    }

    .custom-center-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
    }
</style>

