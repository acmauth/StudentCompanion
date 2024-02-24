<script lang="ts">
	export let coursesBySemester: any = {};
	export let semesterId: any = {};


	/**
	 * @param {string} semId
	 */
	function handleClick(semId: string) {

		
			semesterId = semId;
			const element = document.getElementById(semesterId);
			if (element) {
				element.scrollIntoView({ 
					behavior: 'smooth',
					
				});
			}
			
		
	}

</script>


<div class="chipsrow">

	{#each Object.keys(coursesBySemester) as id}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->

			<ion-chip on:click={handleClick(id)} color="primary">
				<ion-label>{id}ο εξάμηνο</ion-label>
			</ion-chip>


	{/each}
	
</div>	


<style>


    .chipsrow {
        overflow-x: scroll;
        white-space: nowrap;
        padding-left: 1rem;
        padding-right: 1rem;
        background-color: white;
        &::-webkit-scrollbar {
            display: none;
        };  

    }

</style>