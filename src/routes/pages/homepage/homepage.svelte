<script lang="ts">
	import { averages } from '$lib/functions/gradeAverages/averages';
	import { neoUniversisGet } from '$lib/dataService';
	import man from '$lib/assets/man.png';
	import { settingsOutline, calendarOutline, alertCircleOutline, linkOutline, notificationsOutline, cloudOfflineOutline, barbellOutline } from 'ionicons/icons';
	import woman from '$lib/assets/woman.png';
	import { register } from 'swiper/element/bundle';


	register();
	import RecentItems from '$components/recentResults/recents.svelte';
	import HomepageSkeleton from '$lib/components/homepage/homepageSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { getVocativeCase } from '$lib/globalFunctions/getVocativeCase';
	import Banner from '$components/advertisements/BannerCard.svelte';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { t } from '$lib/i18n';
	import WalletCard from '$lib/components/wallet/WalletCard.svelte';
	import { checkForUpdates } from '$lib/globalFunctions/checkVersion';
	import { EventStore } from '$lib/components/calendar/event/EventStore';
	import type { Event } from '$lib/components/calendar/event/Event';
	import MenuSkeleton from '$components/menu/menuSkeleton.svelte';
	import { buildCalendarWeeks, type DayObject, getWeekdayNames, isToday as checkIsToday } from '$lib/components/calendar/calendarUtils';

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
	const weekdayNames = getWeekdayNames();

	$: {
		miniWeeks = buildCalendarWeeks(miniMonth, miniYear, $EventStore);
	}

	function isToday(dayObj: DayObject) {
		return checkIsToday(dayObj, miniMonth, miniYear);
	}

	function hasEvents(dayObj: DayObject) {
		if (!dayObj || !dayObj.isCurrentMonth) return false;
		return dayObj.hasEvents;
	}

	function formatEventDate(date: Date): string {
		const eventDate = new Date(date);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (eventDate.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (eventDate.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		} else {
			return eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		}
	}

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

	async function getInfo() {
		let personalData = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel), department'
		);

		givenName = personalData.person.givenName;
		gender = personalData.person.gender;
		departmentName = personalData.department?.name || 'ΤΜΗΜΑ ΠΛΗΡΟΦΟΡΙΚΗΣ';
		studyLevel = personalData.studyProgram?.studyLevel?.name || 'Διδακτορικό';
		actualSemester = personalData.actualSemester || 1;
		studentStatus = personalData.studentStatus.description || 'Ενεργός φοιτητής';
		let subjects = (await neoUniversisGet('students/me/courses?$top=-1')).value;

		let passedSubjects = subjects.filter(
			(course: { grade: number }) => course.grade * 10 >= 5
		);

		numSubjects = subjects.length;
		numPassedSubjects = passedSubjects.length;

		averages().then((result) => {
			average = (result as { weighted_avg: number }).weighted_avg;
		});

	}
	</script>

