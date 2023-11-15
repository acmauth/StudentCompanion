<script>
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import { onMount } from 'svelte';

	/**
	 * @type {any[]}
	 */
	let cafeteriaData = [];

	const date = new Date();
	let today = date.getDay();
	if (today) {
		today -= 1;
	} else {
		today = 6;
	}

	onMount(async () => {
		const response = await fetch('/menu', { method: 'GET' });

		if (response.ok) {
			// cafeteriaData = await response.json();
			const jsonStr = await response.text(); // Get the JSON string
			cafeteriaData = JSON.parse(jsonStr); // Parse the JSON string into an array
		} else {
			console.error('Error fetching cafeteria data:', response.statusText);
		}
		console.log(cafeteriaData);
		console.log(today);
	});
</script>

<IonPage>
	<ion-header>
		<ion-toolbar>
			<ion-title>Μενού Λέσχης</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<h1>Σημερινό Μενού</h1>
		<ion-card color="light">
			<ion-card-content>
				<div>{@html cafeteriaData[today]}</div>
			</ion-card-content>
		</ion-card>

		&nbsp;

		<h1>Το Μενού της Εβδομάδας</h1>
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
	</ion-content>
</IonPage>
