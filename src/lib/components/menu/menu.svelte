<script lang="ts">
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	const isProduction = process.env.NODE_ENV === 'production';
	import { getMenu } from '$lib/menuScraper/scraper';
	import { getMenuFromCache } from '$lib/menuScraper/menuCache';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import MenuSkeleton from './menuSkeleton.svelte';
	import { t, locale, locales, getLocale } from '$lib/i18n';
	import { formatMenuText, extractMealSection, processMenuData } from './menuUtils';

	register();

	let cafeteriaData: string[] = [];
	let breakfastData: string = '';
	let lunchData: string = '';
	let dinnerData: string = '';
	let title: string = $t('menu.todaysMenu');
	let defaultSlideIndex: number = 0;
	let isLoadingFresh = false;
	let showingCachedData = false;

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
		const menuData = await getMenu();
		
		if (typeof menuData === 'string') {
			throw new Error(menuData);
		}
		
		const processed = processMenuData(menuData as string[], today, message, color, $t);
		cafeteriaData = processed.cafeteriaData;
		breakfastData = processed.breakfastData;
		lunchData = processed.lunchData;
		dinnerData = processed.dinnerData;
		menuDate = processed.menuDate;
		if (processed.message) message = processed.message;
		if (processed.color) color = processed.color;
		
		showingCachedData = false;
	}

	// Load cached data immediately on mount
	async function loadCachedData() {
		const cachedMenu = await getMenuFromCache();
		if (cachedMenu && cachedMenu.length > 0) {
			const processed = processMenuData(cachedMenu, today, message, color, $t);
			cafeteriaData = processed.cafeteriaData;
			breakfastData = processed.breakfastData;
			lunchData = processed.lunchData;
			dinnerData = processed.dinnerData;
			menuDate = processed.menuDate;
			if (processed.message) message = processed.message;
			if (processed.color) color = processed.color;
			
			showingCachedData = true;
			return true;
		}
		return false;
	}
	
	// Initialize swiper on mount
	onMount(() => {
		// Wait for the DOM to be ready and data to be loaded
		setTimeout(() => {
			const swiperEl = document.querySelector('swiper-container') as any;
			if (swiperEl) {
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
		}, 200);
	});

</script>

<IonPage>
	<SubPageHeader title={$t('menu.title')} stackedNav />
	<ion-content class="ion-padding">
		{#await loadCachedData() then hasCachedData}
			{#if hasCachedData}
				<!-- Show cached data immediately -->
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

				<h1 class="ion-padding">
					<ion-icon icon={allIonicIcons.restaurantOutline} />
					{title}
				</h1>
				
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
									<div class="formatted-menu">{@html formatMenuText(breakfastData, false)}</div>
								</div>
							</swiper-slide>
							
							<!-- Lunch Slide -->
							<swiper-slide>
								<div class="meal-slide">
									<div class="formatted-menu">{@html formatMenuText(lunchData, false)}</div>
								</div>
							</swiper-slide>
							
							<!-- Dinner Slide -->
							<swiper-slide>
								<div class="meal-slide">
									<div class="formatted-menu">{@html formatMenuText(dinnerData, false)}</div>
								</div>
							</swiper-slide>
						</swiper-container>
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
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[0])}</div>
					</ion-accordion>
					<ion-accordion value="second">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.tuesday')}</ion-label>
						</ion-item>
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[1])}</div>
					</ion-accordion>
					<ion-accordion value="third">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.wednesday')}</ion-label>
						</ion-item>
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[2])}</div>
					</ion-accordion>
					<ion-accordion value="fourth">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.thursday')}</ion-label>
						</ion-item>
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[3])}</div>
					</ion-accordion>
					<ion-accordion value="fifth">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.friday')}</ion-label>
						</ion-item>
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[4])}</div>
					</ion-accordion>
					<ion-accordion value="sixth">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.saturday')}</ion-label>
						</ion-item>
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[5])}</div>
					</ion-accordion>
					<ion-accordion value="seventh">
						<ion-item slot="header" color="light">
							<ion-label>{$t('menu.sunday')}</ion-label>
						</ion-item>
						<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[6])}</div>
					</ion-accordion>
				</ion-accordion-group>

				<!-- Load fresh data in the background -->
				{#await getMenuData()}
					<!-- Loading fresh data -->
				{:then}
					<!-- Fresh data loaded successfully -->
				{:catch error}
					<!-- Error loading fresh data, but we still have cached data -->
				{/await}
			{:else}
				<!-- No cached data, show skeleton while loading -->
				{#await getMenuData()}
					<MenuSkeleton />
				{:then}
					<div class="ion-text-center">
						<ion-chip class="ion-padding" {color}>
							<ion-icon icon={allIonicIcons.timeOutline} /> &nbsp; {message}
						</ion-chip>
					</div>

					<h1 class="ion-padding">
						<ion-icon icon={allIonicIcons.restaurantOutline} />
						{title}
					</h1>
					
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
										<div class="formatted-menu">{@html formatMenuText(breakfastData, false)}</div>
									</div>
								</swiper-slide>
								
								<!-- Lunch Slide -->
								<swiper-slide>
									<div class="meal-slide">
										<div class="formatted-menu">{@html formatMenuText(lunchData, false)}</div>
									</div>
								</swiper-slide>
								
								<!-- Dinner Slide -->
								<swiper-slide>
									<div class="meal-slide">
										<div class="formatted-menu">{@html formatMenuText(dinnerData, false)}</div>
									</div>
								</swiper-slide>
							</swiper-container>
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
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[0])}</div>
						</ion-accordion>
						<ion-accordion value="second">
							<ion-item slot="header" color="light">
								<ion-label>{$t('menu.tuesday')}</ion-label>
							</ion-item>
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[1])}</div>
						</ion-accordion>
						<ion-accordion value="third">
							<ion-item slot="header" color="light">
								<ion-label>{$t('menu.wednesday')}</ion-label>
							</ion-item>
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[2])}</div>
						</ion-accordion>
						<ion-accordion value="fourth">
							<ion-item slot="header" color="light">
								<ion-label>{$t('menu.thursday')}</ion-label>
							</ion-item>
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[3])}</div>
						</ion-accordion>
						<ion-accordion value="fifth">
							<ion-item slot="header" color="light">
								<ion-label>{$t('menu.friday')}</ion-label>
							</ion-item>
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[4])}</div>
						</ion-accordion>
						<ion-accordion value="sixth">
							<ion-item slot="header" color="light">
								<ion-label>{$t('menu.saturday')}</ion-label>
							</ion-item>
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[5])}</div>
						</ion-accordion>
						<ion-accordion value="seventh">
							<ion-item slot="header" color="light">
								<ion-label>{$t('menu.sunday')}</ion-label>
							</ion-item>
							<div class="ion-padding formatted-menu" slot="content">{@html formatMenuText(cafeteriaData[6])}</div>
						</ion-accordion>
					</ion-accordion-group>
				{:catch error}
					<p>{error.message}</p>
				{/await}
			{/if}
		{/await}
	</ion-content>
