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
	<ion-card class="eventCard" on:click={handleClick} aria-hidden href="">
		<div class="eventCardContents">

			<div class="eventMainInformation">
				<div class="eventTypeDot" style="margin-inline-end: 0.5rem; padding-top: 0.2rem;">
					<ion-icon icon={ellipse} class="dummy {isPastDate? 'pastDate' : null} {isAssignment? 'assignment' : null} {isClass? 'class' : null} {isTest? 'test' : null} {isTask? 'task' : null}"/>
				</div>
				<div class="eventContent">
					<ion-label class="eventHeader {isPastDate? 'pastDate' : null}">{eventItem.title}</ion-label>
					<ion-label class="eventSubheader {isPastDate? 'pastDate' : null}">{eventItem.description}</ion-label>
				</div>
			</div>
			
			<ion-label class="timeslot {isPastDate? 'pastDate' : null}">
				<div>
					 {new Date(eventItem.slot.start).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: false })}
				</div>
				<div>
					{#if eventItem.slot.end && new Date(eventItem.slot.end).getTime() != new Date(eventItem.slot.start).getTime()}
						{#if new Date(eventItem.slot.end).getDay() - new Date(eventItem.slot.start).getDay() != 0}
							&nbsp-*
						{:else}
							<!-- &nbsp-&nbsp{new Date(eventItem.slot.end).getHours() + ':' + String(new Date(eventItem.slot.end).getMinutes()).padStart(2, '0')} -->
							&nbsp-&nbsp{new Date(eventItem.slot.end).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: false })}
						{/if}
					{/if}
				</div>
			</ion-label>
		</div>
	</ion-card>
</div>


<style>
	.pastDate {
        opacity: 0.4;
    }
	
	.task {color: var(--ion-color-tertiary);}
	.test {color: var(--ion-color-danger);}
	.assignment {color: var(--ion-color-warning);}
	.class {color: var(--ion-color-secondary);}

	/* Card contents */
	.eventCard{
		border-radius: 0.3rem !important;
		margin-inline: 0;
		margin-block: 8px;
		padding-block: 5px;
		padding-inline-start: 20px;
		padding-inline-end: 10px;
		border:none;
		box-shadow:none !important;
	}

	.eventCardContents {
		display:flex;
		flex-direction:row;
		justify-content:space-between;
	}

	.eventMainInformation {
		width: 80%;
		display:flex;
		flex-direction:row;
		justify-content:start;
	}

	.eventContent {
		display:flex;
		flex-direction:column;
		justify-content: space-between;
		width:100%;
	}

	.timeslot {
		font-size:x-small; 
		padding-block:5px;
		margin-inline-end:10px;
		display: flex;
		flex-direction:row;
		text-wrap:nowrap;
	}

	.eventHeader {
		font-size: medium;
		max-width: fit-content;
	}

	.eventSubheader {
		font-size: x-small;
		color: #8f8c8c;
	}

</style>