<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Chip from "$components/shared/ChipGuide.svelte";
	import { register } from 'swiper/element/bundle';
  
	// Image imports
	import intro from '$lib/assets/guide_graphics/intro.png'; 
	import cafeteria from '$lib/assets/guide_graphics/cafeteria.png';
	import campusMap from '$lib/assets/guide_graphics/campus map.png';
	import gym from '$lib/assets/guide_graphics/gym.png';
	import grades from '$lib/assets/guide_graphics/grades.png';
	import stats from '$lib/assets/guide_graphics/stats.png'; 
	import notifications from '$lib/assets/guide_graphics/notifications.png'; 
	import calendar from '$lib/assets/guide_graphics/calendar.png'; 
	import darkmode from '$lib/assets/guide_graphics/darkmode.png';
	import { t } from "$lib/i18n";
  
	let currentSlide = 0;
  
	const slides = [
	  { id: 1, title: $t("guide.welcome"), content: $t("guide.welcome_content"), image: intro },
	  { id: 2, title: $t("guide.food"), content: $t("guide.food_content"), image: cafeteria },
	  { id: 3, title: $t("guide.map"), content: $t("guide.map_content"), image: campusMap },
	  { id: 4, title: $t("guide.functions"), content: $t("guide.functions_content"), image: gym },
	  { id: 5, title: $t("guide.degree"), content: $t("guide.degree_content"), image: grades }, 
	  { id: 6, title: $t("guide.exams"), content: $t("guide.exams_content"), image: stats }, 
	  { id: 7, title: $t("guide.announcements"), content: $t("guide.announcements_content"), image: notifications }, 
	  { id: 8, title: $t("guide.calendar"), content: $t("guide.calendar_content"), image: calendar }, 
	  { id: 9, title: $t("guide.unique"), content: $t("guide.unique_content"), image: darkmode }, 
	];
  
   let swiperEl: any;
	onMount(() => {
		const params = {
			injectStyles: [`
			.swiper-pagination {
				position:relative;padding-top: 10px;
				--swiper-pagination-bullet-inactive-color: grey;
				--swiper-pagination-bullet-inactive-opacity: 0.8;
			} 
		`],
		}

		Object.assign(swiperEl, params);
		swiperEl.initialize();
	});
  
	function changeSlide(){
	  currentSlide = swiperEl.swiper.activeIndex;
	}
  
	function dismiss() {
	  goto("/pages/homepage");
	}
	
	register(); 
  </script>
  
<ion-content fullscreen>
	<div class="page-contents">
		<swiper-container init="false" bind:this={swiperEl} pagination="true" on:swiperslidechange={changeSlide} style="">
			{#each slides as slide}
				<swiper-slide> 
					<div class="image-placeholder">
						<img src={slide.image} alt="Slide {slide.id} image">
					</div>
				</swiper-slide> 
			{/each}
		</swiper-container>

		<div class="guide-navigation"> 
			{#key currentSlide}
				<h1 class="title-of-slide">{slides[currentSlide].title}</h1>
				<p class="ion-text-center">
					{slides[currentSlide].content}
				</p>
				{#if currentSlide == 8}
					<Chip id="next-button" text={$t("guide.finished")} flip={dismiss} />
				{:else}
					<Chip id="next-button" text={$t("guide.next")} flip={() => swiperEl.swiper.slideNext()} />
					<ion-button class="unstyled-button" on:click={dismiss} role="button" aria-label="Dismiss guide"><u>{$t("guide.skip")}</u></ion-button>
				{/if}
			{/key}
		</div> 
	</div>
</ion-content>
		
<style>

	.page-contents {
		position:absolute;
		bottom:0;
		width: 100%;
	}
			
	.title-of-slide {
		color: #292929;
		font-weight: 700;
		font-size: 32px;
		margin: 0;
		text-align: center; 
    	display: flex;
    	justify-content: center; 
    	flex-wrap: wrap;
	}
			
	:global(body.dark) .title-of-slide {
	  color: white;

	}
  
  
	.image-placeholder img {
	  width: 100%;
	  height: auto;
	  object-fit: cover;
	  display: block; 
	}
  
	.unstyled-button {
	  --background: none;
	  --background-activated: none;
	  --background-focused: none;
	  --background-hover: none;
	  --box-shadow: none;
	  --border-radius: 0;
	  --padding-start: 0;
	  --padding-end: 0;
	  --padding-top: 0;
	  --padding-bottom: 0;
	  --border-width: 0;
	  --border-style: none;
	  --border-color: transparent;
	  color: grey;
	  text-transform: none;
	  --font-size: inherit;
	  --line-height: inherit;
	  --ion-button-background: none;
	}

  
	.guide-navigation {
	  padding: 0rem 1rem 0rem 1rem; 
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  width: 100%;
	  gap: 10px;
	}
	
	</style>
