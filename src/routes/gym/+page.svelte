<script lang="ts">
	import MenuSkeleton from '$lib/components/menu/menuSkeleton.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	const isProduction = process.env.NODE_ENV === 'production';
	import { getReservForm } from '$lib/gymScraper/scraper';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import AppCard from '$shared/AppCard.svelte';

	let gymData: string | any[] = [];
	async function getGymData() {
		if (!isProduction) {
			const response = await fetch('/gym', { method: 'GET' });
			if (response.ok) {
				const jsonStr = await response.text(); // Get the JSON string
				gymData = JSON.parse(jsonStr); // Parse the JSON string into an array
			} else {
				console.error('Error fetching gym data:', response.statusText);
			}
		} else {
			gymData = (await getReservForm()) as string | 'Error while scraping data';
		}
	}
</script>

<SubPageHeader title="Γυμναστήριο" />
<ion-content style="overflow-y: auto" class="ion-padding">
	{#await getGymData()}
		<MenuSkeleton />
	{:then}
		<ion-accordion-group expand="inset">
			<ion-accordion value="first">
				<ion-item slot="header" color="light">
					<ion-label>Κανονισμοί κρατήσεων γηπέδων</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">
					{@html gymData[0]}
					<div style="margin-left:1rem; margin-top:1rem">
						{@html gymData[1]}
					</div>
				</div>
			</ion-accordion>
			<ion-accordion value="second">
				<ion-item slot="header" color="light">
					<ion-label class="overflowingtext">Κανονισμοί κρατήσεων κλειστών χώρων</ion-label>
				</ion-item>
				<div class="ion-padding" slot="content">
					{@html gymData[2]}
					<div style="margin-left:1rem; margin-top:1rem">
						{@html gymData[3]}
					</div>
				</div>
			</ion-accordion>
		</ion-accordion-group>
		<h2 style="margin:1.5rem">Κάνε κράτηση</h2>
		<div class="facilities">
			<AppCard>
				<ion-card-header>
					<ion-card-title>Γήπεδο Πετοσφαίρισης</ion-card-title>
					<ion-card-subtitle>Κλειστό γήπεδο ΠΓ</ion-card-subtitle>
				</ion-card-header>
			</AppCard>
			<AppCard>
				<ion-card-header>
					<ion-card-title>Γήπεδα Ποδοσφαίρου</ion-card-title>
					<ion-card-subtitle>11 X 11</ion-card-subtitle>
				</ion-card-header>
			</AppCard>
			<AppCard>
				<ion-card-header>
					<ion-card-title>Αίθουσα Fitness Center</ion-card-title>
				</ion-card-header>
			</AppCard>
		</div>
	{/await}
</ion-content>

<style>
	.overflowingtext {
		overflow: inherit;
		text-overflow: ellipsis;
		white-space: normal;
	}
	/* .facilities {
		margin: 1rem;
		width: fit-content;
	} */
</style>
