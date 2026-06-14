<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { course } from '$lib/types/courseType';
	import Card from './gradeCard.svelte';

	interface SemesterGroup {
		semesterId: string;
		average: string;
		courses: course[];
	}

	export let filteredSubjects: Writable<SemesterGroup[]>;
 </script>
  

	{#each $filteredSubjects as semester}

	 {#if semester.courses.length > 0}
        <Card semesterAverage={semester.average} semesterId={semester.semesterId} filteredSubjects={semester.courses} semesterName={semester.courses[0].semester.name} />
    {/if}
	{/each}

  

