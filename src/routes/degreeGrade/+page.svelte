<script lang="ts">
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
 

    /**
     * @type {any[]}
     */
    let unpassed_semesters = [];
    let temp_courses = [];

    let not_passed_all_courses = false; // If false then, the student has passed all of their courses

    // Grades sum
    let sum_passed_courses = 0;
    let degree_grade = 0;
    let degree_grade_string = "";

    let ectsSum = 0;
        
    onMount(async () => {
        // Fetch a list of the current student's courses
        let courses = (await universisGet("students/me/courses?$top=-1")).value;

        let progressBarCourses = document.querySelector('.progress-courses');
        progressBarCourses.value = 0;

        let last_semester = -1
        let last_semester_unpassed_courses_pushed = true

        // Loop through the courses. If the current course is
        // not passed) change the not_passed_all_courses bool to true and push the courses to the unpassed_semesters list
        // passed) add the ect calculated grade to the sum of the passed courses grade
        courses.sort((a, b) => a.semester.id - b.semester.id);
        console.log(courses);

        for (const course of courses)
        {
            if (course.isPassed == 0)
            {
                not_passed_all_courses = true;

                if (course.semester.id != last_semester)
                {
                    last_semester_unpassed_courses_pushed = true
                    if (last_semester != -1)
                        unpassed_semesters.push({courses: temp_courses, semester: course.semester.id});

                    temp_courses = [{title: course.courseTitle, grade: 0, ects: course.ects}];
                    last_semester = course.semester.id;
                }
                else
                {
                    temp_courses.push({title: course.courseTitle, grade: 0, ects: course.ects});
                    last_semester_unpassed_courses_pushed = false;
                }
                    
            }
            else
            {
                sum_passed_courses += course.grade * course.ects * 10;
                ectsSum += course.ects;
            }
        }
        
        if(last_semester_unpassed_courses_pushed == false)
        {
            unpassed_semesters.push({courses: temp_courses, semester: last_semester});
        }

        // calculate pre existing degree grade with a two digit percision
        degree_grade = sum_passed_courses / ectsSum;

        if(degree_grade >= 0 && degree_grade <= 10)
        {
            degree_grade_string = String(degree_grade.toFixed(2));
            progressBarCourses.value = degree_grade / 10.0;
        }
        else
        {
            degree_grade_string = "0.00";
            progressBarCourses.value = 0;
        }
        
    });   

    // Whenever there are changes in the unpassed course grades, the average is recalculated
    // taking count of the new grade assumption

    function updateGrades(event: CustomEvent<KeyboardEvent>) 
    {
        let progressBarCourses = document.querySelector('.progress-courses');

        const target = event.target as HTMLInputElement;

        let sum_unpassed_semesters = 0
        let ects_sum_all = ectsSum;

        for (const semester_courses of unpassed_semesters)
        {
            for (const course of semester_courses.courses)
            {

                if (course.grade != null && course.grade != 0)
                {
                    if (course.grade > 10)
                    {
                        target.value = "10";
                        course.grade = 10;
                    }
                    if (course.grade < 0)
                    {
                        target.value = "0";
                        course.grade = 0;
                        continue;
                    }
                    
                    ects_sum_all += course.ects;
                    sum_unpassed_semesters += course.grade * course.ects;
                }

            }
        }
        
        degree_grade = ((sum_unpassed_semesters+sum_passed_courses) / ects_sum_all);

        if(degree_grade >= 0 && degree_grade <= 10)
        {
            degree_grade_string = String(degree_grade.toFixed(2));
            progressBarCourses.value = degree_grade / 10.0;
        }
        else
        {
            degree_grade_string = "0.00";
            progressBarCourses.value = 0;
        }

        
    }
</script>


<meta name="viewport" content="width=device-width, initial-scale=1.0">

<ion-header>
    <ion-toolbar>
        <ion-title>Degree Grade</ion-title>
    </ion-toolbar>
</ion-header>

