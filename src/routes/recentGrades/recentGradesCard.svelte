<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';
    // import { IonIcon } from '@ionic/react';
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

<ion-card class="grade-card grade-card-{subject.courseExam.id}" href={`/courses/${subject.course.id}`} on:touchstart={handleTouchStart} on:touchmove={handleTouchMove} on:touchend={handleTouchEnd}>
  <ion-card-content>  
    <div style="display:flex; flex-direction: row;justify-content: space-between;">

        <ion-label class="ion-text-wrap">{subject.course.name}</ion-label>
        {#if subject.examGrade * 10 >= 5}
          <ion-text class="ion-padding-left ion-padding-start" color="success">
            <h2>{subject.formattedGrade}</h2>
          </ion-text>
        {:else}
          <ion-text class="ion-padding-left ion-padding-start" color="danger">
            <h2>{subject.formattedGrade}</h2>
          </ion-text>
        {/if}

      </div>
      <ion-label>{subject.course.id}</ion-label>
  </ion-card-content>
</ion-card>



<style>
    .grade-card {
        border-radius: 15px;
        position: relative;
        transition: transform 0.3s ease;
        touch-action: pan-x; /* Allow horizontal panning */
    }

    .grade-card.swiping {
        pointer-events: none; /* Ignore pointer events during swipe */
    }

</style>