<script context="module" lang="ts">
	let onTop: null;   //keeping track of which open modal is on top

	let modal: { open: () => void; close: () => void; };
	
	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(){
		return modal;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<script lang="ts">
  import VectorGreece from "$lib/components/language/Greece.svg"
  import VectorUSA from "$lib/components/language/USA.svg"

  import { changeLocale } from '$lib/i18n';

  function flagClick(this: any)
  {
    document.cookie = `lang=${this.id};` // for some reason, homepage will go to default locale without this line.
    changeLocale(this.id); // use '$locale' to get the current locale
    close();
  }
    
  let topDiv: HTMLDivElement;
  let visible = false;
  let prevOnTop: any;

  /**  API **/
  function open(){
    if (visible) return;
    prevOnTop = onTop;
    onTop = topDiv;
    
    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow="hidden";

    visible=true;
    //Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
    document.body.appendChild(topDiv);
  }
    
  function close(){
    onTop = prevOnTop;
    if (onTop == null) document.body.style.overflow = "";
    visible = false;
  }
    
  //expose the API
  modal = {open,close};

    
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
	<div id='modal' on:click|stopPropagation={() => {}}>
		<svg id="close" on:click={() => close()} viewBox="0 0 12 12">
			<circle cx=6 cy=6 r=6 />
			<line x1=3 y1=3 x2=9 y2=9 />
			<line x1=9 y1=3 x2=3 y2=9 />
		</svg>
    
		<div id = "flags">
      <div class = "flag-container" id = "el" on:click={flagClick}>
        <img src={VectorGreece} alt="Greece">
        <p class = "flag-name">Ελληνικά</p>
      </div>
    
      <div class = "flag-container" id = "en" on:click={flagClick}>
        <img src={VectorUSA} alt="USA">
        <p class = "flag-name">English (US)</p>
      </div>
    
    </div>
	</div>
</div>


<style>
	#topModal {
		visibility: hidden;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #4448;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	#modal {
    margin-inline: 2.5em;
		position: relative;
		border-radius: 1rem;
		background: rgb(255, 255, 255);
		padding: em;
	}

	.visible {
		visibility: visible !important;
	}

	#close {
		position: absolute;
		top: -0.8rem;
		right: -0.8rem;
		width: 1.8rem;
		height: 1.8rem;
		cursor: pointer;
		fill:#F44;
    filter: drop-shadow(0rem 0rem 1em rgba(255, 0, 0, 0.12))
	}

	#close line {
		stroke:#FFF;
		stroke-width: 0.12em;
	}

  :global(body.dark) #modal {
    background: #1A1A1A;
  }
	
  #flags{
    margin-top: 1.5em;
    margin-inline: -1.5em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .flag-container{
    width: 35%;
    margin-inline: 0.75em;
  }

  .flag-name{
    text-align: center;
    margin-top: 0.2em;
  }

  :global(body.dark) .flag-name {
    color: #FFF;
  }

</style>