<ion-content>
        
        <div class="center-div">

            <div style="margin-top: 0.5rem; margin-bottom: 1.5rem">
                <center>
                <h2>Για τον υπολογισμό του βαθμού σας,
                    πρέπει να δώσετε μια πρόβλεψη για τα μη περασμένα μαθήματά σας [0-10]:</h2>
                </center>
            </div>

            {#if not_passed_all_courses}
            {#each unpassed_semesters as semester}
                <ion-card class="ion-padding" style="margin-bottom: 20px;">
                <ion-card-header>Εξάμηνο: {semester.semester}</ion-card-header>

                    {#each semester.courses as course}
                        <!-- Class and input -->
                        <ion-item >
                            <ion-text class="class">{course.title}</ion-text>
                            <input  type="number" pattern="\d*" bind:value={course.grade} min="0" max="10" step="0.1" on:input={updateGrades} placeholder="5.5" />
                        </ion-item>
                    {/each}

                </ion-card>
            {/each}

            <!-- Skeleton -->
            {:else}
            <ion-card class="ion-padding" style="margin-bottom: 20px;">
                <ion-card-header>
                    <ion-skeleton-text animated="true" style="width: 100px"></ion-skeleton-text>
                </ion-card-header>

                <ion-item>
                    <ion-text class="class">
                        <ion-skeleton-text animated="true" style="width: 200px"></ion-skeleton-text>
                    </ion-text>
                </ion-item>
                <ion-item>
                    <ion-text class="class">
                        <ion-skeleton-text animated="true" style="width: 200px"></ion-skeleton-text>
                    </ion-text>
                </ion-item>
                <ion-item>
                    <ion-text class="class">
                        <ion-skeleton-text animated="true" style="width: 200px"></ion-skeleton-text>
                    </ion-text>
                </ion-item>
                
            </ion-card>
            {/if}  
            

            <div style="margin-top: 3rem;">
                <center> <h1 style="font-weight: bold; color: #1e2023;">Βαθμός πτυχίου: {degree_grade_string} </h1> </center>
                    <ion-progress-bar class="progress-courses" />
            </div>
        </div>

      
</ion-content>
    <!-- Check if there are any unpassed courses and if so, show them in the screen and ask for input -->



<style>  
    .center-div {
        width: auto;
        @media (min-width: 769px) {
        width: 50%;
        }

        margin: 0 auto; 
    }

    .class{
    font-size: 13px;
    flex: 3.5; /* Takes 3/4 of the available space */
    padding: 10px; /* Add padding as needed */
    }

    ion-item
    {
        --inner-border-width: 0 0 0 0;
    }

    input[type="number"] {
    appearance: textfield; /* Remove default arrows in some browsers */
    -webkit-appearance: textfield; /* Remove default arrows in Safari */
    width: 50px; /* Set a custom width */
    padding: 5px; /* Add some padding */
    border: 1px solid #ccc; /* Add a border */
    border-radius: 5px; /* Add border-radius for rounded corners */
    font-size: 16px; /* Set the font size */
    text-align: center; /* Center the text */
    flex: 0.5; /* Takes 1/4 of the available space */
    }

    /* Style the number input when it's being hovered -> Phones don't have hover*/
    input[type="number"]:hover {
    border-color: #888; /* Change border color on hover */
    }

    /* Style the number input when it's being focused */
    input[type="number"]:focus {
    outline: none; /* Remove the default focus outline */
    box-shadow: 0 0 5px #aaa; /* Add a box shadow on focus */
    }

    .progress-courses {
		--progress-background: #3880FF;
		background: #ffffff; /*var(--app-color-primary-dark)*/
		height: 0.5rem;
        width: 60%;
		margin-top: 0.5rem;
        margin-bottom: 5rem;
        margin-inline: auto;
		border-radius: 15px;
	}

</style>



<!-- NOTES 
1. In firefox, unlike chrome and edge (expect 'e'), you can input alphabetical characters
2. Progress bar sometimes starts full?
3.
-->
