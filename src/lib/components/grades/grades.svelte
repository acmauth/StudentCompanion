<script lang="ts">
	// @ts-nocheck
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import Card from './gradeCard.svelte';
	import {coursesPerSemester} from '$lib/functions/gradeAverages/gradesPerSemester';

	export let searchQuery;

	let subjects = [];
	let filteredSubjects = {};
	let courseBySemester = {};
	let semesterAverage = [];


	onMount(async () => {
		subjects = (await universisGet('students/me/courses?$top=-1')).value;
		courseBySemester = subjects.reduce((acc, course) => {
			if (!acc[course.semester.id]) {
				acc[course.semester.id] = [];
			}
			acc[course.semester.id].push(course);
			return acc;
		}, {});
	
		coursesPerSemester().then((result) => {
			semesterAverage = result;
			
		})

	});

	// Filter the results based on the searchQuery

	$: {
		if (searchQuery.length === 0) {
			filteredSubjects = { ...courseBySemester };
		} else {
			//filter the subjects from the searchQuery and make a new object with the filtered subjects and the semesterId as key

			for (let semesterId in courseBySemester) {
				filteredSubjects[semesterId] = courseBySemester[semesterId].filter((course) =>
              course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) || course.course.toLowerCase().includes(searchQuery.toLowerCase())
				);
			}
		}
	}

	
	
</script>

<!-- Card -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

{#each Object.keys(filteredSubjects) as semesterId,index}
	{#if filteredSubjects[semesterId].length > 0}
		<Card semesterAverage = {semesterAverage[index]} semesterId={semesterId} filteredSubjects={filteredSubjects} />
	{/if}
{/each}

