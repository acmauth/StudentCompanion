<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { averages } from '$lib/functions/gradeAverages/averages';
	import { neoUniversisGet } from '$lib/dataService';
	import man from '$lib/assets/man.png';
	import { settingsOutline, calendarOutline, shield, linkOutline, notificationsCircle, cloudOfflineOutline, barbellOutline, addOutline } from 'ionicons/icons';
	import woman from '$lib/assets/woman.png';
	import { register } from 'swiper/element/bundle';
	import { navController } from '$components/shared/StackedNav';
	import PersonalInfo from '$src/routes/personalInfo/personalInfo.svelte';
	import RecentItems from '$components/recentResults/recents.svelte';
	import HomepageSkeleton from '$lib/components/homepage/homepageSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { getVocativeCase } from '$lib/globalFunctions/getVocativeCase';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { getLocale, t } from '$lib/i18n';
	import WalletCard from '$lib/components/wallet/WalletCard.svelte';
	import { EventStore } from '$lib/components/calendar/event/EventStore';
	import type { Event } from '$lib/components/calendar/event/Event';
	import { buildCalendarWeeks, type DayObject } from '$lib/components/calendar/calendarUtils';
	import { calendarNavigation } from '$components/calendar/calendarNavigation';
	import Links from '$src/routes/quickLinks/quickLinks.svelte';
	import Notifications from '$src/routes/notifications/notificationsPage.svelte';
	import { getCoursesEvents } from '$lib/components/calendar/calendarUtils';
	import { registerPlugin, Capacitor } from '@capacitor/core';
	import { Browser } from '@capacitor/browser';
	import { locale } from '$lib/i18n';

	// Register the custom AppLauncher plugin
	const AppLauncherPlugin = registerPlugin('AppLauncherPlugin');

	register();
	// Get upcoming events (next 2 events)
	$: upcomingEvents = $EventStore
		.filter((event: Event) => new Date(event.slot.start) >= new Date())
		.sort((a: Event, b: Event) => new Date(a.slot.start).getTime() - new Date(b.slot.start).getTime())
		.slice(0, 2);

	// Mini calendar state
	let currentDate = new Date();
	let miniMonth = currentDate.getMonth();
	let miniYear = currentDate.getFullYear();
	let miniWeeks: DayObject[][] = [];

	$: {
		miniWeeks = buildCalendarWeeks(miniMonth, miniYear, $EventStore);
	}

	function formatEventDate(date: Date): string {
		const eventDate = new Date(date);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (eventDate.toDateString() === today.toDateString()) {
			return $t('homepage.today');
		} else if (eventDate.toDateString() === tomorrow.toDateString()) {
			return $t('homepage.tomorrow');
		} else {
			return eventDate.toLocaleDateString(getLocale(), { month: 'short', day: 'numeric' });
		}
	}

	async function openCapacitorSite() {
		await Browser.open({ url: 'https://gym.auth.gr/reservations/' });
	};

	function formatEventTime(date: Date): string {
		return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}

	let givenName = '';
	let gender = '';
	let numPassedSubjects = 0;
	let numSubjects = 0;
	let average = 0;
	let departmentName = '';
	let studyLevel = '';
	let actualSemester = 0;
	let studentStatus = '';
	let isFlipped = false;

	async function handleCampusSafetyClick() {
		const packageName = 'gr.auth.android.incidentmanager';
		const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=el`;

		const isAndroid = Capacitor.getPlatform() === 'android';

		if (isAndroid) {
			try {
				// Try to launch the app directly using our custom plugin
				const result = await AppLauncherPlugin.launchApp({ packageName });
				
				if (!result.launched) {
					// App not installed, open Play Store
					window.location.href = `market://details?id=${packageName}`;
				}
			} catch (err) {
				console.error('Error launching app:', err);
				window.location.href = `market://details?id=${packageName}`;
			}
		} else {
			// For other platforms, go to Play Store
			window.location.href = playStoreUrl;
		}
	}

	async function getInfo(locale: string) {
		if($EventStore.length === 0) 
			getCoursesEvents();
		
		let expandedLocale = locale == 'el' ? '' : '($expand=locale)';

		let personalData = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel'+expandedLocale+'), department'+expandedLocale + (expandedLocale !== '' ? ', person' +expandedLocale : '')
		);


		givenName = expandedLocale === '' ? personalData.person.givenName : personalData.person.locale.givenName;
		gender = personalData.person.gender;
		departmentName = expandedLocale === '' ? personalData.department?.name || 'Αδυναμία φόρτωσης' : personalData.department?.locale.name || 'Αδυναμία φόρτωσης';
		studyLevel = expandedLocale === '' ? personalData.studyProgram?.studyLevel?.name : personalData.studyProgram?.studyLevel?.locale.name || 'Αδυναμία φόρτωσης' ;
		actualSemester = personalData.actualSemester || null;
		studentStatus = personalData.studentStatus.id == 1 ? $t('homepage.studentStatusActive') : $t('homepage.studentStatusInactive');
		let subjects = (await neoUniversisGet('students/me/courses?$top=-1')).value;

		let passedSubjects = subjects.filter(
			(course: { isPassed: number }) => course.isPassed == 1
		);

		numSubjects = subjects?.length;
		numPassedSubjects = passedSubjects?.length;

		averages().then((result) => {
			average = (result as { weighted_avg: number }).weighted_avg;
		});
	}
