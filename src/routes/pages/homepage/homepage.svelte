<script lang="ts">
	import { averages } from '$lib/functions/gradeAverages/averages';
	import { neoUniversisGet } from '$lib/dataService';
	import man from '$lib/assets/man.svg';
	import { locationOutline, walletOutline, shield, settingsOutline, calendarOutline, shieldOutline, linkOutline, notificationsCircle, cloudOfflineOutline, barbellOutline, addOutline, ellipsisHorizontal } from 'ionicons/icons';
	import woman from '$lib/assets/woman.svg';
	import avatar from '$lib/assets/.svg';
	import { register } from 'swiper/element/bundle';
	import { navController } from '$components/shared/StackedNav';
	import PersonalInfo from '$src/routes/pages/homepage/personal_info/personalInfo.svelte';
	import RecentItems from '$components/recents/RecentsList.svelte';
	import HomepageSkeleton from '$lib/components/homepage/homepageSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { getVocativeCase } from '$lib/globalFunctions/getVocativeCase';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { getLocale, t } from '$lib/i18n';
	import WalletCard from '$lib/components/wallet/WalletCard.svelte';
	import { EventStore } from '$lib/components/calendar/event/EventStore';
	import type { Event } from '$lib/components/calendar/event/Event';
	import { buildCalendarWeeks, type DayObject } from '$lib/components/calendar/calendarUtils';
	import Links from '$src/routes/pages/homepage/quick_links/quickLinks.svelte';
	import Notifications from '$src/routes/notifications/notificationsPage.svelte';
	import { fetchUniversisEvents } from '$lib/components/calendar/calendarUtils';
	import { registerPlugin, Capacitor } from '@capacitor/core';
	import { Browser } from '@capacitor/browser';
	import { locale } from '$lib/i18n';
	import AdBanner from './ad_banner.svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import authlogo from '$lib/assets/auth_white.png';
	import appConfig from '$src/app.config';

	// Register the custom AppLauncher plugin
	const AppLauncherPlugin = registerPlugin('AppLauncherPlugin');

	register();
	// Get upcoming events (next 2 events)
	let upcomingEvents = $EventStore
		.filter((event: Event) => new Date(event.slot.start) >= new Date())
		.sort((a: Event, b: Event) => new Date(a.slot.start).getTime() - new Date(b.slot.start).getTime())
		.slice(0, 2);

	// Mini calendar state
	let currentDate = new Date();
	let miniMonth = currentDate.getMonth();
	let miniYear = currentDate.getFullYear();
	let miniWeeks: DayObject[][];

	miniWeeks = buildCalendarWeeks(miniMonth, miniYear, $EventStore);

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

	let aem = '';
	let apm = '';
	let inscriptionYear = '';
	let birthDate = '';
	let email = '';
	let username = '';
	let familyName = '';

	// Toggle state
	let isProfileExpanded = false;

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
			fetchUniversisEvents();
		
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
		aem = personalData.studentIdentifier;
		apm = personalData.uniqueIdentifier;
		inscriptionYear = personalData.inscriptionYear?.name ?? '';
		birthDate = personalData.person.birthDate?.slice(0, 10) ?? '';
		email = personalData.person.email;
		familyName = expandedLocale === '' 
			? personalData.person.familyName 
			: personalData.person.locale?.familyName ?? personalData.person.familyName;
		username = personalData.person.email.split('@')[0];

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

	let greeting: string = 'Hello';
	const currentHour = new Date().getHours();
	if (currentHour < 12) {
		greeting = $t('homepage.goodmorning');
	} else if (currentHour < 18) {
		greeting = $t('homepage.goodafternoon');
	} else {
		greeting = $t('homepage.goodevening');
	}



</script>

