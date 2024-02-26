<script lang="ts">
	import Grades from '$lib/components/grades/grades.svelte';
	// @ts-ignore
	import 'js-circle-progress'
	import { universisGet } from '$lib/dataService';
	import Stats from '$lib/components/grades/statsCard.svelte';
	import {coursesPerSemester} from '$lib/functions/coursePerSemester/coursesPerSemester';
	import Chips from '$lib/components/grades/chips.svelte';
	import { Capacitor } from '@capacitor/core';
	import GradesSkeleton from '$components/grades/gradesSkeleton.svelte';
	import NotifSkeleton from '../notifications/notifSkeleton.svelte';
	import Flipper from "$components/shared/Flipper.svelte";
	import TestComponentB from '../../test/testComponentB.svelte';
	import { flipped } from "./flipstore"; 




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

	function flip() {
		$flipped = !$flipped;
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




</script>

<ion-tab tab="grades">
  <ion-header collapse="condense" mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title class="ion-padding-vertical" size="large">Βαθμοί</ion-title>
    

      <ion-searchbar class="searchbar" debounce={500} on:ionInput={handleChange} inputmode="text" show-clear-button="always" placeholder="Αναζήτηση Μαθημάτων"></ion-searchbar>
      
      
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
   <Flipper reactToHeight bind:flipped={$flipped}>
	   <Stats flip={flip} searchQuery = {searchQuery} subjects={subjects} passedSubjects={passedSubjects} slot="front" />
	   <TestComponentB slot="back"/>
   </Flipper>
	   
	   <Grades semesterId = {semesterId} searchQuery = {searchQuery}  />

      {:catch error}
          <p>{error.message}</p>
    {/await}
  </ion-content>
</ion-tab>	

<style>
	ion-header {
		position: sticky;
		top: 0px;
		z-index: 10;
	}

</style>

