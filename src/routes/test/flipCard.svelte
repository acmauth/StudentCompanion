<script lang="ts">
    import AppCard from "$components/shared/AppCard.svelte";
    export let reactToHeight: boolean = false;
    
    // The flip class is what we use to toggle the flip effect.
    let flipClass = false;

    // We need to keep track of the flip container and the front
    // and back children so we can update the height of the flip card.
    let flipContainer: HTMLElement;
    let frontChild: HTMLElement;
    let backChild: HTMLElement;

    // This function updates the height of the flip card when it's toggled.
    const updateHeight = (status: Boolean) => {
        // Important, this code will run once before the flip container is defined, so we need to check it exists.
        if (flipContainer && frontChild && backChild) {
            // The height relative to the rest of the page is dictated by the main container, so we 
            // set it's height to the height of the front or back child, depending on the status of the flip.
            // So if we're flipped, use the back child, otherwise the front
            flipContainer.style.height = status ? `${backChild.clientHeight}px` : `${frontChild.clientHeight}px`;
        }
    }

    // When the flip class changes, update the height of the flip card.
    // Check if we should update the height of the flip card when it's toggled.
    // Sometimes we don't want to do this, that's why it's optional.
    $: if (reactToHeight) updateHeight(flipClass);

</script>


<div on:click={() => flipClass = !flipClass} class="flip-container" class:flipClass={flipClass} aria-hidden bind:this={flipContainer}>
    <div class="flipper">
      <div class="front" bind:this={frontChild}>
        <AppCard>
            <ion-card-header>
                <ion-card-subtitle>Student companion (test) homepage</ion-card-subtitle>
            </ion-card-header>
            <ion-text>Homepage</ion-text>
            <ion-card-content>
                Let's list here our quick page links, before we get navigation figured out
            </ion-card-content>
            <ion-button href="/loginService">Log in/Log out</ion-button>
        </AppCard>
      </div>
      <div class="back" bind:this={backChild}>
        <AppCard colour="orange">
            <ion-card-header>
                <ion-card-subtitle>SECONDDDDD Student companion (test) homepage</ion-card-subtitle>
            </ion-card-header>
            <ion-button href="/loginservice">Homepage</ion-button>
            <ion-card-content>
                Let's list here our quick page links, before we get navigation figured out
            </ion-card-content>
            <ion-button href="/loginService">Log in/Log out</ion-button>
        </AppCard>
      </div>
    </div>
</div>

<style>

.flip-container {
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -o-perspective: 1000;
  perspective: 1000;
}

.flip-container.flipClass
.flipper {
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}



.flipper {
  transition: 0.6s;
  -webkit-transition: 0.6s;
  -moz-transition: 0.6s;
  -o-transition: 0.6s;
  -ms-transition: 0.6s;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  position: relative;
}
/* hide back of pane during swap */

.front,
.back {
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
}

.front {
    position: relative;
}

.back {
    position: absolute;
    top: 0;
    left: 0;
}
/* front pane, placed above back */

.front {
  z-index: 2;
  /* for firefox 31 */
  
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
}
/* back, initially hidden pane */

.back {
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
</style>