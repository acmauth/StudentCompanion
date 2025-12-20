<script lang="ts">
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	import { getDayByIndex } from '$lib/components/schedule/day/days';
	import { t, locale, locales, getLocale } from '$lib/i18n';
	register();

    let previousWeek;
    let currentWeek;
    let nextWeek;
    let weeks: Date[] = [];
    let swiperActiveIndex: number;
    export let activeDate: Date;
    let swiperEl: any;
    let isProgrammaticUpdate = false;

    // Watch for external changes to activeDate and update swiper
    $: if (swiperEl && activeDate) {
        updateSwiperToDate(activeDate);
    }

    function updateSwiperToDate(date: Date) {
        if (!swiperEl) return;
        
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        // Find if the date exists in current weeks
        let dateIndex = weeks.findIndex((d) => d.getTime() === targetDate.getTime());
        let weeksWereRebuilt = false;
        
        if (dateIndex === -1) {
            // Date not in current weeks, rebuild weeks around the new date
            weeks = getPreviousWeekDates(targetDate).concat(getWeekDates(targetDate)).concat(getNextWeekDates(targetDate));
            dateIndex = weeks.findIndex((d) => d.getTime() === targetDate.getTime());
            weeksWereRebuilt = true;
        } else if (dateIndex <= 10 || dateIndex >= weeks.length - 10) {
            // Date exists but we're near the edge - expand the weeks proactively
            const currentWeeks = [...weeks];
            weeks = getPreviousWeekDates(weeks[dateIndex]).concat(getWeekDates(weeks[dateIndex])).concat(getNextWeekDates(weeks[dateIndex]));
            // Find the new index after expansion
            dateIndex = weeks.findIndex((d) => d.getTime() === targetDate.getTime());
            weeksWereRebuilt = true;
        }
        
        if (dateIndex !== -1 && dateIndex !== swiperActiveIndex) {
            // Set flag to prevent event handler from overwriting our update
            isProgrammaticUpdate = true;
            // Update the active index first to trigger reactivity
            swiperActiveIndex = dateIndex;
            // Use instant slide (0ms) if weeks were rebuilt to avoid visual glitch
            // Use smooth transition (300ms) for normal date changes
            const slideSpeed = weeksWereRebuilt ? 0 : 300;
            swiperEl.swiper.slideTo(dateIndex, slideSpeed, false);
            // Reset flag after a short delay
            setTimeout(() => {
                isProgrammaticUpdate = false;
            }, 350);
        }
    }


	function getWeekDates(inputDate: Date): Date[] {
		const currentDate = new Date(inputDate);
		const currentDayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
		const diff = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Calculate difference to Monday
		const firstDayOfWeek = new Date(currentDate);
		firstDayOfWeek.setDate(firstDayOfWeek.getDate() - diff);
		firstDayOfWeek.setHours(0, 0, 0, 0);

		const weekDates: Date[] = [];
		for (let i = 0; i < 7; i++) {
			const tempDate = new Date(firstDayOfWeek);
			tempDate.setDate(tempDate.getDate() + i);
			tempDate.setHours(0, 0, 0, 0);
			weekDates.push(tempDate);
		}
		return weekDates;
	}

	function getNextWeekDates(inputDate: Date): Date[] {
		const currentDate = new Date(inputDate);
		const nextWeekDate = new Date(currentDate);
		nextWeekDate.setDate(nextWeekDate.getDate() + 7);
		nextWeekDate.setHours(0, 0, 0, 0);
		return getWeekDates(nextWeekDate);
	}

	function getPreviousWeekDates(inputDate: Date): Date[] {
		const currentDate = new Date(inputDate);
		const previousWeekDate = new Date(currentDate);
		previousWeekDate.setDate(previousWeekDate.getDate() - 7);
		previousWeekDate.setHours(0, 0, 0, 0);
		return getWeekDates(previousWeekDate);
	}

	onMount(() => {
		activeDate = new Date();
		const today = new Date(new Date().setHours(0, 0, 0, 0));
		currentWeek = getWeekDates(today);
		nextWeek = getNextWeekDates(today);
		previousWeek = getPreviousWeekDates(today);

		weeks = previousWeek.concat(currentWeek).concat(nextWeek);

		const swiperEl = document.querySelector('swiper-container');
		// Set the active index to today's date
		swiperEl?.swiper.slideTo(
			weeks.findIndex((date) => {
				return date.getTime() === new Date(today).getTime();
			}),
			0,
			false
		);
		swiperActiveIndex = swiperEl?.swiper.activeIndex || 11;
		activeDate = weeks[swiperActiveIndex];


        swiperEl.addEventListener('swiperslidechange', (event) => {
          // Skip this event if it was triggered by our programmatic update
          if (isProgrammaticUpdate) return;
          
          const activeIndex = swiperEl?.swiper.activeIndex || 11;
          swiperActiveIndex = activeIndex;
          activeDate = weeks[swiperActiveIndex];

          const currentWeeks = [...weeks];
          const currentIndexDate = new Date(weeks[activeIndex]);
          
          // Update the weeks list more proactively - trigger when getting close to edges (10 from start or end)
          // This prevents users from seeing empty space
          if (activeIndex <= 10 || activeIndex >= weeks.length - 10) {
              weeks = getPreviousWeekDates(weeks[activeIndex]).concat(getWeekDates(weeks[activeIndex])).concat(getNextWeekDates(weeks[activeIndex]));
          
              // If the weeks list is updated, it means that the user has changed the week. So the current selected date has a new position in the list.
              // We need to find the new position of the current selected date and update the swiper's active slide's index.
              if (JSON.stringify(currentWeeks) !== JSON.stringify(weeks)) {
              swiperEl.swiper.slideTo(weeks.findIndex((date) => { return date.getTime() === currentIndexDate.getTime();}), 0, false);
              }
          }
        });

			swiperEl.addEventListener('swipertap', (event) => {
				const clickedIndex = swiperEl?.swiper.clickedIndex;
				if (clickedIndex && clickedIndex >= 0 && clickedIndex < weeks.length)
					swiperEl.swiper.slideTo(swiperEl?.swiper.clickedIndex);
			});
		} else {
			console.error('Swiper element not found');
		}
	});
