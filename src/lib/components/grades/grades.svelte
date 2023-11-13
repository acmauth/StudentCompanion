<script lang='ts'>
// @ts-nocheck
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
	import Card from "./gradeCard.svelte";

    let subjects = [];
    let grades = [];
    let courseBySemester = {};
    let courseClasses = [];

    

    onMount(async () => {

        grades = (await universisGet("students/me/grades?$top=-1")).value;
        

        subjects = (await universisGet("students/me/courses?$top=-1")).value;

        courseClasses = (await universisGet("CourseClassInstructors/me/")).value;

        console.log(courseClasses);
        
        
        subjects.sort((a,b) => a.semester.id - b.semester.id);

        courseBySemester = subjects.reduce((acc, course) => {
            if (!acc[course.semester.id]) {
                acc[course.semester.id] = [];
            }
            acc[course.semester.id].push(course);
            return acc;
        }, {});

     
        // console.log(courseBySemester);
        
    });

	
    export {courseBySemester}
</script>


<!-- Card -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

{#each Object.keys(courseBySemester) as semesterId}
<ion-card>
    <ion-card-header>
        <ion-card-title>{semesterId}ο Εξάμηνο</ion-card-title>
        <ion-card-subtitle>Μ.Ο Εξαμήνου: placeholder</ion-card-subtitle>
    </ion-card-header>
    
    <ion-card-content>
        <ion-list>
            {#each courseBySemester[semesterId] as course}
            <div class="courseDetails">
            <ion-label class="ion-padding-start">{course.course}</ion-label>
            <ion-item href="/">
                
                <ion-label class="ion-text-wrap">{course.courseTitle}</ion-label>
                {#if course.grade !== null}
                    {#if (course.grade*10) >= 5}
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
{/each}

<style>
    .courseDetails {
        display: flex;
        flex-direction: column;
    }
</style>
