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

	{#each Object.entries(coursesBySemester) as [id, courses]}
	    <!-- svelte-ignore a11y-click-events-have-key-events -->
	    <!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if courses[id-1].semester.id <= 24}
	    <ion-chip on:click={handleClick(id)} color="primary">
	        <ion-label>{id}ο εξάμηνο</ion-label>
	    </ion-chip>
		{:else}
		<ion-chip on:click={handleClick(id)} color="primary">
	        <ion-label>{courses[id-1].semester.name}</ion-label>
	    </ion-chip>
		{/if}
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