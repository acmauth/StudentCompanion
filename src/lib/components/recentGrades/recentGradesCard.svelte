<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';
    import AppCard from '$shared/AppCard.svelte';
    export let subject;

    let dispatch = createEventDispatcher();
    let card;

    onMount(() => {
      card = document.querySelector(`.grade-card-${subject.courseExam.id}`);
    });

    // delete card
    const handleDelete = (id) => {
        dispatch('delete-card', id);
    }

    let startX;

    // event that happens when the user touches a card
    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
        card.style.transition = 'none';
    }

    // swipe motion when user moves the card
    function handleTouchMove(event) {
        const currentX = event.touches[0].clientX;
        const deltaX = currentX - startX;

        card.style.transform = `translateX(${deltaX}px)`;
    }

    // delete the card after the card crosses a certain point left or right
    function handleTouchEnd(event) {
      const endX = event.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (deltaX < -100) {
          // Swipe left, smoothly transition to the left
          card.style.transition = 'transform 0.3s ease';
          card.style.transform = `translateX(-100%)`;
          
          // Trigger delete after the transition is complete
          setTimeout(() => {
              handleDelete(subject.courseExam.id);
              resetCardTransform();
          }, 300);
      }else if (deltaX > 100){
        // Swipe right, smoothly transition to the right
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = `translateX(100%)`;
          
          // Trigger delete after the transition is complete
          setTimeout(() => {
              handleDelete(subject.courseExam.id);
              resetCardTransform();
          }, 300);
      }else {
            // Reset position if not swiped far enough
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = 'translateX(0)';
        }
    }

    function resetCardTransform() {
        card.style.transition = 'none';
        card.style.transform = 'translateX(0)';
    }

</script>


<ion-card href={`/courses/${subject.course.id}`} class="grade-card grade-card-{subject.courseExam.id}" on:touchstart={handleTouchStart} on:touchmove={handleTouchMove} on:touchend={handleTouchEnd}>
  <ion-item lines="none" class="ion-no-padding">
      <div class="containerFlex">
        <div class="titlesFlex">
          <ion-label class="ion-text-wrap courseTitle">{subject.course.name}</ion-label>
          <ion-label class="subjectID">{subject.course.id}</ion-label>
        </div>
        {#if subject.examGrade * 10 >= 5}
        <ion-text class="success gradeNumber">
          <h2>{subject.formattedGrade}</h2>
        </ion-text>
      {:else}
        <ion-text class="danger gradeNumber">
          <h2>{subject.formattedGrade}</h2>
        </ion-text>
      {/if}
    </div>
  </ion-item>
</ion-card>


<style>

    .gradeNumber h2{
      margin: 0 !important;
    }

    .containerFlex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 100%;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: bold;
    }


    .courseTitle {
      font-size: 1rem;
    }

    .grade-card {
        margin: 0;
        padding: 1rem;
        transition: transform 0.3s ease;
    }

    .success {
      color: var(--app-color-green-dark);
    }

    .danger {
      color: var(--app-color-orange-dark);
    }

    .subjectID{
      font-size: 0.8rem;
      color: grey
    }

</style>