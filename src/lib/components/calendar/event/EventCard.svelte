<script lang="ts">
	import { EventType} from './Event';
	import type { Event } from './Event';
	import { longpress } from './EventCard';
	import { ellipse } from 'ionicons/icons';
	
	export let eventItem: Event;
	export let selectedEvent: Event | null;
	export let modalOpen: boolean;
	export let deleteModalOpen: boolean;
	export let activeDate: Date;
	
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
		isPastDate = false;
		// Due to the fact that start/end slots of an event object refer to the date of their first instance (e.g. a weekly event), 
		// an event must be marked as past iff either it the active date is previous than today or if it's today and the start time 
		// of the event is past the current time.
		if (new Date(activeDate).getDate() < new Date().getDate()
			|| new Date(activeDate).getDate() == new Date().getDate() && new Date().getTime() >=  new Date(new Date(eventItem.slot.start).setDate(new Date().getDate())).getTime()) {
			isPastDate = true;
		}
		isTest = eventItem.type == EventType.TEST;
		isAssignment = eventItem.type == EventType.ASSIGNMENT;
		isTask = eventItem.type == EventType.TASK;
		isClass = eventItem.type == EventType.CLASS;
	};

</script>


<div use:longpress on:longpress={handleHold} on:click={handleClick} aria-hidden>
	<ion-card class="eventCard" aria-hidden href="">
		<div class="eventCardContents">

			<div class="eventMainInformation">
				<div class="eventTypeDot">
					<ion-icon icon={ellipse} class="dummy {isPastDate? 'pastDate' : null} {isAssignment? 'assignment' : null} {isClass? 'class' : null} {isTest? 'test' : null} {isTask? 'task' : null}"/>
				</div>
				<div class="eventContent">
					<ion-label class="eventHeader {isPastDate? 'pastDate' : null}">{eventItem.title}</ion-label>
					{#if eventItem.description}
						<ion-label class="eventSubheader {isPastDate? 'pastDate' : null}">{eventItem.description}</ion-label>
					{/if}
				</div>
			</div>
			
			<ion-label class="timeslot {isPastDate? 'pastDate' : null}">
				<div>
					 {new Date(eventItem.slot.start).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: false })}
				</div>
				<div>
					{#if eventItem.slot.end && new Date(eventItem.slot.end).getTime() != new Date(eventItem.slot.start).getTime()}
						{#if new Date(eventItem.slot.end).getDay() - new Date(eventItem.slot.start).getDay() != 0}
							&nbsp;-*
						{:else}
							&nbsp;-&nbsp;{new Date(eventItem.slot.end).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: false })}
						{/if}
					{/if}
				</div>
			</ion-label>
		</div>
	</ion-card>
</div>


<style>
	.pastDate {
        opacity: 0.5;
    }
	
	.task {color: var(--ion-color-tertiary);}
	.test {color: var(--ion-color-danger);}
	.assignment {color: var(--ion-color-warning);}
	.class {color: var(--ion-color-secondary);}

	/* Card contents */
	.eventCard{
		border-radius: 12px !important;
		margin: 0;
		padding: 0.75rem 1rem;
		border: none;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
		background: var(--ion-color-step-50, #ffffff);
		transition: all 0.2s ease;
	}

	.eventCard:hover {
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12) !important;
		transform: translateY(-1px);
	}

	.eventCardContents {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
	}

	.eventMainInformation {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}

	.eventTypeDot {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.eventTypeDot ion-icon {
		font-size: 0.65rem;
	}

	.eventContent {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
		flex: 1;
	}

	.timeslot {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ion-color-medium);
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		flex-shrink: 0;
		letter-spacing: 0.01em;
	}

	.eventHeader {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--ion-color-dark);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.eventSubheader {
		font-size: 0.8rem;
		color: var(--ion-color-medium);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

</style>
