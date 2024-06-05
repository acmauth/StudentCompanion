<script>
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from 'svelte';
	const isProduction = process.env.NODE_ENV === 'production';
	import { getMenu } from '$lib/menuScrapper/scraper';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import MenuSkeleton from './menuSkeleton.svelte';
    import { getDay } from "$lib/components/schedule/day/days";

	import { t, locale } from '$lib/translations';

    let l = $locale;

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

	const hours = date.getHours();
	const mins = date.getMinutes();
	let message = '';
	let color = 'success';
	if (hours >= 8 && mins >= 30 && hours < 10) {
		message = $t('menu.morning_open');
	} else if (hours >= 10 && hours < 12) {
		message = $t('menu.morning_closed');
		color = 'danger';
	} else if (hours >= 12 && hours < 16) {
		message = $t('menu.midday_open');
	} else if (hours >= 16 && hours < 18) {
		message = $t('menu.midday_closed');
		color = 'danger';
	} else if (hours >= 18 && hours < 21) {
		message = $t('menu.evening_open');
	} else {
		message = $t('menu.evening_closed');
		color = 'danger';
	}

	async function getMenuData() {
		if (!isProduction) {
			const response = await fetch('/menu', { method: 'GET' });
			if (response.ok) {
				// cafeteriaData = await response.json();
				const jsonStr = await response.text(); // Get the JSON string
				cafeteriaData = JSON.parse(jsonStr); // Parse the JSON string into an array
			} else {
				console.error('Error fetching cafeteria data:', response.statusText);
			}
		} else {
			cafeteriaData = await getMenu();
		}
	}
</script>

<IonPage>
	<SubPageHeader title = {$t("menu.title")} />
	<ion-content class="ion-padding">
		{#await getMenuData()}
			<MenuSkeleton />
		{:then}
			<div class="ion-text-center">
				<ion-chip {color}><ion-icon icon={allIonicIcons.timeOutline} /> &nbsp; {message}</ion-chip>
			</div>

			<h1><ion-icon icon={allIonicIcons.restaurantOutline} /> {$t("menu.today")} </h1>
			<ion-card color="light">
				<ion-card-content>
					<div>{@html cafeteriaData[today]}</div>
				</ion-card-content>
			</ion-card>

			&nbsp;

			<h1><ion-icon icon={allIonicIcons.restaurantOutline} /> {$t("menu.week")} </h1>
			<ion-accordion-group expand="inset">
				<ion-accordion value="first">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(1, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[0]}</div>
				</ion-accordion>
				<ion-accordion value="second">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(2, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[1]}</div>
				</ion-accordion>
				<ion-accordion value="third">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(3, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[2]}</div>
				</ion-accordion>
				<ion-accordion value="fourth">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(4, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[3]}</div>
				</ion-accordion>
				<ion-accordion value="fifth">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(5, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[4]}</div>
				</ion-accordion>
				<ion-accordion value="sixth">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(6, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[5]}</div>
				</ion-accordion>
				<ion-accordion value="seventh">
					<ion-item slot="header" color="light">
						<ion-label>{getDay(0, l)}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[6]}</div>
				</ion-accordion>
			</ion-accordion-group>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</ion-content>
</IonPage>
