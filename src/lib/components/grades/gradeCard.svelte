<script lang="ts">  
	export let filteredSubjects: any = {};
	export let semesterId: any = {};
	export let semesterAverage: any = {};
	export let semesterName: string;
	import AppCard from '$shared/AppCard.svelte';

	

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

	

		{#each filteredSubjects as course}
		
		<AppCard href={`/courses/${course.course}`} padding>
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
	</AppCard>
	{/each}

{/if}
</div>

<style>


.gradeNumber h2{
	margin: 0 !important;
}


h2 {
	font-size: 1.5rem;
	font-weight: bold;
}


.courseTitle {
	font-size: 1rem;
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
	color: grey
}

.semester {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 1rem;
}

.success {
	color: var(--app-color-green-dark);
}

.danger {
	color: var(--app-color-orange-dark);
}

.examPeriod{
	font-size: 0.8rem;
}

.success {
	color: var(--app-color-green-dark);
}

.danger {
	color: var(--app-color-orange-dark);
}

.examPeriod{
	font-size: 0.8rem;
}

.success {
	color: var(--app-color-green-dark);
}

.danger {
	color: var(--app-color-orange-dark);
}

.examPeriod{
	font-size: 0.8rem;
}




</style>
