<script>
/**
	 * @type {boolean}
	 */
 export let flip;
 /**
	 * @type {any}
	 */
  export let text;
 /**
	 * @type {any}
	 */
  export let chipIcon;

</script>

<ion-chip on:click={flip} class="chip" aria-hidden>
	<div class="chipFlex">
	{text}
	</div>
	
</ion-chip>


<style>

ion-icon {
	font-size: 1rem;

}

.chipFlex {
		display: flex;
		gap: 0.2rem;
		align-items: center;
		font-size: 1.3rem;
		margin: 0.2rem;
}


.chip {
	margin-top: 1.5rem;
	background-color: var(--app-color-degree-chip);	
	color: var(--app-color-degree-chip-text);
	border: 2px solid var(--app-color-degree-chip);	
	font-weight: 700;
	box-shadow: var(--shadow-sm);

}

</style>