</IonPage>

<style>
	:global(.swiper-card-content) {
		padding: 0 !important;
	}

	:global(.meal-slide) {
		padding: 16px;
		height: auto;
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
		height: auto;
	}

	:global(swiper-slide) {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		height: auto;
	}

	:global(.swiper-pagination-bullet) {
		background: var(--ion-color-primary);
	}

	:global(.formatted-menu .menu-date) {
		font-size: 1rem;
		color: var(--ion-color-secondary);
		font-weight: 500;
		text-align: center;
		margin: 0;
	}

	:global(.formatted-menu .meal-header) {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--ion-color-primary);
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		border-bottom: 2px solid var(--ion-color-primary);
		padding-bottom: 0.25rem;
	}

	:global(.formatted-menu .meal-time) {
		font-size: 0.9rem;
		color: var(--ion-color-medium);
		font-style: italic;
		margin-bottom: 1rem;
	}

	:global(.formatted-menu .category-header) {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--ion-color-secondary);
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}

	:global(.formatted-menu .selection-note) {
		font-size: 0.9rem;
		color: var(--ion-color-medium);
		margin-bottom: 0.25rem;
	}

	:global(.formatted-menu .menu-item) {
		font-size: 1rem;
		margin-bottom: 0.5rem;
		line-height: 1.5;
		padding-left: 0.5rem;
	}

	:global(.formatted-menu .breakfast-content) {
		font-size: 0.95rem;
		line-height: 1.6;
		margin-bottom: 0.5rem;
		padding-left: 0.5rem;
	}

	:global(.formatted-menu h2:first-child) {
		margin-top: 0;
	}

</style>
