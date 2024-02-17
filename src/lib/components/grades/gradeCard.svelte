<script lang="ts">  
	export let filteredSubjects: any = {};
	export let semesterId: any = {};
	export let semesterAverage: any = {};
	import AppCard from '$lib/components/shared/appCard.svelte';

	
</script>
<span class="scroll" id={semesterId}></span>

<div class="container">
{#if filteredSubjects.length > 0}
<div class="ion-padding-start ion-padding-vertical semester">
	<ion-text class="title"><b>{semesterId}ο Εξάμηνο</b></ion-text>
		{#if semesterAverage}
		<ion-text class="subtitle">Μ.Ο Εξαμήνου: {semesterAverage}</ion-text>
		{:else}
		<ion-text class="subtitle">Μ.Ο Εξαμήνου: -</ion-text>
		{/if}
		
</div>

	

		{#each filteredSubjects as course}
		
		<AppCard href={`/courses/${course.course}`}>
			<ion-card-content>
				<ion-item lines="none" >
					<!--  -->
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
				<!-- -->
				
					{#if course.grade !== null}
						{#if course.grade * 10 >= 5}
							<ion-text class="ion-padding-start success">
								<h2>{course.formattedGrade}</h2>
							</ion-text>
						{:else}
							<ion-text class="ion-padding-start danger">
								<h2>{course.formattedGrade}</h2>
							</ion-text>
						{/if}
					
					
					{/if}

					</div>
				</ion-item>
				
			
			</ion-card-content>
	</AppCard>
	{/each}

{/if}
</div>

<style>



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
	display: block;
	height: 2rem;
}

.containerFlex {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-width: 100%;
}

.titlesFlex {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.15rem;
	
}

.semester {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.8rem;
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