<ion-page>

	<ion-content id="homepage_content" fullscreen={false} >
		{#await getInfo($locale)}
		<HomepageSkeleton />
		{:then}
		<div id="scrolled_content">
		<!-- {isProfileExpanded ? 'expanded-personal-section' : ''} -->
			<div class="personal-section">
				<div class="info-container">
					<div class="header ion-activatable" on:click={() => { isProfileExpanded = !isProfileExpanded;}} aria-hidden>
						<!-- <ion-ripple-effect/> -->
						<div class="welcome">
							<h5 style="color: var(--ion-color-medium) !important; padding-left: 0.2rem;"><span style="font-size: 0.8em;">{greeting},</span> <br/> <span style="color: var(--ion-color-dark-tint);"><b>{getVocativeCase(givenName)} {getVocativeCase(familyName)}!</b></span>
							</h5>
						</div>
						
						<div>
					</div>
					</div>
					<div class="settings-icon-container ion-activatable" on:click={() => {navController.push(PersonalInfo);}} aria-hidden>
						<ion-ripple-effect/>
						{#if gender === 'Α'}
						<img class="avatar" alt="man" src={man} />
						{:else}
						<img class="avatar" alt="woman" src={woman} />
						{/if}
						<!-- <ion-icon icon={settingsOutline} class="settings-icon"></ion-icon> -->
					</div>

				</div>

			</div>

			<div class="wallet-section" style="margin: 0 0 1.5rem 0;">
				<WalletCard 
				{departmentName}
				{studyLevel}
				{actualSemester}
				{numPassedSubjects}
				{numSubjects}
				{average}
				/>
			</div>
			
			<div class="services-section">
				<div class="service-buttons-grid">
					<div class="service-button ion-activatable" on:click={() => {navController.push(Links);}} aria-hidden>
						<ion-icon icon={linkOutline} color="primary" class="service-button-icon"></ion-icon>
						<ion-ripple-effect></ion-ripple-effect>
					</div>
					<div class="service-button ion-activatable" on:click={handleCampusSafetyClick} aria-hidden>
						<ion-icon icon={shield} color="danger" class="service-button-icon"></ion-icon>
						<ion-ripple-effect></ion-ripple-effect>
					</div>
					<div class="service-button ion-activatable" on:click={openCapacitorSite} aria-hidden>
						<ion-icon icon={barbellOutline} color="success" class="service-button-icon"></ion-icon>
						<ion-ripple-effect></ion-ripple-effect>
					</div>
				</div>
			</div>

			{#if upcomingEvents.length > 0}
				<div style="margin-block: 1.5rem;">

					<div class="events-section" style="padding-inline:0 !important;">
						<!-- Upcoming Events Section -->
						<div class="section-title-row" style="padding-left: 1.5rem;">
							<h4 class="middle-title" style="padding-bottom: 0.5rem;">{upcomingEvents.length > 0 ? $t('homepage.dontForget') : $t('homepage.allClear')}</h4>
							<svg class="zigzag-line" viewBox="0 0 100 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
								<polyline
								points="0,8 5,2 10,8 15,2 20,8 25,2 30,8 35,2 40,8 45,2 50,8 55,2 60,8 65,2 70,8 75,2 80,8 85,2 90,8 95,2 100,8"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-dasharray="5 3"
								stroke-linecap="round"
								opacity="0.28"/>
							</svg>
						</div>	
					</div>			
					<div class="events-container" style="padding-inline:0 !important;">
						{#each upcomingEvents as event}
							<div class="event-card ion-activatable" data-type={event.type} aria-hidden
										on:click={() => { goto(`/pages/calendar?showEventId=${encodeURIComponent(event.id)}&eventDate=${encodeURIComponent((new Date(event.slot.start)).toISOString())}`); }}>
								<div class="event-header">
									<div class="event-type-badge">
										{event.type}
									</div>
									<span class="event-time-top">
										{formatEventDate(event.slot.start)} • {formatEventTime(event.slot.start)}
									</span>
								</div>
								<h5 class="event-title">{event.title}</h5>
								<div class="event-footer">
									{#if event.location}
									<div class="event-detail-item">
										<ion-icon icon={locationOutline} class="event-footer-icon"></ion-icon>
										<span class="event-footer-text">{event.location}</span>
									</div>
									{/if}
								</div>
								<ion-ripple-effect></ion-ripple-effect>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<!-- No Events Empty State -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="no-events-card" style="margin-inline: 1rem;" on:click={() => goto('/pages/calendar')} aria-hidden>
					<div class="no-events-info">
						<div class="no-events-icon">
							<ion-icon icon={calendarOutline}></ion-icon>
						</div>
						<div class="no-events-text">
							<span class="no-events-title">{$t('homepage.noEvents')}</span>
							<!-- <span class="no-events-subtitle">{$t('homepage.noEventsSubtitle')}</span> -->
						</div>
					</div>
					<div class="no-events-cta ion-activatable">
						<ion-ripple-effect></ion-ripple-effect>
						<ion-icon icon={addOutline}></ion-icon>
						<span>{$t('homepage.createNew')}</span>
					</div>
				</div>
			{/if}
			<!-- <svg class="zigzag-line" style="padding-left: 0rem; box-sizing: border-box;" viewBox="0 0 100 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<polyline
			points="0,8 5,2 10,8 15,2 20,8 25,2 30,8 35,2 40,8 45,2 50,8 55,2 60,8 65,2 70,8 75,2 80,8 85,2 90,8 95,2 100,8"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-dasharray="5 3"
							stroke-linecap="round"
							opacity="0.28"
						/>
			</svg> -->
		<div class="updates-section">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<h4 class="middle-title" style="margin-bottom: 0;">{$t('homepage.updates')}</h4>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="service-icon-container" on:click={() => {navController.push(Notifications);}}>
					<ion-icon icon={ellipsisHorizontal} style="font-size: 1.3rem; color: var(--ion-color-medium);"></ion-icon>
				</div>
			</div>
			<div style="margin-top: 0.5rem;">
				<RecentItems maxCards={6}/>
			</div>
		</div>
		
		<div style="padding: 1.5rem 0 0 0;">
			<AdBanner departmentName={departmentName} semester={actualSemester}/>
		</div>

	</div>
	
	{:catch error}
	<ErrorLandingCard errorMsg={error} />
	{/await}
</ion-content>
</ion-page>

<style>
	:global(ion-tabs):has(#homepage_content) :global(ion-toolbar){
		padding-top: var(--ion-safe-area-top) !important;
	}
	
	:global(ion-tabs):has(#homepage_content){
		padding-top: 0px !important;
	}

	ion-content {
		--padding-start: 1.5rem;
		--padding-end: 1.5rem;
	}

	.personal-section {
		position: relative;
		margin: 0.5rem 0  0.5rem 0;
		/* background: radial-gradient( 
			ellipse at 72% -5%,
			#6d5ef2 0%,
			#4C3FD6 18%,
			#1D2A9C 42%,
			#0D1870 65%
		); */
		border-radius: 0 0 1.5rem 1.5rem;
	}

	.avatar {
		width: 3rem;
		margin-block-start: 0rem;
		margin-inline-end: 0rem;
	}

	.info-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		/* padding-bottom: 2rem; */
		position: relative;
			}

	.header {
		display: flex;
		align-items: center;
		flex: 1;
		overflow: hidden;
		/* border-radius: 50px; */
		position: relative;
	}

	.welcome {
		display: flex;
		align-items: center;
	}


	.settings-icon-container {
		display: flex;
		align-items: center;
		cursor: pointer;
		position: relative;
		border-radius: 150px;
		overflow: hidden;
		padding: 4px;
	}

	.service-icon-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}


	.service-buttons-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		position: relative;
	}

	:global(body.dark) .service-button {
		background: var(--app-color-primary) !important;
	}

	.service-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 3rem;
		cursor: pointer;
		transition: all 0.2s ease;
		background: var(--app-color-map-input);
		/* border: 1px solid var(--ion-color-light-shade); */
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(12px);
		/* -webkit-backdrop-filter: blur(12px); Safari */
		/* border: 1px solid rgba(255, 255, 255, 0.25); */
		/* border-top: 1px solid rgba(255, 255, 255, 0.45); light hits top edge */
	}

	.service-button:active {
    background: rgba(255, 255, 255, 0.2);
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transform: scale(0.97);
}

	.service-button-icon {
		font-size: 1.5rem;
		pointer-events: none;
	}


	.services-section {
		/* padding-top: 2.5rem !important; */
		transition: margin-top 0.6s ease;
	}

	.middle-title {
		margin: 0 0 0.625rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--ion-color-medium);
	}

	.events-container {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* remove the old dashed border */
}

