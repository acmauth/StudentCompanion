<script>
    import AppCard from "$components/shared/AppCard.svelte";

    let flipClass = false;
    function flip() {
        flipClass = !flipClass;
    }

</script>

<!-- <AppCard colour="primary">
    <h1>Flip Card</h1>
    <p>Click the button to flip the card</p>
    <button on:click>Click me</button>
</AppCard> -->

<div on:click={() => flipClass = !flipClass} class="flip-container" class:flipClass={flipClass} aria-hidden>
    <div class="flipper clearfix">
      <div class="front card item-text-wrapped">
        <div class="top">
        </div>
        <div class="icon-holder">A</div>
        <div class="padding">
          <p>Front side text</p>
        </div>
      </div>
      <div class="back card item-text-wrapped success">
        <div class="top">
        </div>
        <div class="icon-holder">B</div>
        <div class="answer padding">
          <p>back side text</p>
          <p>more back side text</p>
        </div>
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

.flip-container,
.front,
.back {
  margin-bottom: 40px;
  width: 100%;
  text-align: center;
}

.flip-container .top,
.front .top,
.back .top {
  padding: 30px 20px;
}

.flip-container .top,
.flip-container .icon-holder,
.front .top,
.front .icon-holder,
.back .top,
.back .icon-holder {
  background-color: #777777;
  color: #fff;
}

.flip-container .icon-holder,
.front .icon-holder,
.back .icon-holder {
  margin: -25px auto 0;
  border-radius: 50%;
  border: 6px solid #fff;
  width: 50px;
  height: 50px;
  padding: 7px 10px 10px;
  font-size: x-large;
}


.back.success .top,
.back.success .icon-holder {
  background-color: #23AE89;
  color: #fff;
}
/* flip speed goes here */

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