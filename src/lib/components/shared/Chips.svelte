<script>

 
 
	/**
	 * @typedef {Object} Props
	 * @property {() => void} flip
	 * @property {any} text
	 * @property {any} chipIcon
	 */

	/** @type {Props} */
	let { flip, text, chipIcon } = $props();

</script>

<ion-chip onclick={flip} class="chip" aria-hidden>
	<div class="chipFlex">
		<ion-icon icon={chipIcon}></ion-icon>
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
		font-size: 1rem;
		margin: 0.2rem;
}


.chip {
	margin-top: 1.5rem;
	background-color: var(--app-color-degree-chip);	
	color: var(--app-color-degree-chip-text);
	font-weight: 700;
	box-shadow: var(--shadow-sm);

}

</style>