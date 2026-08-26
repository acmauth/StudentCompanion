<script lang="ts">
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import { getMenu } from '$lib/menuScraper/scraper';
	import { getMenuFromCache } from '$lib/menuScraper/menuCache';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import MenuSkeleton from '$lib/components/menu/menuSkeleton.svelte';
	import { t} from '$lib/i18n';

	register();

	let cafeteriaData: string[] = [];
	let cafeteriaDates: (string | null)[] = [];
	let breakfastData: string = '';
	let lunchData: string = '';
	let dinnerData: string = '';
	let title: string = $t('menu.todaysMenu');
	let defaultSlideIndex: number = 0;
	let showingCachedData = false;
	let dataLoaded = false;

	// Weekday keys (index order matches cafeteriaData/cafeteriaDates and menu.<day> i18n keys)
	const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	// Meal tabs shown above the swiper (index order matches the swiper slide order)
	const mealTabs = ['breakfast', 'lunch', 'dinner'];
	const mealIcons = [allIonicIcons.cafeOutline, allIonicIcons.restaurantOutline, allIonicIcons.moonOutline];
	let activeMealKey = mealTabs[0];


	const TIME_RANGE_RE = /\d{1,2}[:.]\d{2}\s*[–—-]\s*\d{1,2}[:.]\d{2}/;

	function markHoursParagraphs(html: string): string {
		if (!html || typeof DOMParser === 'undefined') return html;
		try {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			doc.body.querySelectorAll('p').forEach((p) => {
				const text = (p.textContent || '').trim();
				const isCandidate = p.previousElementSibling?.tagName === 'H2' || TIME_RANGE_RE.test(text);
				if (!isCandidate) return;
				const match = text.match(TIME_RANGE_RE);
				if (match) {
					p.textContent = match[0];
					p.classList.add('menu-hours');
				} else {
					p.remove();
				}
			});
			return doc.body.innerHTML;
		} catch {
			return html;
		}
	}

	// The "full" day HTML leads with its own date line (e.g. "📅 29/06/2026").
	// Pull that out so it can sit next to the weekday name in the accordion
	// header instead of being hidden inside the collapsed content.
	const DATE_RE = /\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}/;

	function extractLeadingDate(html: string): { date: string | null; html: string } {
		if (!html || typeof DOMParser === 'undefined') return { date: null, html };
		try {
			const doc = new DOMParser().parseFromString(html, 'text/html');
			const first = doc.body.firstElementChild;
			const match = first?.tagName === 'P' ? (first.textContent || '').match(DATE_RE) : null;
			if (!match) return { date: null, html };
			first!.remove();
			return { date: match[0], html: doc.body.innerHTML };
		} catch {
			return { date: null, html };
		}
	}

	// Runs both cleanup passes on a day's "full" HTML.
	function prepareDayHtml(full: string): { date: string | null; html: string } {
		const { date, html } = extractLeadingDate(full);
		return { date, html: markHoursParagraphs(html) };
	}

	// Applies prepareDayHtml() across a week and assigns both cafeteriaData and
	// cafeteriaDates together, so Svelte only sees one update per array.
	function applyWeekHtml(days: { full: string }[]) {
		const prepared = days.map((day) => prepareDayHtml(day.full));
		cafeteriaData = prepared.map((p) => p.html);
		cafeteriaDates = prepared.map((p) => p.date);
	}

	// Switch the swiper to the tapped meal tab
	function handleSegmentChange(key: string | number | undefined) {
		if (typeof key !== 'string') return;
		activeMealKey = key;
		const idx = mealTabs.indexOf(key);
		const swiperEl = document.querySelector('swiper-container') as any;
		if (idx >= 0 && swiperEl?.swiper) {
			swiperEl.swiper.slideTo(idx);
		}
	}

	// Determine today's index (0 for Monday, 6 for Sunday)
	const date = new Date();
	let today = date.getDay();
	// Convert from Sunday=0, Monday=1 to Monday=0, Sunday=6
	today = today === 0 ? 6 : today - 1;
	let today_weekday = date.toLocaleDateString(undefined, { weekday: 'long' });

	const hours = date.getHours();
	const mins = date.getMinutes();
	let message = ''; // Cafeteria status message
	let now = ''; // Current meal
	let next = ''; // Next meal
	let color = 'success';
	let menuDate = '';
	let closedForHolidays = false;

	// Seasonal emoji shown when the cafeteria is closed for holidays
	const month = date.getMonth(); // 0 = January, 11 = December
	let seasonalEmoji = '🏖️';
	if (month === 6 || month === 7) {
		seasonalEmoji = '🏖️'; // July - August
	} else if (month === 11 || month === 0) {
		seasonalEmoji = '🎄'; // December - January
	} else if (month === 2 || month === 3 || month === 4) {
		seasonalEmoji = '🐰'; // March - May
	}
		
	// Determine cafeteria status based on current time
	// Now we stay on today's menu all day until midnight
	if ((hours == 8 && mins >= 30) || (hours == 10 && mins < 30) || (hours == 9)) {
		message = $t('menu.morning_open');
		now = $t('menu.breakfast');
		next = $t('menu.lunch');
		defaultSlideIndex = 0; // Show breakfast
	} else if ((hours == 10 && mins >=30) || (hours == 11)) {
		message = $t('menu.morning_closed');
		color = 'danger';
		now = $t('menu.lunch');
		next = $t('menu.dinner');
		defaultSlideIndex = 1; // Show lunch
	} else if (hours >= 12 && hours < 16) {
		message = $t('menu.midday_open');
		now = $t('menu.lunch');
		next = $t('menu.dinner');
		defaultSlideIndex = 1; // Show lunch
	} else if (hours >= 16 && hours < 18) {
		message = $t('menu.midday_closed');
		color = 'danger';
		now = $t('menu.dinner');
		next = '';
		defaultSlideIndex = 2; // Show dinner
	} else if (hours >= 18 && hours <= 23) {
		// Changed: Stay on today's dinner until midnight
		if (hours >= 18 && hours < 21) {
			message = $t('menu.evening_open');
		} else {
			message = $t('menu.evening_closed');
			color = 'danger';
		}
		now = $t('menu.dinner');
		next = '';
		defaultSlideIndex = 2; // Show dinner
	} else {
		// Before breakfast opens
		message = $t('menu.evening_closed');
		color = 'danger';
		now = $t('menu.breakfast');
		next = $t('menu.lunch');
		defaultSlideIndex = 0; // Show breakfast
	}

	title = $t('menu.todaysMenu');

	// Applies the club-open status to the status message/color shown above the menu
	function applyClubOpenStatus(isClubOpen: boolean | undefined) {
		if (isClubOpen != undefined && !isClubOpen) {
			message = $t('menu.closedForHolidays');
			color = 'danger';
		}
	}

	// Fetch and process menu data
	async function getMenuData() {
		const menuAPIresponse = await getMenu();
		const menuData = menuAPIresponse.days;
		const isClubOpen = menuAPIresponse.club_open;

		applyClubOpenStatus(isClubOpen);

		if (typeof menuData === 'string') {
			throw new Error(menuData);
		}


		// menuData is an array of day objects (Monday=0, Sunday=6)
		applyWeekHtml(menuData);
		breakfastData = markHoursParagraphs(menuData[today]?.breakfast || '');
		lunchData = markHoursParagraphs(menuData[today]?.lunch || '');
		dinnerData = markHoursParagraphs(menuData[today]?.dinner || '');
		menuDate = '';

		// if it's undefined then cached data is returned
		if (isClubOpen != undefined) {
			showingCachedData = false;
		}
		dataLoaded = true;
	}

	// Load cached data immediately on mount
	async function loadCachedData() {
		const cached = await getMenuFromCache();
		const cachedMenu = cached?.menu;

		if (cachedMenu && cachedMenu.length > 0) {
			applyWeekHtml(cachedMenu);
			breakfastData = markHoursParagraphs(cachedMenu[today]?.breakfast || '');
			lunchData = markHoursParagraphs(cachedMenu[today]?.lunch || '');
			dinnerData = markHoursParagraphs(cachedMenu[today]?.dinner || '');
			menuDate = '';

			// Apply the club-open status that was cached alongside the menu so a
			// holiday closure doesn't flash an open menu before the fresh fetch lands
			applyClubOpenStatus(cached?.clubOpen);

			showingCachedData = true;
			dataLoaded = true;
			return true;
		}
		return false;
	}

	function formatDate(date: Date){
		//Format date object into dd/mm/yyyy
		return  String(date.getDate()).padStart(2, '0') + '/' +
				String(date.getMonth() + 1).padStart(2, '0') + '/' +
				date.getFullYear();
	}

	// Initialize data on mount
	async function initializeData() {
		const hasCachedData = await loadCachedData();

		if (!hasCachedData) {
			// No cached data, fetch from API
			await getMenuData();
		} else {
			// Has cached data, fetch fresh data in background
			getMenuData().catch(error => {
				console.error('Failed to fetch fresh menu data:', error);
				// Keep showing cached data on error
			});
		}
	}
	
	// Initialize swiper when data is loaded
	$: if (dataLoaded && typeof window !== 'undefined') {
		// Wait for the DOM to be ready and data to be loaded
		setTimeout(() => {
			const swiperEl = document.querySelector('swiper-container') as any;
			if (swiperEl && swiperEl.swiper) {
				// Update existing swiper
				swiperEl.swiper.update();
				swiperEl.swiper.slideTo(defaultSlideIndex);
				activeMealKey = mealTabs[defaultSlideIndex];
			} else if (swiperEl) {
				// Initialize swiper with custom configuration
				const swiperParams = {
					pagination: {
						clickable: true,
					},
					spaceBetween: 20,
					initialSlide: defaultSlideIndex,
					autoHeight: true, // Enable auto-height to adjust to content
				};

				Object.assign(swiperEl, swiperParams);
				swiperEl.initialize();
				activeMealKey = mealTabs[defaultSlideIndex];
			}

			// Keep the meal segment control in sync when the user swipes manually
			if (swiperEl && !swiperEl.__mealSyncBound) {
				swiperEl.__mealSyncBound = true;
				swiperEl.addEventListener('swiperslidechange', (e: any) => {
					const idx = e.detail?.[0]?.activeIndex;
					if (typeof idx === 'number' && mealTabs[idx]) {
						activeMealKey = mealTabs[idx];
					}
				});
			}
		}, 100);
	}

	$: closedForHolidays = message === $t('menu.closedForHolidays');
	$: todayKey = today_weekday.toLowerCase();
