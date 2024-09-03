<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Chip from "$components/shared/ChipGuide.svelte";
	import { register } from 'swiper/element/bundle';
	import { Navigation, Pagination } from 'swiper/modules';
  
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
  
	let swiperInstance;
	let modalElement: any;
	let currentSlide = 0;
  
	const slides = [
	  { id: 1, title: "Καλώς σε βρήκαμε", content: "Καλώς όρισες στο Aristomate! Σου έχουμε ετοιμάσει έναν σύντομο οδηγό για να σου δείξουμε όλες τις λειτουργίες της εφαρμογής!", image: intro },
	  { id: 2, title: "Πεινάωωω", content: "Δες το ωράριο και το μενού της φοιτητικής λέσχης και ενημερώσου για τα γεύματα που θα έχει τις επόμενες μέρες", image: cafeteria },
	  { id: 3, title: "Είμαι ο Χάρτης!", content: "Διάλεξη σε ξένη σχολή; Μην αγχώνεσαι! Βρες εύκολα τις αίθουσες στα διάφορα κτίρια της πανεπιστημιούπολης!", image: campusMap },
	  { id: 4, title: "Όλα στο χέρι σου", content: "Πρόσθεσε ψηφιακά το πάσο σου για να το έχεις πάντα μαζί σου! Κανόνισε τις επόμενες προπονήσεις σου αμέσως!", image: gym },
	  { id: 5, title: "Πτυχίο θα πάρεις;", content: "Τσέκαρε την πρόοδό σου σε κάθε εξάμηνο και πρόβλεψε τον Μ.Ο. σου πριν ακόμη βαθμολογηθεί το μάθημα!", image: stats }, 
	  { id: 6, title: "Το πέρασες;", content: "Ρίξε μια ματιά στους βαθμούς σου και τα στατιστικά των μαθημάτων που πέρασες ή κόπηκες!", image: grades }, 
	  { id: 7, title: "Κράτα επαφή", content: "Μη χάνεις τις τελευταίες ανακοινώσεις της γραμματείας ή των καθηγητών σου, τσεκάροντας τις ειδοποιήσεις σου!", image: notifications }, 
	  { id: 8, title: "Μην πιστολιάσεις", content: "Οργάνωσε το πρόγραμμα των διαλέξεων και τα deadlines των εργασιών σου για να μη χάνεις τίποτα!", image: calendar }, 
	  { id: 9, title: "Κάνε το δικό σου", content: "Dark ή light mode; Σουβλάκι ή Καλαμάκι; Δημητριακά πριν ή μετά το γάλα; Αντιπαραθέσεις αιώνων (μάλλον), πλέον μπορείς εσύ να διαλέξεις!", image: darkmode }, 
	];
  
   let swiperEl: any;
	onMount(() => {
		const params = {
			injectStyles: [`.swiper-pagination {position:relative;padding-top: 10px;}`],
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
  
<ion-content>
		
		<swiper-container init="false" bind:this={swiperEl} pagination="true" on:swiperslidechange={changeSlide}>
			{#each slides as slide}
			<swiper-slide> 
				<div class="image-placeholder">
					<img src={slide.image} alt="Slide {slide.id} image">
				</div>
			</swiper-slide> 
			{/each}
			
		</swiper-container> 
		{#key currentSlide}
			<div class="guide-navigation"> 
					<h1 class="title-of-slide">{slides[currentSlide].title}</h1>
					<p class="ion-text-center">
						{slides[currentSlide].content}
					</p>
				{#if currentSlide == 8}
					<Chip id="next-button" text="Φύγαμε" flip={dismiss} />
				{:else}
					<Chip id="next-button" text="Επόμενο" flip={() => swiperEl.swiper.slideNext()} />
					<ion-button class="unstyled-button" on:click={dismiss} role="button" aria-label="Dismiss guide"><u>Κομπλέ, τα ξέρω</u></ion-button>
				{/if}
			</div> 
		{/key}
</ion-content>
  
  <style>
	.modal-content {
	  text-align: center;
	  padding: 0;
	}
  
	.swiper-container {
	  width: 100%;
	  height: auto;
	}
  
	.swiper-slide {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
  
	.title-of-slide {
	  color: #292929;
	  font-weight: 700;
	  font-size: 32px;
	  margin: 0;
	}
  
	:global(body.dark) .title-of-slide {
	  color: white;
	}
  
	.image-placeholder {
	  margin: 0; /* Remove any margins */
	  padding: 0; /* Remove any paddings */
	  width: 100%;
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
  
	@media (max-height: 780px) {
	  .guide-navigation {
		font-size: 15px;
		padding: 5px 10px 0px 10px;
	  }
  
	  .title-of-slide {
		font-size: 24px;
	  }
  
	  .image-placeholder img {
		height: 60vh;
	  }
   }
  </style>
