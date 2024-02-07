<script lang="ts">
	// @ts-nocheck
	import { writable } from 'svelte/store';
	import Card from './gradeCard.svelte';
	import { coursesPerSemester } from '$lib/functions/coursePerSemester/coursesPerSemester';
	import { averagesPerSemester } from '$lib/functions/gradeAverages/averagesPerSemester';
  
	export let searchQuery;
	export let semesterId;
  
	let courseBySemester = writable([]);
	let filteredSubjects = writable([]);
  
	// Get the courses per semester and the average per semester
	async function gatherGrades() {
	  const courses = await coursesPerSemester();
	  const semesterAverage = await averagesPerSemester();
  
	  // keep semester id, average, and courses in an array
	  const semesters = Object.keys(courses).map((key) => {
		return {
		  semesterId: key,
		  average: semesterAverage[key] ? semesterAverage[key] : '-',
		  courses: courses[key],
		};
	  });
  
	  semesters.sort((a, b) => a.semesterId - b.semesterId);
  
	  courseBySemester.set(semesters);
  
	  return semesters;
	}
  

	// Filter the results based on the searchQuery

  
	$: {

	  const courses = $courseBySemester;
	  if (searchQuery.length === 0) {
		filteredSubjects.set(courses);
	  } else {
		const filtered = courses.map((semester) => {
		  return {
			...semester,
			courses: semester.courses.filter(
			  (course) =>
				course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.course.toLowerCase().includes(searchQuery.toLowerCase())
			),
		  };
		});
		filteredSubjects.set(filtered);
	  }
  
	}

  </script>
  
  <!-- Card -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  
  {#await gatherGrades()}
	<p>Loading...</p>
  {:then semesters}
	{#each $filteredSubjects as semester}
	  <Card semesterAverage={semester.average} semesterId={semester.semesterId} filteredSubjects={semester.courses} />
	{/each}
  
  {:catch error}
	<p>{error.message}</p>
  {/await}
  

