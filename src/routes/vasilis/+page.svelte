<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    let courses = [];
    let currentGrades = [];

    onMount(async () => {

        // Getting an array with courses
        courses = (await universisGet("students/me/courses?$top=-1")).value;

        // currentGrades = (await universisGet("students/me/currentRegistration?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=1&$skip=0&$count=false")).value;




    });


</script>


{#if courses.length > 0}
    <ul>
        {#each courses as course}

            <a href={`vasilis/${course.course}`}>{course.courseTitle} ({course.course})<br></a>    
            
            {#if course.grade !== null}

                <p>Grade: <b>{course.formattedGrade}</b></p> 
                
            {:else}

                <p>Grade: <b>ungraded</b></p>

            {/if}

        {/each}
    </ul>
{:else}
    <p>No courses available</p>
{/if}