<ion-content class="main-content" fullscreen>
	{#await getInfo()}
		<HomepageSkeleton />
	{:then}
		<div class="gradient-bg">
		<div class="personal-section">
			<div class="info-container">
				<div class="header">
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
				<div class="settings-icon-container" on:click={() => goto('/settings')}>
					<ion-icon icon={settingsOutline} class="settings-icon"></ion-icon>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="settings-icon-container" on:click={() => goto('/settings')}>
					<ion-icon icon={alertCircleOutline} class="settings-icon"></ion-icon>
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
				<div class="service-button service-button-orange" on:click={() => goto('./menu')}>
					<ion-icon icon={linkOutline} class="service-button-icon"></ion-icon>
					<span class="service-button-label">Σύνδεσμοι</span>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="service-button service-button-purple" on:click={() => goto('../gym/reservIframe')}>
					<ion-icon icon={barbellOutline} class="service-button-icon"></ion-icon>
					<span class="service-button-label">Γυμναστήριο</span>
				</div>
			</div>

		</div>

		<div class="events-section">
			<!-- Upcoming Events Section -->
			{#if upcomingEvents.length > 0 }
				<h4 class="middle-title">Μην ξεχάσεις!</h4>
				<div class="events-container">
					{#each upcomingEvents as event}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="event-card" on:click={() => goto('/pages/calendar')}>
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
				<!-- Mini Calendar when no events -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="mini-calendar-container" on:click={() => goto('/pages/calendar')}>
					<div class="mini-calendar-header">
						<h4 class="mini-calendar-title">
							{new Date(miniYear, miniMonth).toLocaleDateString(undefined, {
								month: 'long',
								year: 'numeric'
							})}
						</h4>
						<ion-icon icon={calendarOutline} class="mini-calendar-icon"></ion-icon>
					</div>
					<div class="mini-calendar-grid">
						{#each weekdayNames as dayName}
							<div class="mini-day-name">{dayName}</div>
						{/each}
						{#each miniWeeks as week}
							{#each week as dayObj}
								<div class="mini-day {dayObj.isCurrentMonth ? '' : 'inactive'} {isToday(dayObj) ? 'today' : ''}">
									<span>{dayObj.day}</span>
									{#if hasEvents(dayObj)}
										<div class="mini-event-dot"></div>
									{/if}
								</div>
							{/each}
						{/each}
					</div>
				</div>
			{/if}
		</div>
		
		<div class="updates-section">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<h4 class="middle-title" style="margin-bottom: 0;">Ενημερώσεις</h4>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="service-icon-container" on:click={() => goto('../notifications')}>
					<ion-icon icon={notificationsOutline} class="service-icon" style="font-size:1.5rem;"></ion-icon>
				</div>
			</div>
			<div style="margin-top: 0.5rem;">
				<RecentItems/>
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
		background: linear-gradient(to bottom, #0a0e17 0%, #1e3c72 22%, #1e3c72 22%, var(--ion-background-color, #f5f5f5) 22%);
		background-blend-mode: overlay;
		animation: gradientMove 20s ease-in-out infinite alternate;
	}

	.gradient-bg::after {
		background: radial-gradient(
			circle at 70% 70%,
			rgba(72, 133, 247, 0.7) 0%,
			rgba(2, 17, 43, 0.5) 30%,
			transparent 80%
		);
		mix-blend-mode: screen;
		filter: blur(180px);
		animation: blobMoveAlt 70s ease-in-out infinite;
	}

	.personal-section {
		position: relative;
		padding: 1.5rem 1.5rem 0 1.5rem;
		border-radius: 0 0 0rem 0rem;
		padding-bottom: 1rem;
		z-index: 1;
	}

	/* Subtle gradient motion */
	@keyframes gradientMove {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}

	@keyframes blobMove {
		0% {
			transform: translate(0%, 0%) scale(1);
		}
		50% {
			transform: translate(10%, -5%) scale(1.2);
		}
		100% {
			transform: translate(-5%, 10%) scale(1);
		}
	}

	@keyframes blobMoveAlt {
		0% {
			transform: translate(0%, 0%) scale(1);
		}
		50% {
			transform: translate(-10%, 10%) scale(1.15);
		}
		100% {
			transform: translate(5%, -5%) scale(1);
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
		color: rgba(255, 255, 255, 0.7);
		font-weight: normal;
		font-size: 0.875rem;
	}

	.settings-icon-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.service-icon-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.service-icon {
		font-size: 2rem;
	}

	.service-buttons-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.service-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 1rem;
		padding: 0.5rem 0rem;
		padding-inline-start: 1rem;
		border-radius: 3rem;
		cursor: pointer;
		transition: all 0.2s ease;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.service-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(56, 128, 255, 0.15);
		border-color: var(--ion-color-primary-tint);
	}

	.service-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.service-button-icon {
		font-size: 1.5rem;
	}

	.service-button-label {
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.2px;
	}

	.settings-icon {
		font-size: 1.5rem;
		color: #FFFFFF;
	}

	.events-section, .updates-section, .services-section {
		padding: 0rem 1.5rem 1.5rem 1.5rem;
	}

	.services-section {
		margin-top: 2.5rem !important;
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

	/* Mini Calendar Styles */
	.mini-calendar-container {
		background: white;
		border-radius: 1rem;
		padding: 1rem;
		border: 1px solid var(--ion-color-light-shade);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mini-calendar-container:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(56, 128, 255, 0.12);
		border-color: var(--ion-color-primary-tint);
	}

	.mini-calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.mini-calendar-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ion-text-color);
	}

	.mini-calendar-icon {
		font-size: 1.25rem;
		color: var(--ion-color-primary);
	}

	.mini-calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.375rem;
		text-align: center;
	}

	.mini-day-name {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--ion-color-primary);
		padding: 0.25rem 0;
	}

	.mini-day {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		position: relative;
		color: var(--ion-text-color);
		transition: background 0.15s ease;
	}

	.mini-day.inactive {
		color: var(--ion-color-medium-tint);
	}

	.mini-day.today {
		background: var(--ion-color-primary);
		color: white;
		font-weight: 600;
	}

	.mini-event-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--ion-color-primary);
		position: absolute;
		bottom: 2px;
	}

	.mini-day.today .mini-event-dot {
		background: white;
	}
</style>
