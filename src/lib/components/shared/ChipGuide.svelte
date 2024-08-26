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

.chip {
	margin-top: 1.5rem;
	padding: .8rem 1.7rem; 
	color: var(--ion-color-primary);
	font-weight: 700;
	font-size: 1.2rem; 
	border: 1px solid var(--ion-color-primary); 
	border-radius: 999px;
}

:global(body.dark) .chip{
	background-color: white; 
}

</style>
