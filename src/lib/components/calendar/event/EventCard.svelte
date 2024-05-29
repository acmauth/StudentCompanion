<script lang="ts">
	import { EventType} from './Event';
	import type { Event } from './Event';
	import { longpress } from './EventCard';
	
	export let eventItem: Event;
	export let selectedEvent: Event | null;
	export let modalOpen: boolean;
	export let deleteModalOpen: boolean;
	
	let isPastDate: boolean = false;
	let isTest: boolean = false;
	let isAssignment: boolean = false;
	let isTask: boolean = false;
	let isClass: boolean = false;

	function handleClick() {
		selectedEvent = eventItem;
		modalOpen = true;
	}

	function handleHold(e: CustomEvent) {
		selectedEvent = eventItem;
		deleteModalOpen = true;
	}

	$: {
		isPastDate = !eventItem.slot.end && new Date().getTime() > new Date(eventItem.slot.start).getTime() || eventItem.slot.end && new Date().getTime() > new Date(eventItem.slot.end).getTime();
		isTest = eventItem.type == EventType.TEST;
		isAssignment = eventItem.type == EventType.ASSIGNMENT;
		isTask = eventItem.type == EventType.TASK;
		isClass = eventItem.type == EventType.CLASS;
	};

</script>


<div style="display:flex; flex-direction:row;" use:longpress on:longpress={handleHold}>
	<div style="display:flex; flex-direction:column; justify-content:space-between; padding-top:0.25rem; margin-inline-start: 0.5rem; padding-block:0.5rem">
		<ion-label class="timeslot {isPastDate? 'pastDate' : null}">{new Date(eventItem.slot.start).getHours() + ':' + String(new Date(eventItem.slot.start).getMinutes()).padStart(2, '0')}</ion-label>
		{#if eventItem.slot.end && new Date(eventItem.slot.end).getTime() != new Date(eventItem.slot.start).getTime()}
			{#if new Date(eventItem.slot.end).getDay() - new Date(eventItem.slot.start).getDay() != 0}
				<ion-label class="timeslot {isPastDate? 'pastDate' : null}">*</ion-label>
			{:else}
				<ion-label class="timeslot {isPastDate? 'pastDate' : null}">{new Date(eventItem.slot.end).getHours() + ':' + String(new Date(eventItem.slot.end).getMinutes()).padStart(2, '0')}</ion-label>
			{/if}
		{/if}
	</div>
	<div style="width:84%;">
		<ion-card class="eventCard {isPastDate? 'pastDate' : null} {isAssignment? 'assignment' : null} {isClass? 'class' : null} {isTest? 'test' : null} {isTask? 'task' : null}	" style="height:fit-content; width:100%;" on:click={handleClick} aria-hidden>
			<ion-card-header class="{eventItem.type}">
				<ion-label class="header" color="{eventItem.type != EventType.OTHER ? 'light' : 'dark'}">{eventItem.title}</ion-label>
				<ion-label class="subheader" color="dark">{eventItem.description}</ion-label>
			</ion-card-header>
		</ion-card>
	</div>
</div>


<style>
	@import './EventCard.css';
	.pastDate {
        opacity: 0.7;
    }
	.task {
		--background: var(--ion-color-tertiary);
	}
	.test {
		--background: var(--ion-color-danger);
	}
	.assignment {
		--background: var(--ion-color-warning);
	}
	.class {
		--background: var(--ion-color-secondary);
	}

	.timeslot {
		font-size:small; 
		padding-inline-end:0.5rem; 
	}

	.eventCard {
		padding: 0 !important;
		margin-inline: 0;
		margin-block: 5px;
		box-shadow: none;
	}

	.eventCard * {
		margin-inline: 5px;
		margin-top: 0;
	}

	.eventCard * .header {
		padding-top: 5px;
		font-size: medium;
	}

	.eventCard * .subheader {
		padding-bottom: 5px;
		font-size: small;
	}
</style>