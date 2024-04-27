<script lang="ts">
	import {documentText, star} from 'ionicons/icons';
	import { EventType} from '$lib/components/calendar/event/Event';
	import type { EventFlat } from '$lib/components/calendar/event/Event';
	import {timeOutline, map} from 'ionicons/icons';
	import { onMount } from 'svelte';
	import { getDayByIndex } from '$components/schedule/day/days';
	import { EventRepeatType } from '$components/calendar/event/Event';
	
	let eventItem: EventFlat = {
    title: "Προγραμματισμός Υπολογιστών",
    slot: {
        start: "2022-06-06T08:00:00Z",
        end: "2022-06-06T10:00:00Z"
      },
    location: "Αίθουσα 1",
    description: "Περιγραφή",
    professor: "Κύριος Καθηγητής",
    type: EventType.EXAM,
    repeat: EventRepeatType.NONE,
    repeatInterval: 0,
    repeatUntil: null,
    notify: false,
    notifyTime: 0
  };
	
	let start: string = getDayByIndex(new Date(eventItem.slot.start).getDay(), 'el', true); 
	let end: string = getDayByIndex(new Date(eventItem.slot.end).getDay(), 'el', true);
	let isPastDate: boolean = false;
	// let isTest: boolean = false;
	// let isProject: boolean = false;

	onMount(async() => {
		isPastDate = new Date().getTime() > new Date(eventItem.slot.end).getTime();
		// isTest = eventItem.type == eventItem.TEST;
		// isProject = eventItem.type == eventItem.PROJECT;
	});
</script>

<style>
	/* @import './EventCard.css'; */
	.pastDate {
        opacity: 0.5;
    }
	/* .test {
		--background: var(--ion-color-warning);
	}
	.project {
		--background: var(--ion-color-secondary);
	} */
</style>
<!-- &nbsp; -->

<ion-card>
  <ion-card-header class="{eventItem.type + "_card"}">
    <ion-card-title color="primary">{eventItem.title}</ion-card-title>
    <ion-card-subtitle>{eventItem.description}</ion-card-subtitle>
  </ion-card-header>
</ion-card>
