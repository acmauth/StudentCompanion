<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
 

    /**
	 * @type {any[]}
	 */
    let unpassed_courses = [];

    let not_passed_all_courses = false; // If false then, the student has passed all of their courses

    // some multitudes
    let unpassed_courses_multitude = 0;

    // Grades sum
    let sum_passed_courses = 0;
    let degree_grade = 0;
    let degree_grade_string = "";

    let ectsSum = 0;
        
    onMount(async () => {
        // Fetch a list of the current student's courses
        let courses = (await universisGet("students/me/courses?$top=-1")).value;

        // Loop through the courses. If the current course is
        // not passed) change the not_passed_all_courses bool to true and push the courses to the unpassed_courses list
        // passed) add the ect calculated grade to the sum of the passed courses grade
        for (const course of courses)
        {
            if (course.isPassed == 0)
            {
                unpassed_courses_multitude++;
                not_passed_all_courses = true;
                unpassed_courses.push({title: course.courseTitle, grade: 0, ects: course.ects});
            }
            else
            {
                sum_passed_courses += course.grade * course.ects * 10;
                ectsSum += course.ects;
            }
        }

        // calculate pre existing degree grade with a two digit percision
        degree_grade = sum_passed_courses / ectsSum;
        degree_grade_string = String(degree_grade.toFixed(2));
    });   

    // Whenever there are changes in the unpassed course grades, the average is recalculated
    // taking count of the new grade assumption

    function updateGrades() 
    {
        let sum_unpassed_courses = 0
        let ectsSumAll = ectsSum;

        for (const course of unpassed_courses)
        {
            if (course.grade != 0)
            {
                ectsSumAll += course.ects;
                sum_unpassed_courses += course.grade * course.ects;
            }
        }

        degree_grade = ((sum_unpassed_courses+sum_passed_courses) / ectsSumAll);
        degree_grade_string = String(degree_grade.toFixed(2));
	}
</script>

    <!-- Check if there are any unpassed courses and if so, show them in the screen and ask for input -->
    {#if not_passed_all_courses}
    <h2>To calculate your degreed grade, you must first give a prediction to your unpassed courses grades (0-1):</h2>
    {#each unpassed_courses as course}
    <div class="my-div">
        <p>{course.title}</p>
        <input type="range" bind:value={course.grade} min="0" max="10" step="0.1" on:input={updateGrades} >
        <input type="number" bind:value={course.grade} min="0" max="10" step="0.1" on:input={updateGrades} >
    </div>
    {/each}
    {/if}

    <!-- Show the Degree grade in the screen -->
    <h2>Degree grade: {degree_grade_string}</h2>


<style>
    /* Apply padding to the my-div class */
    .my-div {
    padding: 10px; /* Adjust the value to control the amount of padding */
    border: 1px solid #000; /* Optional: add a border for visualization */
    margin: 5px; /* Optional: add margin to create space between the divs */
}
</style>