</script>

<ion-content class="main-content" fullscreen>
	{#await getInfo($locale)}
		<HomepageSkeleton />
	{:then}
		<div class="gradient-bg">
		<div class="personal-section">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="info-container">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="header" on:click={() => {navController.push(PersonalInfo);}}>
					<div class="welcome">
						{#if gender === 'Α'}
							<img class="avatar" alt="man" src={man} />
						{:else}
							<img class="avatar" alt="woman" src={woman} />
						{/if}
						<div>
							<h5 class="h5">{$t('homepage.greeting')}, <span><b>{getVocativeCase(givenName)}!</b></span></h5>
							<h5 class="h6">{studentStatus}</h5>
						</div>
					</div>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="settings-icon-container" style="margin-inline-end:0.7rem;" on:click={() => {navController.push(PersonalInfo);}}>
					<ion-icon icon={settingsOutline} class="settings-icon"></ion-icon>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="settings-icon-container" on:click={handleCampusSafetyClick}>
					<ion-icon icon={shield} class="settings-icon"></ion-icon>
				</div>
			</div>

			<WalletCard 
				{departmentName}
				{studyLevel}
				{actualSemester}
				{numPassedSubjects}
				{numSubjects}
				{average}
				bind:isFlipped
			/>
		</div>

		<div class="services-section" class:card-flipped={isFlipped}>
			<div class="service-buttons-grid">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="service-button ion-activatable" on:click={() => {navController.push(Links);}}>
					<ion-icon icon={linkOutline} class="service-button-icon"></ion-icon>
					<span class="service-button-label">{$t('homepage.links')}</span>
					<ion-ripple-effect></ion-ripple-effect>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="service-button ion-activatable" on:click={openCapacitorSite}>
					<ion-icon icon={barbellOutline} class="service-button-icon"></ion-icon>
					<span class="service-button-label">{$t('homepage.gym')}</span>
					<ion-ripple-effect></ion-ripple-effect>
				</div>
			</div>

		</div>

		<div class="events-section">
			<!-- Upcoming Events Section -->
			{#if upcomingEvents.length > 0}
				<h4 class="middle-title">{$t('homepage.dontForget')}</h4>
				<div class="events-container">
					{#each upcomingEvents as event}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="event-card" on:click={() => { calendarNavigation.setNavigation({ date: new Date(event.slot.start), eventId: event.id }); goto('/pages/calendar'); }}>
							<div class="event-header">
								<div class="event-header-left">
									<div class="event-type-badge" data-type={event.type}>
										{event.type}
									</div>
									<div class="event-detail-item">
										<!-- <ion-icon icon={timeOutline} class="detail-icon"></ion-icon> -->
										<span class="event-time">
											{formatEventDate(event.slot.start)} • {formatEventTime(event.slot.start)}
										</span>
									</div>
								</div>
								<ion-icon icon={calendarOutline} class="event-icon"></ion-icon>
							</div>
							<h5 class="event-title">{event.title}</h5>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Create Event Prompt -->
				<h4 class="middle-title">{$t('homepage.dontForget')}</h4>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="events-container">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="event-card create-event-card" on:click={() => goto('/pages/calendar')}>
						<h5 class="event-title" style="opacity: 0.7;">{$t('homepage.noEvents')}</h5>
						<div class="event-header">
							<div class="event-header-left">
								<div class="event-type-badge" style="background: var(--ion-color-light-shade); color: var(--ion-text-color);">
									<ion-icon icon={addOutline}></ion-icon>
								</div>
								<div class="event-detail-item">
									<span class="event-time">
										{$t('homepage.createNew')}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
		
		<div class="updates-section">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<h4 class="middle-title" style="margin-bottom: 0;">{$t('homepage.updates')}</h4>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="service-icon-container" on:click={() => {navController.push(Notifications);}}>
					<ion-icon icon={notificationsCircle} style="font-size:2rem;"></ion-icon>
				</div>
			</div>
			<div style="margin-top: 0.5rem;">
				<RecentItems maxCards={6}/>
			</div>
		</div>
		</div>

	{:catch error}
		<ErrorLandingCard errorMsg={error} />
	{/await}
</ion-content>

<style>

	.main-content {
		--background: transparent;
	}

	.gradient-bg {
		position: relative;
		min-height: 100%;
		background: transparent;
		/* background: linear-gradient(to bottom, #0a0e17 0, #174ea6 12rem, var(--ion-background-color, #f5f5f5) 12rem); */
		background-blend-mode: overlay;
		overflow: hidden;
	}

	/* .gradient-bg::before {
		content: '';
		position: absolute;
		top: -20rem;
		left: -10%;
		width: 80%;
		height: 25rem;
		background: radial-gradient(
			circle,
			rgba(2, 78, 194, 0.4) 0%,
			transparent 70%
		);
		mix-blend-mode: screen;
		filter: blur(50px);
		animation: blobMove 4s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 0;
		pointer-events: none;
	}

	.gradient-bg::after {
		content: '';
		background: radial-gradient(
			circle,
			rgba(60, 110, 255, 0.5) 0%,
			rgba(0, 20, 100, 0.3) 40%,
			transparent 90%
		);
		position: absolute;
		top: -20rem;
		right: -10%;
		width: 90%;
		height: 2rem;
		mix-blend-mode: screen;
		filter: blur(60px);
		animation: blobMoveAlt 4s ease-in-out infinite alternate;
		z-index: 0;
		pointer-events: none;
	} */

	.personal-section {
		position: relative;
		padding: 0.5rem 1.5rem 0 1.5rem;
		border-radius: 0 0 0rem 0rem;
		padding-bottom: 1rem;
		z-index: 1;
		background: linear-gradient(to bottom, transparent 70%, var(--ion-background-color, #f5f5f5) 70%); /*linear-gradient(to bottom, #0a0e17 0, #174ea6 12rem, var(--ion-background-color, #f5f5f5) 12rem);*/
	}

	@keyframes blobMove {
		0% {
			transform: translate(0, 0) scale(1);
		}
		100% {
			transform: translate(30px, 30px) scale(1.1);
		}
	}

	@keyframes blobMoveAlt {
		0% {
			transform: translate(0, 0) scale(1);
		}
		100% {
			transform: translate(-30px, 20px) scale(1.15);
		}
	}

	.avatar {
		width: 3rem;
		margin-inline-end: 0.5rem;
	}

	.h5 {
		margin: 0;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		color: #FFFFFF;
		font-size: 1.15rem;
	}

	.info-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
		position: relative;
		z-index: 1;
	}

	.header {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.welcome {
		display: flex;
		align-items: center;
	}

	.h6 {
		margin: 0;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.2rem;
		color: var(--ion-color-medium);
		font-weight: normal;
		font-size: 0.875rem;
	}

	.settings-icon-container {
		display: flex;
		align-items: center;
		cursor: pointer;
		position: relative;
	}

	.settings-icon-container::after {
		content: '';
		position: absolute;
		top: -10px;
		bottom: -10px;
		left: -10px;
		right: -10px;
	}

	.service-icon-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}


	.service-buttons-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		position: relative;
		z-index: 1;
	}

	.service-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 3rem;
		cursor: pointer;
		transition: all 0.2s ease;
		background: var(--app-color-map-input, #ffffff);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		position: relative;
		overflow: hidden;
		z-index: 2;
	}

	.service-button-icon {
		font-size: 1.5rem;
		pointer-events: none;
	}

	.service-button-label {
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.2px;
		pointer-events: none;
	}

	.settings-icon {
		font-size: 1.5rem;
		color: #FFFFFF;
	}

	.events-section, .updates-section, .services-section {
		padding: 0rem 1.5rem 1.5rem 1.5rem;
		background-color: var(--ion-background-color, #f5f5f5) ;
	}

	.services-section {
		padding-top: 2.5rem !important;
		transition: margin-top 0.6s ease;
	}

	.services-section.card-flipped {
		margin-top: 5.5rem !important;
	}

	.middle-title {
		margin: 0 0 0.625rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--ion-text-color);
	}

	.events-container {
		border: 2px dashed var(--ion-color-medium-tint);
		border-radius: 1rem;
		padding: 0.625rem;
		background: var(--ion-color-light);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-card {
		background: var(--ion-background-color);
		border-radius: 0.625rem;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--ion-color-light-shade);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.event-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.event-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.375rem;
	}

	.event-header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.event-type-badge {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.3px;
		padding: 0.2rem 0.5rem;
		border-radius: 0.3rem;
		background: var(--ion-color-primary-tint);
		color: var(--ion-color-primary-contrast);
	}

	.event-type-badge[data-type="TEST"] {
		background: #ff6b6b;
		color: white;
	}

	.event-type-badge[data-type="ASSIGNMENT"] {
		background: #ffa726;
		color: white;
	}

	.event-type-badge[data-type="CLASS"] {
		background: #66bb6a;
		color: white;
	}

	.event-type-badge[data-type="TASK"] {
		background: #42a5f5;
		color: white;
	}

	.event-type-badge[data-type="OTHER"] {
		background: var(--ion-color-medium);
		color: white;
	}

	.event-icon {
		font-size: 1.1rem;
		color: var(--ion-color-medium);
	}

	.event-title {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ion-text-color);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.event-detail-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.event-time {
		font-size: 0.75rem;
		color: var(--ion-color-medium);
		font-weight: 500;
	}

	
</style>
