<script lang="ts">
	import { EventType} from './Event';
	import type { Event } from './Event';
	import { longpress } from './EventCard';
	import { ellipse } from 'ionicons/icons';
	
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


<div use:longpress on:longpress={handleHold}>
	<ion-card on:click={handleClick} aria-hidden href="" style="border-radius: 0.3rem !important; margin-inline: 0; margin-block: 8px; padding-block: 5px; padding-inline-start: 20px; padding-inline-end: 10px; border:none; box-shadow:none !important;">
		<div style="display:flex; flex-direction:row; justify-content:space-between">

			<div style="width: 80%; display:flex; flex-direction:row; justify-content:start;">
				
				<div style="margin-inline-end: 0.5rem; padding-top: 0.15rem;">
					<ion-icon icon={ellipse} class="dummy {isPastDate? 'pastDate' : null} {isAssignment? 'assignment' : null} {isClass? 'class' : null} {isTest? 'test' : null} {isTask? 'task' : null}"></ion-icon>
				</div>
				
				<div style="display:flex; flex-direction:column; justify-content: space-between; width:100%;">
					<ion-label class="header {isPastDate? 'pastDate' : null}">{eventItem.title}</ion-label>
					<ion-label class="subheader {isPastDate? 'pastDate' : null}">{eventItem.description}</ion-label>
				</div>
			</div>		
			
			<div style="display:flex; flex-direction:row; justify-content:end; align-items:start; padding-block:5px; margin-inline-end:10px;">
				<ion-label class="timeslot {isPastDate? 'pastDate' : null}">
				<div style="display: flex; flex-direction:row;">
					<div>
						{new Date(eventItem.slot.start).getHours() + ':' + String(new Date(eventItem.slot.start).getMinutes()).padStart(2, '0')}
					</div>
					<div>
						{#if eventItem.slot.end && new Date(eventItem.slot.end).getTime() != new Date(eventItem.slot.start).getTime()}
							{#if new Date(eventItem.slot.end).getDay() - new Date(eventItem.slot.start).getDay() != 0}
							&nbsp-*
							{:else}
							&nbsp-&nbsp{new Date(eventItem.slot.end).getHours() + ':' + String(new Date(eventItem.slot.end).getMinutes()).padStart(2, '0')}
							{/if}
						{/if}
					</div>
				</div>
			</div>

		</div>
	</ion-card>
</div>


<style>
	@import './EventCard.css';
	.pastDate {
        opacity: 0.4;


    }
	.task {
		color: var(--ion-color-tertiary);
	}
	.test {
		color: var(--ion-color-danger);
	}
	.assignment {
		color: var(--ion-color-warning);
	}
	.class {
		color: var(--ion-color-secondary);
	}

	.timeslot {
		font-size:x-small; 
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