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

ion-chip{
	background-color: transparent; 
}

.chipFlex {
		display: flex;
		gap: 0.2rem;
		align-items: center;
		font-size: 1.3rem;
		margin: 0.2rem;
		padding: .7rem 1.5rem .7rem 1.5rem;
		border: 1px solid var(--ion-color-primary-shade);
		border-radius: 30px; 
		background-color: rgba(var(--ion-color-primary-shade), 80%);
}


.chip {
	margin-top: 1.5rem;
	color: var(--ion-color-primary);
	font-weight: 700;

}

</style>
