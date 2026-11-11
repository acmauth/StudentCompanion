<script lang="ts">
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
	
	// Due to the fact that start/end slots of an event object refer to the date of their first instance (e.g. a weekly event),
	// an event must be marked as past iff either it the active date is previous than today or if it's today and the start time
	// of the event is past the current time.
	// include in the condition below:
	// new Date(activeDate).getDate() < new Date().getDate() || new Date(activeDate).getDate() == new Date().getDate() &&
	let isPastDate = $derived(new Date().getTime() >= new Date(eventItem.slot.start).getTime());
	let isTest = $derived(eventItem.type == EventType.TEST);
	let isAssignment = $derived(eventItem.type == EventType.ASSIGNMENT);
	let isTask = $derived(eventItem.type == EventType.TASK);
	let isClass = $derived(eventItem.type == EventType.CLASS);
	let isOther = $derived(eventItem.type == EventType.OTHER);

	function handleClick() {
		selectedEvent = eventItem;
		modalOpen = true;
	}

	function handleHold(e: CustomEvent) {
		selectedEvent = eventItem;
		deleteModalOpen = true;
	}

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
