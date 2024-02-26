<script lang="ts">
	import Card from './gradeCard.svelte';

	export let searchQuery;
	export let semesterId;
	export let filteredSubjects;
	

 </script>
  

	{#each $filteredSubjects as semester}
	  <Card semesterAverage={semester.average} semesterId={semester.semesterId} filteredSubjects={semester.courses} semesterName = {semester.courses[0].semester.name} />
	{/each}

  

