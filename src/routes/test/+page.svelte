<script lang="ts">
	import { onMount } from 'svelte';
  import { register } from 'swiper/element/bundle';
  import { getDayByIndex } from '$lib/components/schedule/day/days';
  register();


  let previousWeek;
  let currentWeek;
  let nextWeek;
  let weeks: Date[] = [];

  function getWeekDates(inputDate: Date): Date[] {
    const currentDate = new Date(inputDate);
    const currentDayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const diff = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Calculate difference to Monday
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - diff);
    firstDayOfWeek.setHours(0,0,0,0);

    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const tempDate = new Date(firstDayOfWeek);
        tempDate.setDate(tempDate.getDate() + i);
        tempDate.setHours(0,0,0,0);
        weekDates.push(tempDate);
    }
    return weekDates;
  }

  function getNextWeekDates(inputDate: Date): Date[] {
    const currentDate = new Date(inputDate);
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    nextWeekDate.setHours(0,0,0,0);
    return getWeekDates(nextWeekDate);
  }

  function getPreviousWeekDates(inputDate: Date): Date[] {
      const currentDate = new Date(inputDate);
      const previousWeekDate = new Date(currentDate);
      previousWeekDate.setDate(previousWeekDate.getDate() - 7);
      previousWeekDate.setHours(0,0,0,0);
      return getWeekDates(previousWeekDate);
  }

  onMount(() => {
    
    currentWeek = getWeekDates(new Date());
    nextWeek = getNextWeekDates(new Date());
    previousWeek = getPreviousWeekDates(new Date());

    weeks = previousWeek.concat(currentWeek).concat(nextWeek);

    const swiperEl = document.querySelector('swiper-container');
    swiperEl.addEventListener('swiperslidechange', (event) => {
      const activeIndex = swiperEl?.swiper.activeIndex || 11;
      const currentWeeks = [...weeks];
      const currentIndexDate = new Date(weeks[activeIndex]);
      
      // Update the weeks list with the new weeks based on the active index; if the active index is between 8 and 15, the current week is the active week.
      // So, there is no need to update the weeks list. Otherwise, the active week is the previous or the next week.
      if (activeIndex <= 8 || activeIndex >= 15) {
        weeks = getPreviousWeekDates(weeks[activeIndex]).concat(getWeekDates(weeks[activeIndex])).concat(getNextWeekDates(weeks[activeIndex]));
      
        // If the weeks list is updated, it means that the user has changed the week. So the current selected date has a new position in the list.
        // We need to find the new position of the current selected date and update the swiper's active slide's index.
        if (JSON.stringify(currentWeeks) !== JSON.stringify(weeks)) {
          swiperEl.swiper.slideTo(weeks.findIndex((date) => { return date.getTime() === currentIndexDate.getTime();}), 0, false);
        }
      }
    });

  });
  

</script>

<ion-content>  
  <swiper-container slides-per-view="4.5" speed="500" mousewheel-force-to-axis="true" centered-slides="true" initial-slide="11">
      {#each weeks as date}
        <swiper-slide>
          <ion-card>
              <ion-card-header>
                  <ion-card-title>{getDayByIndex(date.getDay(), 'el', true, 3)}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                  {date.getDate()}
              </ion-card-content>
          </ion-card>      
        </swiper-slide>
    {/each}
  </swiper-container>
</ion-content>



<style>
  ion-card-title {
    font-size: 1rem;
    align-self: center;
  }
  ion-card * {
    padding: 5px;
    margin-inline: 4px;
  }
  swiper-container{
  width: 100%;
  }
  swiper-slide {
    text-align: center;
    width: auto;
  }
</style>