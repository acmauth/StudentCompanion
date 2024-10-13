<script lang="ts">
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	const isProduction = process.env.NODE_ENV === 'production';
	import { getMenu } from '$lib/menuScraper/scraper';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import MenuSkeleton from './menuSkeleton.svelte';
	import { t, locale, locales, getLocale } from '$lib/i18n';

	let cafeteriaData: string | any[] = [];
	let todaydata: string;
	let title: string = $t('menu.todaysMenu');

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
	let menuDate = '';

	if ((hours == 8 && mins >= 30) || (hours > 8 && hours < 10)) {
		message = $t('menu.morning_open');
		now = $t('menu.breakfast');
		next = $t('menu.lunch');
	} else if (hours >= 10 && hours < 12) {
		message = $t('menu.morning_closed');
		color = 'danger';
		now = $t('menu.lunch');
		next = $t('menu.dinner');
	} else if (hours >= 12 && hours < 16) {
		message = $t('menu.midday_open');
		now = $t('menu.lunch');
		next = $t('menu.dinner');
	} else if (hours >= 16 && hours < 18) {
		message = $t('menu.midday_closed');
		color = 'danger';
		now = $t('menu.dinner');
		next = '';
	} else if (hours >= 18 && hours < 21) {
		message = $t('menu.evening_open');
		now = $t('menu.dinner');
		next = '';
	} else {
		message = $t('menu.evening_closed');
		color = 'danger';
		now = $t('menu.breakfast');
		next = $t('menu.lunch');

		if (hours >= 21 && hours <= 23 && mins <= 59) title = $t('menu.tomorrowsMenu');
		else title = $t('menu.todaysMenu');

		today = (today + 1) % 7;
		if (today) {
			today -= 1;
		} else {
			today = 6;
		}
	}

	async function getMenuData() {
		cafeteriaData = (await getMenu()) as string[] | 'Error while scraping data';

		const todayHTML = cafeteriaData[today];

		// Regex for finding today's date
		// Checks for both <h3> and <h4> headings and <p> tags
		let dateRegex;
		let regex;
		let startString = now + '&nbsp;';
		if (getLocale() == 'en') {
			dateRegex = /Date of Menu\s*<\/em>\s*&nbsp;:\s*(\d{2}\/\d{2}\/\d{4})/s;
		} else {
			dateRegex =
				/<(h[34]) class="wp-block-heading"><em>Πρόγραμμα Συσσιτίου<\/em>&nbsp;:\s*(\d{2}\/\d{2}\/\d{4})\s*<\/\1>|<p><strong><em>Πρόγραμμα Συσσιτίου<\/em>&nbsp;:\s*(\d{2}\/\d{2}\/\d{4})<\/strong><\/p>/;
		}

		if (next === '') {
			regex = new RegExp(`(${startString})([^]*?)$`, 'si');
		} else {
			const endString = next + '&nbsp;';
			regex = new RegExp(`(${startString})(.*?)(?=${endString})`, 'si');
		}
		const match = cafeteriaData[today].match(regex);
		if (match && match[0]) todaydata = match[0].trim();
		// console.log(todayHTML); // Check exact HTML content
		console.log(dateRegex.exec(todayHTML)); // Test if regex finds a match

		// Extract the date from today's menu
		let matchDate = todayHTML.match(dateRegex);
		console.log(matchDate ? matchDate[1] : 'No match found');

		if (matchDate) {
			const dateRegexCapture = /(\d{2}\/\d{2}\/\d{4})/;
			const dateMatch = matchDate[0].match(dateRegexCapture);

			if (dateMatch) {
				menuDate = dateMatch[1];
			}
			console.log(menuDate);
		}

		// Validate menuDate format (should be DD/MM/YYYY)
		const dateValidationRegex = /^\d{2}\/\d{2}\/\d{4}$/;
		if (!dateValidationRegex.test(menuDate)) {
			menuDate = new Date().toLocaleDateString('en-GB'); // Set to current date if invalid
		}
		// Check if the cafeteria is closed for vacation
		else if (menuDate !== new Date().toLocaleDateString('en-GB')) {
			message = $t('menu.closedForHolidays');
			color = 'danger';
		}
		console.log(new Date().toLocaleDateString('en-GB'));
	}
</script>

<IonPage>
	<SubPageHeader title={$t('menu.title')} stackedNav />
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
				<ion-icon icon={allIonicIcons.restaurantOutline} />
				{title}
			</h1>
			<ion-card color="light">
				<ion-card-content>
					<div>{@html todaydata}</div>
				</ion-card-content>
			</ion-card>

			&nbsp;

			<h1 class="ion-padding">
				<ion-icon icon={allIonicIcons.restaurantOutline} />
				{$t('menu.week')}
			</h1>
			<ion-accordion-group expand="inset">
				<ion-accordion value="first">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.monday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[0]}</div>
				</ion-accordion>
				<ion-accordion value="second">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.tuesday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[1]}</div>
				</ion-accordion>
				<ion-accordion value="third">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.wednesday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[2]}</div>
				</ion-accordion>
				<ion-accordion value="fourth">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.thursday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[3]}</div>
				</ion-accordion>
				<ion-accordion value="fifth">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.friday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[4]}</div>
				</ion-accordion>
				<ion-accordion value="sixth">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.saturday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[5]}</div>
				</ion-accordion>
				<ion-accordion value="seventh">
					<ion-item slot="header" color="light">
						<ion-label>{$t('menu.sunday')}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">{@html cafeteriaData[6]}</div>
				</ion-accordion>
			</ion-accordion-group>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</ion-content>
</IonPage>
