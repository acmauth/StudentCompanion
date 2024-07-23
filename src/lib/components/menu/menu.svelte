<script lang="ts">
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	const isProduction = process.env.NODE_ENV === 'production';
	import { getMenu } from '$lib/menuScrapper/scraper';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import MenuSkeleton from './menuSkeleton.svelte';
	import Banner from '$components/shared/Banner.svelte';

	let cafeteriaData: string | any[] = [];
	let todaydata: string;
	let title: string = "Σημερινό μενού";

	const date = new Date();
	let today = date.getDay();
	if (today) {
		today -= 1;
	} else {
		today = 6;
	}

	const hours = date.getHours();
	const mins = date.getMinutes();
	let message = '';
	let now = '';
	let next = '';
	let color = 'success';

	if ((hours == 8 && mins >= 30) || (hours > 8 && hours < 10)) {
		message = 'Λέσχη ανοιχτή για Πρωινό - Κλείνει στις 10:00';
		now = "Πρωινό";
		next = "Μεσημεριανό";
	} else if (hours >= 10 && hours < 12) {
		message = 'Λέσχη κλειστή - Ανοίγει στις 12:00';
		color = 'danger';
		now = "Μεσημεριανό";
		next = "Βραδινό";
	} else if (hours >= 12 && hours < 16) {
		message = 'Λέσχη ανοιχτή για Μεσημεριανό - Κλείνει στις 16:00';
		now = "Μεσημεριανό";
		next = "Βραδινό";
	} else if (hours >= 16 && hours < 18) {
		message = 'Λέσχη κλειστή - Ανοίγει στις 18:00';
		color = 'danger';
		now = "Βραδινό";
		next = "";
	} else if (hours >= 18 && hours < 21) {
		message = 'Λέσχη ανοιχτή για Βραδινό - Κλείνει στις 21:00';
		now = "Βραδινό";
		next = "";
	} else {
		message = 'Λέσχη κλειστή - Ανοίγει στις 08:30';
		color = 'danger';
		now = "Πρωινό";
		next = "Μεσημεριανό";

		if (hours >= 21 && hours <= 23 && mins <= 59) 
			title = "Αυριανό μενού";
		else
			title = "Σημερινό μενού";

		today = (today + 1) % 7;
		if (today) {
			today -= 1;
		} else {
			today = 6;
		}
	}

	async function getMenuData() {
		if (!isProduction) {
			const response = await fetch('/menu', { method: 'GET' });
			if (response.ok) {
				const jsonStr = await response.text(); // Get the JSON string
				cafeteriaData = JSON.parse(jsonStr); // Parse the JSON string into an array
			} else {
				console.error('Error fetching cafeteria data:', response.statusText);
			}
		} else {
			cafeteriaData = (await getMenu()) as string[] | 'Error while scraping data';
		}
		
		const startString = "<h2 class=\"wp-block-heading\"><strong>" + now + "&nbsp;";
		let regex;
		
		if (next === "") { 
			regex = new RegExp(`(${startString})([^]*?)$`, "si");
		} else {
			const endString = "<h2 class=\"wp-block-heading\"><strong>" + next + "&nbsp;";
			regex = new RegExp(`(${startString})(.*?)(?=${endString})`, "si");
		}
		
		const match = cafeteriaData[today].match(regex);

		if (match && match[0])
			todaydata = match[0].trim();
	}
</script>

<IonPage>
	<SubPageHeader title="Μενού Λέσχης" stackedNav />
	<ion-content class="ion-padding">
		{#await getMenuData()}
			<MenuSkeleton />
		{:then}
			<div class="ion-text-center">
				<ion-chip class="ion-padding" {color}
					><ion-icon icon={allIonicIcons.timeOutline} /> &nbsp; {message}</ion-chip
				>
			</div>


			<h1 class="ion-padding">
				<ion-icon icon={allIonicIcons.restaurantOutline} /> {title}
			</h1>
			<ion-card color="light">
				<ion-card-content>
					<div>{@html todaydata}</div>
				</ion-card-content>
			</ion-card>

			&nbsp;

			<h1 class="ion-padding">
				<ion-icon icon={allIonicIcons.restaurantOutline} /> Το Μενού της Εβδομάδας
			</h1>
			<ion-accordion-group expand="inset">
				<ion-accordion value="first">
					<ion-item slot="header" color="light">
						<ion-label>Δευτέρα</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[0]}</div>
				</ion-accordion>
				<ion-accordion value="second">
					<ion-item slot="header" color="light">
						<ion-label>Τρίτη</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[1]}</div>
				</ion-accordion>
				<ion-accordion value="third">
					<ion-item slot="header" color="light">
						<ion-label>Τετάρτη</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[2]}</div>
				</ion-accordion>
				<ion-accordion value="fourth">
					<ion-item slot="header" color="light">
						<ion-label>Πέμπτη</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[3]}</div>
				</ion-accordion>
				<ion-accordion value="fifth">
					<ion-item slot="header" color="light">
						<ion-label>Παρασκευή</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[4]}</div>
				</ion-accordion>
				<ion-accordion value="sixth">
					<ion-item slot="header" color="light">
						<ion-label>Σάββατο</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[5]}</div>
				</ion-accordion>
				<ion-accordion value="seventh">
					<ion-item slot="header" color="light">
						<ion-label>Κυριακή</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[6]}</div>
				</ion-accordion>
			</ion-accordion-group>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</ion-content>
</IonPage>
