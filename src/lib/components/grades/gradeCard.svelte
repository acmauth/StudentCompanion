<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	import type { course } from './courseType';  
	export let filteredSubjects: any = {};
	export let semesterId: any = {};
	export let semesterAverage: any = {};

	
</script>


<ion-card>
	<ion-card-header>

  <ion-card-title><b>{semesterId}ο Εξάμηνο</b></ion-card-title>
		{#if semesterAverage}
		<ion-card-subtitle>Μ.Ο Εξαμήνου: {semesterAverage}</ion-card-subtitle>
		{:else}
		<ion-card-subtitle>Μ.Ο Εξαμήνου: -</ion-card-subtitle>
		{/if}
	</ion-card-header>

	<ion-card-content>
		<ion-list>
			{#each filteredSubjects[semesterId] as course}
				<div class="courseDetails">
					<ion-label class="ion-padding-start">{course.course}</ion-label>

					<ion-item href={`/courses/${course.course}`}>
						<ion-label class="ion-text-wrap">{course.courseTitle}</ion-label>
						{#if course.grade !== null}
							{#if course.grade * 10 >= 5}
								<ion-text class="ion-padding-left ion-padding-start" color="success">
									<h2>{course.formattedGrade}</h2>
								</ion-text>
							{:else}
								<ion-text class="ion-padding-left ion-padding-start" color="danger">
									<h2>{course.formattedGrade}</h2>
								</ion-text>
							{/if}
						{:else}
							<ion-text class="ion-padding-left ion-padding-start" color="danger">
								<h2>Ungraded</h2>
							</ion-text>
						{/if}
					</ion-item>
					{#if course.examPeriod !== null}
						<ion-label class="ion-padding-bottom ion-padding-start">
							{#if course.examPeriod && course.gradeYear}
								{course.examPeriod.name} {course.gradeYear.name}
							{:else}
								-
							{/if}
						</ion-label>
          
					{:else}
						<ion-label class="ion-padding-bottom ion-padding-start">-</ion-label>
					{/if}
				</div>
			{/each}
	</ion-list>
</ion-card-content>
</ion-card>



<style>

.courseDetails {
		display: flex;
		flex-direction: column;
	}
</style>
