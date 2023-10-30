<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    let subjects = [];
    let grades = [];

    onMount(async () => {

        grades = (await universisGet("students/me/grades?$top=-1")).value;

        subjects = (await universisGet("students/me/courses?$top=-1")).value;
 
        console.log(grades);
        console.log(subjects);
        
    });


</script>


{#if subjects.length > 0}
    <ol>
        {#each subjects as subject}

            <li>{subject.courseTitle} ({subject.course})<br></li>
            
            {#if subject.grade !== null}

                <p>Grade: <b>{subject.formattedGrade}</b></p>
                
            {:else}

                <p>Grade: <b>ungraded</b></p>

            {/if}

        {/each}
        
    </ol>
{:else}
    <p>No subjects available</p>
{/if}
