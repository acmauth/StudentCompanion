<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Chip from "$components/shared/ChipGuide.svelte";

  // Image imports
  import intro  from '$lib/assets/guide_graphics/intro.png'; 
  import cafeteria from '$lib/assets/guide_graphics/cafeteria.png';
  import campusMap from '$lib/assets/guide_graphics/campus map.png';
  import gym from '$lib/assets/guide_graphics/gym.png';
  import grades from '$lib/assets/guide_graphics/grades.png'
  import stats from '$lib/assets/guide_graphics/stats.png'; 
  import notifications from '$lib/assets/guide_graphics/notifications.png'; 
  import calendar from '$lib/assets/guide_graphics/calendar.png'; 
  import darkmode from '$lib/assets/guide_graphics/darkmode.png'

  let modalElement;
  let currentSlide = 0; 

  const slides = [
    { id: 1, title: "Καλώς σε βρήκαμε", content: "Καλώς όρισες στο Aristomate! Σου έχουμε ετοιμάσει έναν σύντομο οδηγό για να σου δείξουμε όλες τις λειτουργέιες της εφαρμογής!", image: intro },
    { id: 2, title: "Πεινάωωω", content: "Δες το ωράριο και το μενού της φοιτητικής λέσχης και ενημερώσου για τα γεύματα που θα έχει τις επόμενες μέρες", image: cafeteria },
    { id: 3, title: "Είμαι ο Χάρτης!", content: "Διάλεξη σε ξένη σχολή; Μην αγχώνεσαι! Βρες εύκολα τις αίθουσες στα διάφορα κτίρια της πανεπιστημιούπολης!", image: campusMap },
    { id: 4, title: "Όλα στο χέρι σου", content: "Πρόσθεσε ψηφιακά το πάσο σου για να το έχεις πάντα μαζί σου!  Κανόνισε τις επόμενες προπονήσεις σου αμέσως!", image: gym },
    { id: 5, title: "Πτυχίο θα πάρεις;", content: "Τσέκαρε την πρόοδό σου σε κάθε εξάμηνο και πρόβλεψε τον Μ.Ο. σου πριν ακόμη βαθμολογηθεί το μάθημα!", image: stats }, 
    { id: 6, title: "Το πέρασες;", content: "Ρίξε μια ματιά στους βαθμούς σου και τα στατιστικά των μαθημάτων που πέρασες ή κόπηκες!", image: grades }, 
    { id: 7, title: "Κράτα επαφή", content: "Μη χάνεις τις τελευταίες ανακοινώσεις της γραμματείας ή των καθηγητών σου, τσεκάροντας τις ειδοποιήσεις σου!", image: notifications }, 
    { id: 8, title: "Μην πιστολιάσεις", content: "Οργάνωσε το πρόγραμμα των διαλέξεων και τα deadlines των εργασιών σου για να μη χάνεις τίποτα!", image: calendar }, 
    { id: 9, title: "Κάνε το δικό σου", content: "Dark ή light mode; Σουβλάκι ή Καλαμάκι; Δημητριακά πριν ή μετά το γάλα; Αντιπαραθέσεις αιώνων (μάλλον), πλέον μπορείς εσύ να διαλέξεις!", image: darkmode }, 
  ];

  onMount(() => {
    modalElement.present();
    console.log(currentSlide.image)
  });

  function changeSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
  }

  function dismiss() {
    modalElement.dismiss();
    goto("/pages/homepage");
  }
</script>

<ion-modal bind:this={modalElement}>
  <div class="modal-content">

  <div class="image-placeholder">
    <img src={slides[currentSlide].image} alt="Error loading image">
  </div>
  
  <div class="dots">
    {#each slides as slide, index (slide.id)}
      <div
        class="dot"
        class:selected={index === currentSlide}
        on:click={() => (currentSlide = index)}
      ></div>
    {/each}
  </div>

  <div class="carousel">
      {#each slides as slide, index (slide.id)}
        <div class="slide" id={'slide' + slide.id} class:selected={index === currentSlide}>
          <h1 class="title-of-slide">{slide.title}</h1>
          <br>
          {slide.content}
        </div>
      {/each}
    </div>

   <div class="guide-navigation"> 
    {#if currentSlide == 8}
    	<Chip id="next-button" text="Φύγαμε" flip = {dismiss} />
    {:else}
    	<Chip id="next-button" text="Επόμενο" flip = {changeSlide} />
        <ion-button class="unstyled-button" on:click={dismiss}><u>Κομπλέ, τα ξέρω</u></ion-button>
    {/if}
   </div> 

  </div>
</ion-modal>

<style>
  .modal-content {
    text-align: center;
  }

  .title-of-slide{
    color: #292929;  
    font-weight: 700; 
    font-size: 32px;
    margin: 0px; 
  }

  :global(body.dark) .title-of-slide{
    color: white; 
  }

  .image-placeholder{
    margin-bottom: 2%; 
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

  .slide {
    align-self: flex-center; 
    min-width: 100%;
    text-align: center;
    padding: 5%;
    box-sizing: border-box;
    opacity: 0.8;
    display: none;
  }

  .slide.selected {
    display: block;
    opacity: 1;
    animation: fadeInOut 0.5s ease-in-out forwards;
  }

   .dots { 
    display: flex;
    justify-content: center; 
    align-items: flex-end; 
    margin-top: auto; 
  }

  .dot {
    width: 2.5vw;
    height: 2.5vw;
    border-radius: 50%;
    margin: 0 5px;
    background-color: var(--ion-color-medium); /* Inactive dot color */
    cursor: pointer;
  }

  .dot.selected {
    background-color: var(--ion-color-primary); /* Active dot color */
  }

  .guide-navigation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;
  }
</style>

