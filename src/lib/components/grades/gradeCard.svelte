<script lang="ts">
	export let filteredSubjects: any = {};
	export let semesterId: any = {};
	export let semesterAverage: any = {};
	export let semesterName: string;
	import AppCard from '$shared/AppCard.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import Course from '../courses/coursePage.svelte';
	import {navController} from '$components/shared/StackedNav';


	let childrenOpen: boolean[] = [];

    function toggleChildren(index: number) {
        childrenOpen[index] = !childrenOpen[index];
    }

	function navigateToCourse(course: { course: any; }) {
		if (!(course.childCourses && course.childCourses.length > 0))
			navController.push(Course, {id: course.course});
	}

</script>
<span class="scroll" id={semesterId}></span>


<div class="container">
{#if filteredSubjects.length > 0}
<div class="ion-padding-start ion-padding-vertical semester">
	{#if semesterId <= 24}
	<ion-text class="title"><b>{semesterId}ο Εξάμηνο</b></ion-text>
	{:else}
	<ion-text class="title"><b>{semesterName}</b></ion-text>
	{/if}
		{#if semesterAverage}
		<ion-text class="subtitle">Μ.Ο Εξαμήνου: {semesterAverage}</ion-text>
		{:else}
		<ion-text class="subtitle">Μ.Ο Εξαμήνου: -</ion-text>
		{/if}
		

</div>

	{#each filteredSubjects as course,index}
	<AppCard id={index} onClick={() => navigateToCourse(course)} padding>
		<!-- Card content for course -->
		<!-- Checking if course has children courses or not, so we can render the href links accordingly. Rest of the content stays the same -->
		{#if course.childCourses && course.childCourses.length > 0}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<ion-item on:click={navigateToCourse} lines="none" class="ion-no-padding">
			<div class="containerFlex">

				<div class="titlesFlex">
				<ion-label class="ion-text-wrap courseTitle">{course.courseTitle}</ion-label>

		{#if course.examPeriod !== null}
			<ion-label class="examPeriod">
				{#if course.examPeriod && course.gradeYear}
					{course.examPeriod.name} {course.gradeYear.name}
				{:else}
					ΔΗΛΩΜΕΝΟ
				{/if}
			</ion-label>

		{:else}
			<ion-label class="examPeriod">-</ion-label>
		{/if}

		</div>
		{#if course.grade !== null && !(isNaN(course.grade))}
			{#if course.grade * 10 >= 5}
				<ion-text class="success gradeNumber">
					<h2>{course.formattedGrade}</h2>
				</ion-text>
			{:else}
				<ion-text class="danger gradeNumber">
					<h2>{course.formattedGrade}</h2>
				</ion-text>
			{/if}
		{/if}
		</div>
		
		</ion-item>
		
		{:else}
		<ion-item lines="none" class="ion-no-padding">
			<div class="containerFlex">

				<div class="titlesFlex">
				<ion-label class="ion-text-wrap courseTitle">{course.courseTitle}</ion-label>

		{#if course.examPeriod !== null}
			<ion-label class="examPeriod">
				{#if course.examPeriod && course.gradeYear}
					{course.examPeriod.name} {course.gradeYear.name}
				{:else}
					ΔΗΛΩΜΕΝΟ
				{/if}
			</ion-label>

		{:else}
			<ion-label class="examPeriod">-</ion-label>
		{/if}

		</div>
		{#if course.grade !== null && !(isNaN(course.grade))}
			{#if course.grade * 10 >= 5}
				<ion-text class="success gradeNumber">
					<h2>{course.formattedGrade}</h2>
				</ion-text>
			{:else}
				<ion-text class="danger gradeNumber">
					<h2>{course.formattedGrade}</h2>
				</ion-text>
			{/if}
		{/if}
		</div>
		
		</ion-item>
		{/if}
		
	

	<!-- If the current course has children courses, add them below -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#if course.childCourses && course.childCourses.length > 0}
		<div class="children" class:open={childrenOpen[index]}>
			{#each course.childCourses as childCourse}
				<!-- Card content for child course -->
				<ion-item href={`/courses/${course.course}`} lines="none" class="ion-no-padding">
					<div class="containerFlex">
						<div class="titlesFlex">
							<ion-label class="ion-text-wrap courseTitle">{childCourse.courseTitle}</ion-label>
							{#if childCourse.examPeriod !== null}
								<ion-label class="examPeriod">
									{#if childCourse.examPeriod && childCourse.gradeYear}
										{childCourse.examPeriod.name} {childCourse.gradeYear.name}
									{:else}
										ΔΗΛΩΜΕΝΟ
									{/if}
								</ion-label>
							{:else}
								<ion-label class="examPeriod">-</ion-label>
							{/if}
						</div>
						{#if childCourse.grade !== null && !(isNaN(childCourse.grade))}
							{#if childCourse.grade * 10 >= 5}
								<ion-text class="success gradeNumber">
									<h2>{childCourse.formattedGrade}</h2>
								</ion-text>
							{:else}
								<ion-text class="danger gradeNumber">
									<h2>{childCourse.formattedGrade}</h2>
								</ion-text>
							{/if}
						{/if}
					</div>
				</ion-item>
				
			{/each}

		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<ion-icon class="icon arrow" on:click={() => toggleChildren(index)} size="large" icon={allIonicIcons.caretDown} class:arrowOpen={childrenOpen[index]} />
			
	{/if}

</AppCard>

{/each}
{/if}

</div>

<style>

.icon {
	min-width: 100%;
}


.gradeNumber h2{
	margin: 0 !important;
	margin-right: -0.5rem !important;
	margin-left: 0.5rem !important;
	
}


h2 {
	font-size: 1.5rem;
	font-weight: bold;
}


.courseTitle {
	font-size: 1rem;
	margin-right: 0.5rem;
}

.title {
	font-size: 1.5rem;
}

.subtitle {
	font-size: 0.9rem;
	color: var(--app-color-primary-dark);
	font-weight: bold;
}

.scroll {
	scroll-margin-top: 8.2rem;
	display: block;
	height: 1rem;
}


.containerFlex {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-width: 100%;
	padding: 0.5rem;
	/* padding-left: 0.7rem; */
}

.titlesFlex {
	display: flex;
	flex-direction: column;
	align-items: start;
	
}

.semester {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.5rem !important;
}


.success {
	color: var(--app-color-green-dark);
}

.danger {
	color: var(--app-color-orange-dark);
}

.examPeriod{
	font-size: 0.8rem;
	color: grey;
}

.semester {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 1rem;
}


.examPeriod{
	font-size: 0.8rem;
}


.children {
    visibility: hidden;
    overflow: hidden;
    transition: max-height 0.3s ease;
	max-height: 0rem;
}

.open {
	max-height: 10rem;
	visibility: initial;
}

.arrow {
	margin-bottom: -1rem;
	transform: rotate(0deg);
	transition: transform 0.5s ease-in-out;
}

.arrowOpen {
	transform: rotate(180deg);
}
</style>