.events-container::-webkit-scrollbar {
  display: none;
}

.events-container> div:first-child {
    margin-left: 1.5rem;
}

.events-container> div:last-child {
    margin-right: 1.5rem;
}



.event-card {
  position: relative;
  min-width: 185px;
  flex-shrink: 0;
  border-radius: 1rem;
  padding: 0.875rem;
  cursor: pointer;
  overflow: hidden;
  border: none;
  color: white;
}

/* Card background colors per type */
.event-card[data-type="TEST"] {
  background: #e53835bc;
}
.event-card[data-type="ASSIGNMENT"] {
  background: #fb8a00b3;
}
.event-card[data-type="CLASS"] {
  background: #43a048d1;
}
.event-card[data-type="TASK"] {
  background: #1e88e5bc;
}
.event-card[data-type="OTHER"] {
  background: #bcbaba;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
  gap: 0.5rem;
}

.event-type-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  flex-shrink: 0;
}

.event-time-top {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  text-align: right;
}

.event-title {
  margin: 0 0 0.625rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
white-space: nowrap; /* Don't forget this one */
  -webkit-box-orient: vertical;
}

.event-footer {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

.event-detail-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  
}

.event-footer-icon {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.event-footer-text {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-events-card {
  position: relative;
  display: flex;
  align-items:center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 1rem;
  margin-block: 2rem;
  cursor: pointer;
  overflow: hidden;
}

.no-events-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.no-events-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast);
  font-size: 1.3rem;
}

.no-events-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.no-events-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ion-text-color);
}

.no-events-cta {
  position:relative;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  padding: 0.4rem 0.6rem;
  border-radius: 0.6rem;
  background: rgba(var(--ion-color-primary-rgb), 0.12);
}

.no-events-cta ion-icon {
  font-size: 1rem;
}


.section-title-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.625rem;
}

.section-title-row .middle-title {
    margin-bottom: 0;
    white-space: nowrap;
    flex-shrink: 0;
}

.zigzag-line {
    display: block;
    width: 100%;
    flex: 1;
    height: 10px;
    color: var(--ion-color-medium);
}
	
</style>
