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
	let breakfastData: string = '';
	let lunchData: string = '';
	let dinnerData: string = '';
	let title: string = $t('menu.todaysMenu');
	let defaultSlideIndex: number = 0;
	let showingCachedData = false;
	let dataLoaded = false;

	// Determine today's index (0 for Monday, 6 for Sunday)
	const date = new Date();
	let today = date.getDay();
	// Convert from Sunday=0, Monday=1 to Monday=0, Sunday=6
	today = today === 0 ? 6 : today - 1;

	const hours = date.getHours();
	const mins = date.getMinutes();
	let message = ''; // Cafeteria status message
	let now = ''; // Current meal
	let next = ''; // Next meal
	let color = 'success';
	let menuDate = '';

	// Determine cafeteria status based on current time
	// Now we stay on today's menu all day until midnight
	if ((hours == 8 && mins >= 30) || (hours > 8 && hours < 10)) {
		message = $t('menu.morning_open');
		now = $t('menu.breakfast');
		next = $t('menu.lunch');
		defaultSlideIndex = 0; // Show breakfast
	} else if (hours >= 10 && hours < 12) {
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

	// Fetch and process menu data
	async function getMenuData() {
		const menuAPIresponse = await getMenu();
		const menuData = menuAPIresponse.days;
		const isClubOpen = menuAPIresponse.club_open;

		if (isClubOpen != undefined && !isClubOpen) {
			message = $t('menu.closedForHolidays');
			color = 'danger';
		}

		if (typeof menuData === 'string') {
			throw new Error(menuData);
		}


		// menuData is an array of day objects (Monday=0, Sunday=6)
		cafeteriaData = menuData.map(day => day.full);
		breakfastData = menuData[today]?.breakfast || '';
		lunchData = menuData[today]?.lunch || '';
		dinnerData = menuData[today]?.dinner || '';
		menuDate = '';

		// if it's undefined then cached data is returned
		if (isClubOpen != undefined) {
			showingCachedData = false;
		}
		dataLoaded = true;
	}

	// Load cached data immediately on mount
	async function loadCachedData() {
		const cachedMenu = await getMenuFromCache();
		
		if (cachedMenu && cachedMenu.length > 0) {
			cafeteriaData = cachedMenu.map(day => day.full);
			breakfastData = cachedMenu[today]?.breakfast || '';
			lunchData = cachedMenu[today]?.lunch || '';
			dinnerData = cachedMenu[today]?.dinner || '';
			menuDate = '';

			showingCachedData = true;
			dataLoaded = true;
			return true;
		}
		return false;
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
			}
		}, 100);
	}

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
				<div class="ion-text-center">
					{#if showingCachedData}
						<ion-chip class="ion-padding" color="warning">
							<ion-icon icon={allIonicIcons.cloudOfflineOutline} /> &nbsp; {$t('menu.showingCachedData') || 'Showing cached data'}
						</ion-chip>
					{:else}
						<ion-chip class="ion-padding" {color}>
							<ion-icon icon={allIonicIcons.timeOutline} /> &nbsp; {message}
						</ion-chip>
					{/if}
				</div>

				<!-- <h2 class="ion-padding" style="margin-top:0.1rem;">
					{title}
				</h2> -->

				<div style="margin: 0 0.6rem 0rem 0.6rem; margin-bottom: 5rem;">
					<ion-card color="light">
						<ion-card-content class="swiper-card-content">
							<swiper-container
							init="false"
							pagination="true"
							pagination-clickable="true"
							space-between="20"
						>
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
			<!-- </div> -->

				<!-- &nbsp; -->
				
				<h2 class="ion-padding">
					{$t('menu.week')}
				</h2>
				<ion-accordion-group expand="inset">
					<ion-accordion value="first">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.monday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[0]}</div>
					</ion-accordion>
					<ion-accordion value="second">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.tuesday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[1]}</div>
					</ion-accordion>
					<ion-accordion value="third">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.wednesday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[2]}</div>
					</ion-accordion>
					<ion-accordion value="fourth">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.thursday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[3]}</div>
					</ion-accordion>
					<ion-accordion value="fifth">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.friday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[4]}</div>
					</ion-accordion>
					<ion-accordion value="sixth">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.saturday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[5]}</div>
					</ion-accordion>
					<ion-accordion value="seventh">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.sunday')}</ion-label>
						</ion-item>
						<div class="formatted-menu-acc" slot="content">{@html cafeteriaData[6]}</div>
					</ion-accordion>
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
	
	h2 {
		color: var(--ion-color-medium);
		justify-self: center;
	}
	
	.meal-slide {
		/* padding: 1.25rem 1.5rem; */
		height: auto;
		box-sizing: border-box;
		width: 100%;
		max-width: 600px;
		margin: 0.7rem 0.7rem;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		border-radius: 12px;
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
		max-width: 600px;
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