</script>

<swiper-container
	slides-per-view="auto"
	space-between="5"
	speed="500"
	mousewheel-force-to-axis="true"
	centered-slides="true"
	initial-slide="11"
>
	{#each weeks as date, i}
		<swiper-slide class={i == swiperActiveIndex ? 'active' : ''}>
			<ion-card class={i == swiperActiveIndex ? 'active' : ''}>
				<ion-card-header>
					<ion-card-title class={i == swiperActiveIndex ? 'active' : ''}>
						{getDayByIndex(date.getDay(), getLocale(), true, 3)}
					</ion-card-title>
				</ion-card-header>
				<ion-card-content>
					{date.getDate() + '/' + (date.getMonth() + 1)}
				</ion-card-content>
			</ion-card>
		</swiper-slide>
	{/each}
</swiper-container>

<style>
	ion-card-content {
		padding-top: 0;
	}

	ion-card-title {
		font-size: 1rem;
		align-self: center;
		padding-bottom: 0;
	}
	ion-card * {
		padding: 1px;
		margin-inline: 4px;
		box-shadow: none;
	}

	ion-card {
		padding: 5px;
		margin-inline: 4px;
		margin-block: 8px;
		box-shadow: none;
		background-color: var(--ion-color-light);
	}

	ion-card.active {
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.12);
		background-color: var(--ion-color-white);
	}

	swiper-container {
		width: 100%;
		overflow: visible;
	}
	swiper-slide {
		text-align: center;
		width: 5rem !important;
		box-shadow: 0;
	}

	ion-card-title.active {
		color: var(--app-color-primary-dark);
	}
</style>
