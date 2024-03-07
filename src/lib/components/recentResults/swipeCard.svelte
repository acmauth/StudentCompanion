<script>
// @ts-nocheck

    import { onMount, createEventDispatcher } from "svelte";
  
    /**
     * @type number
     */
    export let id;
    /**
     * @type any
     */
    let card;
    /**
     * @type any
    */
    let startX;
    let dispatch = createEventDispatcher();

    onMount(() => {
      card = document.querySelector(`.swipe-card-${id}`);
    });
  
    // delete card
    const handleDelete = (/** @type {number} */ id) => {
      dispatch("delete-card", id);
    };
  
    /**
   * event that happens when the user touches a card
	 * @param {{ touches: { clientX: any; }[]; }} event
	 */
    function handleTouchStart(event) {
      startX = event.touches[0].clientX;
      card.style.transition = "none";
    }
  
  /**
   * swipe motion when user moves the card
	 * @param {{ touches: { clientX: any; }[]; }} event
	 */
    function handleTouchMove(event) {
      const currentX = event.touches[0].clientX;
      const deltaX = currentX - startX;
  
      card.style.transform = `translateX(${deltaX}px)`;
    }
  
  /**
   * delete the card after the card crosses a certain point left or right
	 * @param {{ changedTouches: { clientX: any; }[]; }} event
	 */
    function handleTouchEnd(event) {
      const endX = event.changedTouches[0].clientX;
      const deltaX = endX - startX;
  
      if (deltaX < -100) {
        // Swipe left, smoothly transition to the left
        card.style.transition = "transform 0.3s ease";
        card.style.transform = `translateX(-100%)`;
  
        // Trigger delete after the transition is complete
        setTimeout(() => {
          handleDelete(id);
          resetCardTransform();
        }, 300);
      } else if (deltaX > 100) {
        // Swipe right, smoothly transition to the right
        card.style.transition = "transform 0.3s ease";
        card.style.transform = `translateX(100%)`;
  
        // Trigger delete after the transition is complete
        setTimeout(() => {
          handleDelete(id);
          resetCardTransform();
        }, 300);
      } else {
        // Reset position if not swiped far enough
        card.style.transition = "transform 0.3s ease";
        card.style.transform = "translateX(0)";
      }
    }
  
    function resetCardTransform() {
      card.style.transition = "none";
      card.style.transform = "translateX(0)";
    }
  </script>
  
<ion-card
    class="swipe-card swipe-card-{id}"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    <slot></slot>
</ion-card>
  
  <style>
    .swipe-card {
      margin: 0;
      padding: 1rem;
      transition: transform 0.3s ease;
    }
  </style>
  