</script>

<ion-page>
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode="md">
            <ion-title size="large">{$t('menu.title')}</ion-title>
        </ion-toolbar>
    </ion-header>	
    <ion-content style="padding-top:0;">
		{#await initializeData()}
			<!-- Loading: Show skeleton while fetching data -->
			<MenuSkeleton />
		{:then}
			<!-- Data loaded successfully -->
			{#if dataLoaded}
				<div class="status-wrap">
					{#if showingCachedData}
						<div class="status-card status-warning">
							<ion-icon icon={allIonicIcons.cloudOfflineOutline} />
							<span class="status-message">{$t('menu.showingCachedData') || 'Showing cached data'}</span>
						</div>
					{:else}
						<div class="status-card status-{color}">
							<ion-icon icon={color === 'success' ? allIonicIcons.checkmarkCircleOutline : allIonicIcons.closeCircleOutline} />
							<span class="status-message">{message}</span>
						</div>
					{/if}
				</div>

				<div style="margin: 0 0.6rem 0rem 0.6rem; margin-bottom: 5rem;">
					{#if !closedForHolidays}
					<ion-card>
							<div class="meal-tabs">
								<ion-segment value={activeMealKey} mode="ios" on:ionChange={(e) => handleSegmentChange(e.detail.value)}>
									{#each mealTabs as tabKey, i}
										<ion-segment-button value={tabKey}>
											<ion-icon icon={mealIcons[i]} />
											<ion-label>{$t(`menu.${tabKey}`)}</ion-label>
											{#if i === defaultSlideIndex}
												<span class="now-dot" aria-label={$t('menu.now')} />
											{/if}
										</ion-segment-button>
									{/each}
								</ion-segment>
							</div>
							<ion-card-content class="swiper-card-content">
								<swiper-container
								init="false"
								pagination="true"
								pagination-clickable="true"
								space-between="20">
									<!-- Breakfast Slide -->
									<swiper-slide>
										<div class="meal-slide">
											<div class="formatted-menu">{@html breakfastData}</div>
										</div>
									</swiper-slide>
									<!-- Lunch Slide -->
									<swiper-slide>
										<div class="meal-slide">
											<div class="formatted-menu">{@html lunchData}</div>
										</div>
									</swiper-slide>
									<!-- Dinner Slide -->
									<swiper-slide>
										<div class="meal-slide">
											<div class="formatted-menu">{@html dinnerData}</div>
										</div>
									</swiper-slide>
								</swiper-container>
							</ion-card-content>
						</ion-card>
					{:else}
						<div class="empty-state">
							<div class="empty-state-emoji">{seasonalEmoji}</div>
							<!-- <p class="empty-state-message">{message}</p> -->
						</div>
					{/if}
			<!-- </div> -->

				<!-- &nbsp; -->
				
				<h2 class="ion-padding">
					{$t('menu.week')}
				</h2>
				<ion-accordion-group expand="inset" value={closedForHolidays? undefined: todayKey}>
					{#each weekDays as day, i}
						<ion-accordion value={day}>
							<ion-item slot="header">
								<ion-label>{$t('menu.' + day)}{#if cafeteriaDates[i]}<span class="day-date">{cafeteriaDates[i]}</span>{/if}</ion-label>
								{#if cafeteriaDates[i] == formatDate(new Date())}<ion-badge class="today-badge">{$t('menu.today')}</ion-badge>{/if}
							</ion-item>
							<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[i]}</div>
						</ion-accordion>
					{/each}
				</ion-accordion-group>
				</div>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</ion-content>
</ion-page>

<style>
	.swiper-card-content {
		padding: 0 !important;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 1.5rem 0.6rem 2rem 0.6rem;
		padding: 2.5rem 1.5rem;
		border-radius: 1.25rem;
		background: var(--ion-color-light);
	}

	.empty-state-emoji {
		font-size: 4.5rem;
		line-height: 1;
		width: 6.5rem;
		height: 6.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(var(--ion-color-primary-rgb), 0.1);
		margin-bottom: 1.25rem;
	}

	.empty-state-message {
		margin: 0;
		text-align: center;
		color: var(--ion-color-medium);
		font-size: 0.95rem;
	}

	.status-wrap {
		display: flex;
		justify-content: center;
		padding: 0.75rem 0.9rem 0;
		margin-bottom: 1rem;
	}

	.status-card {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		max-width: 32rem;
		padding: 0.6rem 0.9rem;
		border-radius: 1rem;
	}

	.status-card ion-icon {
		font-size: 1.35rem;
		flex-shrink: 0;
	}

	.status-message {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.status-success {
		background: rgba(var(--ion-color-success-rgb), 0.12);
		color: var(--ion-color-success);
	}

	.status-danger {
		background: rgba(var(--ion-color-danger-rgb), 0.12);
		color: var(--ion-color-danger);
	}

	.status-warning {
		background: rgba(var(--ion-color-warning-rgb), 0.16);
		color: var(--ion-color-warning-shade);
	}

	.status-warning .status-message {
		font-weight: 500;
		font-size: 0.85rem;
	}

	.meal-tabs {
		padding: 0.6rem 0.6rem 0.5rem;
		border-bottom: 1px solid rgba(var(--ion-color-medium-rgb), 0.15);
	}

	ion-segment-button {
		--indicator-color: rgba(var(--ion-color-primary-rgb), 0.12);
		min-height: 3.1rem;
		position: relative;
	}

	ion-segment-button ion-icon {
		font-size: 1.15rem;
	}

	.now-dot {
		position: absolute;
		top: 0.4rem;
		right: 0.6rem;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--ion-color-success);
	}

	.today-badge {
		margin-inline-start: 0.5rem;
		font-size: 0.65rem;
		border-radius: 999px;
		--background: rgba(var(--ion-color-primary-rgb), 0.15);
		--color: var(--ion-color-primary);
	}

	.day-date {
		margin-left: 0.5rem;
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--ion-color-medium);
	}

	h2 {
		color: var(--ion-color-medium);
		justify-self: center;
	}
	
	.meal-slide {
		/* padding: 1.25rem 1.5rem; */
		height: auto;
		box-sizing: border-box;
		width: 100%;
		margin: 0.7rem 0.7rem;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		border-radius: 12px;
	}

	ion-accordion-group ion-item {
		background-color: var(--ion-color-light);
	}

	.formatted-menu-acc {
		padding: 1rem;
		background-color: var(--ion-color-light);
	}

	:global(.formatted-menu) {
		width: 100%;
		max-width: 100%;
		min-width: 0;
		box-sizing: border-box;
		overflow-x: auto;
		padding: 0.25rem 0.5rem 0.5rem 0.5rem;
		margin: 0;
	}

	/* The meal name is already shown by the ion-segment tabs, so the API's own
	   heading inside each swiper slide would just be a redundant repeat. */
	:global(.meal-slide .formatted-menu > h2:first-of-type) {
		display: none;
	}

	/* The weekly accordion shows all three meals concatenated, so its headings
	   stay visible but get a lighter accent instead of a full-width rule. */
	:global(.formatted-menu-acc h2) {
		border-bottom: none !important;
		padding-bottom: 0.3rem !important;
		margin-top: 1.4rem !important;
	}

	:global(.formatted-menu-acc h2:first-of-type) {
		margin-top: 0 !important;
	}
/* 
	:global(.formatted-menu-acc h2::after) {
		content: '';
		display: block;
		width: 2.5rem;
		height: 3px;
		border-radius: 2px;
		background: var(--ion-color-primary);
		margin: 0.4rem auto 0;
	} */

	/* Section labels ("FIRST DISH", "SALAD", ...) as pill badges. Targeted by
	   tag, not text, since the API returns the labels in whichever locale is active. */
	:global(.formatted-menu h3),
	:global(.formatted-menu-acc h3) {
		background: rgba(var(--ion-color-primary-rgb), 0.12) !important;
		color: var(--ion-color-primary) !important;
		border-radius: 0.6rem !important;
		padding: 0.35rem 0.75rem !important;
		display: flex !important;
		width: fit-content !important;
		margin: 1.1rem 0 0.6rem 0 !important;
		font-size: 0.78rem !important;
		letter-spacing: 0.03em;
	}

	/* Distribution-hours paragraphs, tagged client-side by markHoursParagraphs()
	   (the API sometimes splits the hours across more than one <p>, so this is
	   matched by content - "is it just a time range?" - not just by position). */
	:global(.formatted-menu p.menu-hours),
	:global(.formatted-menu-acc p.menu-hours) {
		background: rgba(var(--ion-color-medium-rgb), 0.15) !important;
		color: var(--ion-color-medium) !important;
		border-left: none;
		display: flex !important;
		width: fit-content !important;
		align-items: center;
		gap: 0.35rem;
		border-radius: 999px;
		padding: 0.3rem 0.75rem !important;
		font-style: normal !important;
		font-size: 0.78rem !important;
		margin: 0 0 0.6rem 0 !important;
	}

	:global(.formatted-menu p.menu-hours::before),
	:global(.formatted-menu-acc p.menu-hours::before) {
		content: '🕐';
		font-size: 0.85em;
	}

	/* "selection from" style notes (marked up with <em> by the API) become a small label. */
	:global(.formatted-menu p:has(em)),
	:global(.formatted-menu-acc p:has(em)) {
		background: transparent !important;
		border-left: none;
		padding: 0 0 0.2rem 0.1rem !important;
		margin: 0.6rem 0 0.2rem 0 !important;
		color: var(--ion-color-medium) !important;
		font-size: 0.75rem !important;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	:global(.formatted-menu p:has(em) em),
	:global(.formatted-menu-acc p:has(em) em) {
		font-style: normal;
	}

	:global(.meal-title) {
		font-size: 1.3rem;
		font-weight: bold;
		color: var(--ion-color-primary);
		text-align: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--ion-color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	:global(.meal-title ion-icon) {
		font-size: 1.5rem;
	}

	:global(swiper-container) {
		width: 100%;
		margin: 0 auto;
		height: auto;
		min-width: 0;
		box-sizing: border-box;
	}

	:global(swiper-slide) {
		display: flex;
		align-items: stretch;
		justify-content: center;
		height: auto;
		width: 100% !important;
		min-width: 0;
		box-sizing: border-box;
	}

	:global(.swiper-pagination-bullet) {
		background: var(--ion-color-primary);
	}
</style>
