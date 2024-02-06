<script lang="ts">  
	export let filteredSubjects: any = {};
	export let semesterId: any = {};
	export let semesterAverage: any = {};

	
</script>
{#if filteredSubjects.length > 0}
<span class="scroll" id={semesterId}></span>
<ion-card class="ion-padding-vertical">
	<ion-card-header>
  <ion-card-title><b>{semesterId}ο Εξάμηνο</b></ion-card-title>
		{#if semesterAverage}
		<ion-card-subtitle>Μ.Ο Εξαμήνου: {semesterAverage}</ion-card-subtitle>
		{:else}
		<ion-card-subtitle>Μ.Ο Εξαμήνου: -</ion-card-subtitle>
		{/if}
	</ion-card-header>

	<ion-card-content>
		<ion-list lines="none">
			{#each filteredSubjects as course}
					<ion-label class="ion-padding-start">{course.course}</ion-label>

					<ion-item href={`/courses/${course.course}`}>
						<ion-label class="ion-text-wrap title">{course.courseTitle}</ion-label>
						{#if course.grade !== null}
							{#if course.grade * 10 >= 5}
								<ion-text class="ion-padding-start" color="success">
									<h2>{course.formattedGrade}</h2>
								</ion-text>
							{:else}
								<ion-text class="ion-padding-start" color="danger">
									<h2>{course.formattedGrade}</h2>
								</ion-text>
							{/if}
						{:else}
							<ion-text class="ion-padding-start" color="danger">
								<h2><b>-</b></h2>
							</ion-text>
						{/if}
					</ion-item>
					{#if course.examPeriod !== null}
						<ion-label class="ion-padding-start examPeriod">
							{#if course.examPeriod && course.gradeYear}
								{course.examPeriod.name} {course.gradeYear.name}
							{:else}
								-
							{/if}
						</ion-label>
          
					{:else}
						<ion-label class="ion-padding-start examPeriod">-</ion-label>
					{/if}
					<span class="line"></span>
				
				
			{/each}
	</ion-list>
</ion-card-content>
</ion-card>
{/if}


<style>

.scroll {
	display: block;
	height: 35px;
}

ion-item { --min-height: 0; }


ion-label {
	margin: 0.3rem 0rem;
}



.line {
	display: block;
	height: 1px;
	width: 90%;
	background-color: #e0e0e0;
	margin-left: 1rem;
	margin-bottom: 1rem;
	margin-top: 1rem;
}












</style>
