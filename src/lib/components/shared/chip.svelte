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

<ion-chip on:click={flip} class="chip">
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
	background-color: rgba(236, 242, 252, 1);	
	color: var(--app-color-primary-dark);
	font-weight: 700;
	box-shadow: var(--shadow-short-md);

}
</style>