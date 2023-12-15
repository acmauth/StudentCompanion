<script lang="ts">
	import Grades from '$lib/components/grades/grades.svelte';
	// @ts-ignore
	import 'js-circle-progress'
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import Stats from '$lib/components/grades/statsCard.svelte';
	import {coursesPerSemester} from '$lib/functions/coursePerSemester/coursesPerSemester';
	import Chips from '$lib/components/grades/chips.svelte';
	import { Capacitor } from '@capacitor/core';
	import GradesSkeleton from '$components/grades/gradesSkeleton.svelte';
	import NotifSkeleton from '../notifications/notifSkeleton.svelte';

	let searchQuery = '';
	let subjects = 0;
	let passedSubjects = 0;
	let coursesBySemester = {};
	/**
	 * @type {string}
	 */
	let semesterId: any;

	/**
	 * @param {{ target: { value: string; }; }} event
	 */
	

	function handleChange(event: { target: { value: string; }; }) {
		searchQuery = event.target.value;
	}


	async function getSubjects() {
		subjects = (await universisGet('students/me/courses?$top=-1')).value;
		// @ts-ignore
		passedSubjects = subjects.filter((/** @type {{ grade: number; }} */ course) => course.grade*10 >=5);
		
		// @ts-ignore
		subjects = subjects.length;
		// @ts-ignore
		passedSubjects = passedSubjects.length;

		coursesBySemester = await coursesPerSemester();
	}

	const randList = (length: number) => {
        const randomLength = Math.floor(Math.random() * length) + 2;
        return Array.from({ length: randomLength }, (_, i) => i + 1);
    }



</script>

<ion-header collapse="condense" mode="ios">
	<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
		<ion-title class="ion-padding-vertical" size="large">Βαθμοί</ion-title>
	

		<ion-searchbar debounce={500} on:ionInput={handleChange} inputmode="text" show-clear-button="always" placeholder="Αναζήτηση Μαθημάτων"></ion-searchbar>
		
		
		<Chips coursesBySemester={coursesBySemester} semesterId={semesterId} />
	</ion-toolbar>
</ion-header>

 <!-- Show skeleton while loading -->
 <ion-content fullscreen={true} class="content">
	{#await getSubjects()}
		<ion-progress-bar type="indeterminate"/>
		<GradesSkeleton/>
		<NotifSkeleton/>
	{:then}
	
	<!-- Show content after loading is completed -->
		<Stats searchQuery = {searchQuery} subjects={subjects} passedSubjects={passedSubjects} />
	  
		<Grades semesterId = {semesterId} searchQuery = {searchQuery}  />

		{:catch error}
        <p>{error.message}</p>
	{/await}
</ion-content>
	

<style>
	ion-header {
		position: sticky;
		top: 0px;
		z-index: 10;
	}
</style>






