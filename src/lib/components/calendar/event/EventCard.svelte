<script lang="ts">
	import { run } from 'svelte/legacy';

	import { EventType} from './Event';
	import type { Event } from './Event';
	import { longpress } from './EventCard';
	import { ellipse } from 'ionicons/icons';
	
	interface Props {
		eventItem: Event;
		selectedEvent: Event | null;
		modalOpen: boolean;
		deleteModalOpen: boolean;
		activeDate: Date;
	}

	let {
		eventItem,
		selectedEvent = $bindable(),
		modalOpen = $bindable(),
		deleteModalOpen = $bindable(),
		activeDate = $bindable()
	}: Props = $props();
	
	let isPastDate: boolean = $state(false);
	let isTest: boolean = $state(false);
	let isAssignment: boolean = $state(false);
	let isTask: boolean = $state(false);
	let isClass: boolean = $state(false);
	let isOther: boolean = $state(false);

	function handleClick() {
		selectedEvent = eventItem;
		modalOpen = true;
	}

	function handleHold(e: CustomEvent) {
		selectedEvent = eventItem;
		deleteModalOpen = true;
	}

	run(() => {
		isPastDate = false;
		// Due to the fact that start/end slots of an event object refer to the date of their first instance (e.g. a weekly event), 
		// an event must be marked as past iff either it the active date is previous than today or if it's today and the start time 
		// of the event is past the current time.
		if (new Date().getTime() >=  new Date(new Date(eventItem.slot.start)).getTime()) {
			// include in the above condition:
			// new Date(activeDate).getDate() < new Date().getDate() || new Date(activeDate).getDate() == new Date().getDate() &&
			isPastDate = true;
		}
		isTest = eventItem.type == EventType.TEST;
		isAssignment = eventItem.type == EventType.ASSIGNMENT;
		isTask = eventItem.type == EventType.TASK;
		isClass = eventItem.type == EventType.CLASS;
		isOther = eventItem.type == EventType.OTHER;
	});;

</script>


<div use:longpress onlongpress={handleHold} onclick={handleClick} aria-hidden>
	<ion-card class="eventCard" aria-hidden href="">
		<div class="eventCardContents">

			<div class="eventMainInformation">
				<div class="eventTypeDot">
					<ion-icon icon={ellipse} class="dummy {isPastDate? 'pastDate' : null} {isAssignment? 'assignment' : null} {isClass? 'class' : null} {isTest? 'test' : null} {isTask? 'task' : null} {isOther? 'other' : null}"></ion-icon>
				</div>
				<div class="eventContent">
					<ion-label class="eventHeader {isPastDate? 'pastDate' : null}">{eventItem.title}</ion-label>
					{#if eventItem.location}
						<ion-label class="eventSubheader {isPastDate? 'pastDate' : null}">{eventItem.location}</ion-label>
					{:else if eventItem.description}
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
						&nbsp;-&nbsp;{new Date(eventItem.slot.end).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: false })}
						{#if new Date(eventItem.slot.end).getDay() - new Date(eventItem.slot.start).getDay() != 0}
							*
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
	
	.task {color: #1e88e5;}
	.test {color: #e53835;}
	.assignment {color: #fb8a00;}
	.class {color: #43a048;}
	.other {color: #bcbaba;}

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
