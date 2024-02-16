<script lang="ts">
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
    import { Capacitor } from '@capacitor/core';

     
    let unpassed_semesters: any[] = [];
    let temp_courses: { title: any; grade: number; ects: any; }[] = [];

    let not_passed_all_courses = false; // If false then, the student has passed all of their courses

    // Grades sum
    let sum_passed_courses = 0;
    let degree_grade = 0;
    let degree_grade_string = "";

    let ectsSum = 0;    
    
    let footer_bottom = 0;
    
    // Function to check if the "Degree Grade = x.yz" is in the viewport
    function isGraphVisible() {
        // Get references to the graph container and the footer
        const graphContainer = document.getElementById('gradeGraph');
        const footer = document.getElementById('footer');
        
        const gradeRect = graphContainer.getBoundingClientRect();   
        const footerRect = footer.getBoundingClientRect();

        if(footerRect.bottom != 0)
         footer_bottom = footerRect.bottom;

        console.log("FOOTER BOTTOM = ", footerRect.bottom, " GRADE TOP =", gradeRect.top);
        return footer_bottom >= gradeRect.top;
    }

    // Toggle footer visibility if "Degree Grade = x.yz" is visible
    function toggleFooterVisibility() {
        if (isGraphVisible()) 
            document.getElementById("footer").style.display = "none";
        else 
            document.getElementById("footer").style.display = "initial";
    }   


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
        courses.sort((a: { semester: { id: number; }; }, b: { semester: { id: number; }; }) => a.semester.id - b.semester.id);
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
                        unpassed_semesters.push({courses: temp_courses, semester: course.semester.id}); // Change semester: to semesterId

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

        setTimeout(() => toggleFooterVisibility(), 10);   
    });   

    // Updates the degree grade based on user input

    function handleInpt(event: CustomEvent<KeyboardEvent>) 
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


<ion-footer mode="ios" id="footer">
	<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
		<ion-title style="text-align: center;">Βαθμός πτυχίου = <span style="color: #0054e9;">{degree_grade_string}</span></ion-title>
	</ion-toolbar>
</ion-footer>


<div style="overflow:scroll" on:scroll={toggleFooterVisibility}> 
        
    <div class="center-div">

        <div style="margin-top: 0.5rem; margin-bottom: 1.5rem">
            <center>
            <h3 style="color: #070707;">Για τον υπολογισμό του βαθμού σας,
                πρέπει να δώσετε μια πρόβλεψη για τα μη περασμένα μαθήματά σας [0-10]:</h3>
            </center>
        </div>

        {#if not_passed_all_courses}
            {#each unpassed_semesters as semester}
                <ion-card class="ion-padding" style="margin-bottom: 20px;">
                <ion-card-header>{semester.semester}ο Εξάμηνο</ion-card-header > 

                    {#each semester.courses as course}
                        <!-- Class and input -->
                        <ion-item >
                            <ion-text class="class">{course.title}</ion-text>
                            <input type="number" pattern="\d*" bind:value={course.grade} min="0" max="10" step="0.1" on:input={handleInpt} placeholder="5.5"/>
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

        {#if not_passed_all_courses}
        {#each unpassed_semesters as semester}
            <ion-card class="ion-padding" style="margin-bottom: 20px;">
            <ion-card-header>{semester.semester}ο Εξάμηνο</ion-card-header>

                {#each semester.courses as course}
                    <!-- Class and input -->
                    <ion-item >
                        <ion-text class="class">{course.title}</ion-text>
                        <input  type="number" pattern="\d*" bind:value={course.grade} min="0" max="10" step="0.1" on:input={handleInpt} placeholder="5.5" />
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
            <center> <h1 style="font-weight: bold; color: #1e2023;" id="gradeGraph">Βαθμός πτυχίου: {degree_grade_string} </h1> </center>
                <ion-progress-bar class="progress-courses"/>
        </div>
    </div>

    
</div>
    <!-- Check if there are any unpassed courses and if so, show them in the screen and ask for input -->



<style>  
    ion-toolbar {
        --border-color: #ffffff;

        --min-height: 1rem;
        --padding-top: 10px;
        --padding-bottom: 10px;
    }



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
0. Footer visibility initialization -> done
1. In firefox, unlike chrome and edge (expect 'e'), you can input alphabetical characters ...
2. Progress bar sometimes starts full? -> Fixed?
3. Change semester: to semesterId -> Tidy everything ...
-->
