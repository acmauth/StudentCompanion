<script lang="ts">  
	export let filteredSubjects: any = {};
	export let semesterId: any = {};
	export let semesterAverage: any = {};

	
</script>
{#if filteredSubjects.length > 0}
<span class="scroll" id={semesterId}></span>

<div class="ion-padding-start semester">
	<ion-text class="title"><b>{semesterId}ο Εξάμηνο</b></ion-text>
		{#if semesterAverage}
		<ion-text class="subtitle">Μ.Ο Εξαμήνου: {semesterAverage}</ion-text>
		{:else}
		<ion-text class="subtitle">Μ.Ο Εξαμήνου: -</ion-text>
		{/if}
		
</div>

	

  


		{#each filteredSubjects as course}
				
		<ion-card>
			<ion-card-content>
				<ion-item href={`/courses/${course.course}`}>
					<ion-label class="ion-text-wrap courseTitle">{course.courseTitle}</ion-label>
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
				</ion-item>
				{#if course.examPeriod !== null}
					<ion-label class="ion-padding-start examPeriod">
						{#if course.examPeriod && course.gradeYear}
							{course.examPeriod.name} {course.gradeYear.name}
						{:else}
							ΔΗΛΩΜΕΝΟ
						{/if}
					</ion-label>
      
				{:else}
					<ion-label class="ion-padding-start examPeriod">-</ion-label>
				{/if}
				<!-- {#if index !== filteredSubjects.length - 1}
					<span class="line"></span>
				{/if} -->
			</ion-card-content>
	</ion-card>
	{/each}

{/if}


<style>



ion-item { --min-height: 0; }


ion-label {
	margin: 0.3rem 0rem;
}

ion-card-subtitle {
	color: var(--app-color-primary-dark);
	
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
	font-size: 1rem;
	color: var(--app-color-primary-dark);
}

.scroll {
	display: block;
	height: 35px;
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












</style>
