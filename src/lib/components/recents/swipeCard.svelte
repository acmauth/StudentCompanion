<script lang="ts">
  interface Props {
    id: number;
    /** Called with the card's id once it has been swiped away */
    onDeleteCard?: (id: number) => void;
    children?: import('svelte').Snippet;
  }

  let { id, onDeleteCard, children }: Props = $props();

    let card: HTMLElement | undefined = $state();

    const SWIPE_THRESHOLD = 50;
    const DIRECTION_LOCK_THRESHOLD = 10;
    const SWIPE_TRANSITION_MS = 300;

    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    // `card` is bound via bind:this; the touch handlers only run once it exists, the guards satisfy TypeScript
    function handleTouchStart(event: TouchEvent) {
        if (!card) return;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        card.style.transition = "none";
    }

    // swipe motion as the user moves the card
    function handleTouchMove(event: TouchEvent) {
        if (!card) return;
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Only allow horizontal swipes if the horizontal movement is greater than vertical movement
        if (absDeltaX > absDeltaY && absDeltaX > DIRECTION_LOCK_THRESHOLD) {
            card.style.transform = `translateX(${deltaX}px)`;
        } else {
            isScrolling = true;
            card.style.transition = "none";
            card.style.transform = "translateX(0)";
        }
    }

    // delete the card once it crosses the swipe threshold, otherwise snap back
    function handleTouchEnd(event: TouchEvent) {
        if (!card) return;
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (isScrolling) {
            card.style.transition = "none";
            card.style.transform = "translateX(0)";
        } else if (deltaX < -SWIPE_THRESHOLD) {
            dismissCard(-100);
        } else if (deltaX > SWIPE_THRESHOLD) {
            dismissCard(100);
        } else {
            card.style.transition = "transform 0.3s ease";
            card.style.transform = "translateX(0)";
        }

        isScrolling = false;
    }

    function dismissCard(directionPercent: -100 | 100) {
        if (!card) return;
        card.style.transition = "transform 0.3s ease";
        card.style.transform = `translateX(${directionPercent}%)`;

        setTimeout(() => {
            onDeleteCard?.(id);
            resetCardTransform();
        }, SWIPE_TRANSITION_MS);
    }

    function resetCardTransform() {
        if (!card) return;
        card.style.transition = "none";
        card.style.transform = "translateX(0)";
    }
</script>

<ion-card
    class="swipe-card"
    bind:this={card}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    href=""
  >
    {@render children?.()}
</ion-card>

<style>
  .swipe-card {
    margin: 0;
    padding: 10px 14px;
    transition: transform 0.25s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 16px !important;
    background: var(--ion-card-background, #fff);
  }
</style>
