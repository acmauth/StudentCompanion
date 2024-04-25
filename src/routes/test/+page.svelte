<script lang="ts">
	import { onMount } from 'svelte';
  import { register } from 'swiper/element/bundle';
  import { getDayByIndex } from '$lib/components/schedule/day/days';
  register();

  let openDates: Date[] = [];

  function generateCalendarDates(year: number, month: number, day: number) {
    const firstDate = new Date(year, month, day - 3);
    const lastDate = new Date(year, month, day + 3);
    const i = new Date(firstDate);

    $: openDates = [];
    while (i <= lastDate) {
      $: openDates.push(new Date(i));
      i.setDate(i.getDate() + 1);
    }
  }

  onMount(() => {
    const today = new Date();
    generateCalendarDates(today.getFullYear(), today.getMonth(), today.getDay());

    const swiperEl = document.querySelector('swiper-container');
    
    swiperEl.addEventListener('swiperslidechangetransitionend', (event) => {
      let offset: number = 1;
      if(swiperEl.swiper.swipeDirection == "next")
        offset = -1;
      generateCalendarDates(openDates[offset].getFullYear(), openDates[+ offset].getMonth(), openDates[3 + offset].getDay());
    });

  });
  

</script>

<ion-content>  
<swiper-container on:swipe{handleSwipe} slides-per-view="5" speed="500" mousewheel-force-to-axis="true" loop="false">
  {#each openDates as date}
    <swiper-slide id="day-{date.getDay()}">
      <ion-card>
          <ion-card-header>
              <ion-card-title>{getDayByIndex(date.getDay(), 'el', true, 3)}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{date.getDate()}</p>
          </ion-card-content>
      </ion-card>
    </swiper-slide>
    {/each}
  <!-- <swiper-slide id="day-0">
    <ion-card>
        <ion-card-header>
            <ion-card-title>Κυρ</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        </ion-card-content>
    </ion-card>
</swiper-slide>  
  <swiper-slide id="day-1">
      <ion-card>
          <ion-card-header>
              <ion-card-title>Δευ</ion-card-title>
          </ion-card-header>
          <ion-card-content>
          </ion-card-content>
      </ion-card>
  </swiper-slide>
  <swiper-slide id="day-2">
      <ion-card>
          <ion-card-header>
              <ion-card-title>Τρι</ion-card-title>
          </ion-card-header>
          <ion-card-content>
          </ion-card-content>
      </ion-card>
  </swiper-slide>
  <swiper-slide id="day-3">
    <ion-card>
        <ion-card-header>
            <ion-card-title>Τετ</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        </ion-card-content>
    </ion-card>
</swiper-slide>
<swiper-slide id="day-4">
  <ion-card>
    <ion-card-header>
        <ion-card-title>Πεμ</ion-card-title>
    </ion-card-header>
    <ion-card-content>
    </ion-card-content>
</ion-card>
</swiper-slide>
<swiper-slide id="day-5">
<ion-card>
  <ion-card-header>
      <ion-card-title>Παρ</ion-card-title>
  </ion-card-header>
  <ion-card-content>
  </ion-card-content>
</ion-card>
</swiper-slide>
<swiper-slide id="day-6">
  <ion-card>
      <ion-card-header>
          <ion-card-title>Σαβ</ion-card-title>
      </ion-card-header>
      <ion-card-content>
      </ion-card-content>
  </ion-card>
</swiper-slide> -->
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
</style>