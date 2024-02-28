<script lang="ts">
	import Card from './gradeCard.svelte';

	export let searchQuery;
	export let semesterId;
	export let filteredSubjects;
	
 </script>
  

	{#each $filteredSubjects as semester}

	 {#if semester.courses.length > 0}
        <Card semesterAverage={semester.average} semesterId={semester.semesterId} filteredSubjects={semester.courses} semesterName={semester.courses[0].semester.name} />
    {/if}
	{/each}

  

