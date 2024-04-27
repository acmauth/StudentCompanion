<script lang="ts">
	import { EventType} from './Event';
	import type { EventFlat } from './Event';
	import { onMount } from 'svelte';
	
	export let eventItem: EventFlat;
	export let selectedEventId: number;
	
	let isPastDate: boolean = false;
	let isTest: boolean = false;
	let isAssignment: boolean = false;

	function handleClick() {
		selectedEventId = eventItem.id;
	}

	onMount(async() => {
		isPastDate = new Date().getTime() > new Date(eventItem.slot.end).getTime();
		isTest = eventItem.type == EventType.TEST;
		isAssignment = eventItem.type == EventType.ASSIGNMENT;
	});
</script>

<ion-card class="eventCard {isPastDate? 'pastDate' : null}" style="padding: 10px; height:fit-content; width:100%;" on:click={handleClick} aria-hidden>
	<ion-card-header class="{eventItem.type}">
		<ion-label class="header" color="primary">{eventItem.title}</ion-label>
		<ion-label class="subheader">{eventItem.description}</ion-label>
	</ion-card-header>
</ion-card>

<style>
	@import './EventCard.css';
	.pastDate {
        opacity: 0.5;
    }
	.test {
		--background: var(--ion-color-warning);
	}
	.assignment {
		--background: var(--ion-color-secondary);
	}

	.eventCard {
		padding: 0 !important;
		margin-inline: 0;
		box-shadow: none;
	}

	.eventCard * {
		margin-inline: 8px;
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