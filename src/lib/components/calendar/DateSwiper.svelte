<script lang="ts">
    import { onMount } from 'svelte';
    import { register } from 'swiper/element/bundle';
    import { getDayByIndex } from '$lib/components/schedule/day/days';
    register();

    let previousWeek;
    let currentWeek;
    let nextWeek;
    let weeks: Date[] = [];
    let swiperActiveIndex: number;
    export let activeDate: Date;


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
        const today = new Date(new Date().setHours(0,0,0,0));
        currentWeek = getWeekDates(today);
        nextWeek = getNextWeekDates(today);
        previousWeek = getPreviousWeekDates(today);

        weeks = previousWeek.concat(currentWeek).concat(nextWeek);

        const swiperEl = document.querySelector('swiper-container');
        // Set the active index to today's date
        swiperEl?.swiper.slideTo(weeks.findIndex((date) => { return date.getTime() === new Date(today).getTime();}), 0, false);
        swiperActiveIndex = swiperEl?.swiper.activeIndex || 11;
        activeDate = weeks[swiperActiveIndex];


        swiperEl.addEventListener('swiperslidechange', (event) => {
          const activeIndex = swiperEl?.swiper.activeIndex || 11;
          swiperActiveIndex = activeIndex;
          activeDate = weeks[swiperActiveIndex];

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

        swiperEl.addEventListener('swipertap', (event) => {
        const clickedIndex = swiperEl?.swiper.clickedIndex;
        if(clickedIndex && clickedIndex>=0 && clickedIndex<weeks.length)
            swiperEl.swiper.slideTo(swiperEl?.swiper.clickedIndex);
        });

    });
</script>

<swiper-container slides-per-view="auto" space-between="5" speed="500" mousewheel-force-to-axis="true" centered-slides="true" initial-slide="11">
    {#each weeks as date, i}
        <swiper-slide class="{i==swiperActiveIndex? 'active' : ''}">
            <ion-card class="{i==swiperActiveIndex? 'active' : ''}">
                <ion-card-header>
                    <ion-card-title class="{i==swiperActiveIndex? 'active' : ''}" style="padding-bottom: 0">
                        {getDayByIndex(date.getDay(), 'el', true, 3)}
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content style="padding-top: 0;">
                    {date.getDate() + '/' + (date.getMonth()+1)}
                </ion-card-content>
            </ion-card>      
        </swiper-slide>
    {/each}
</swiper-container>


<style>
  ion-card-title {
    font-size: 1rem;
    align-self: center;
  }
  ion-card * {
    padding: 1px;
    margin-inline: 4px;
    box-shadow: none;
  }

  ion-card {
    padding: 5px;
    margin-inline: 4px;
    margin-block: 5px;
    box-shadow: none;
    background-color: var(--ion-color-light);
  }

  ion-card.active {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    /* background-color: var(--ion-color-secondary); */
    background-color: var(--ion-color-white);
  }

  swiper-container{
    width: 100%;
  }
  swiper-slide {
    text-align: center;
    width: auto;
    box-shadow: 0;
  }

  ion-card-title.active {
    color: var(--ion-color-primary);
  }
</style>