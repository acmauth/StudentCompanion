<script lang="ts">
    //@ts-nocheck
    import { main } from '../../functions/degreeCalculator/main.js';
    import { inputUpdate } from '../../functions/degreeCalculator/inputUpdate.js';

    import CoursesSkeleton from '$components/degreeCalculator/coursesSkeleton.svelte';
    import AvGrades from '$components/degreeCalculator/avGrades.svelte';
    import Course from '$components/degreeCalculator/course.svelte';
	import Chip from '$components/shared/chip.svelte';
    import * as allIonicIcons from 'ionicons/icons';

    export let flip;


    let unpassed_courses: { title: string; id: string; semester_id: number, semester_name: string, grade: number; input_grade: string; coefficient: number;}[] = [];
    
    let degree_grade = { based: {value:0, stringed:''}, simple: {value: 0, stringed: ''} };

    let sums = { based: {grade_sum:0, coefficient: 0}, simple: {grade_sum: 0, passed: 0} };

    let not_passed_all_courses = false;

    async function universis()
    {
        not_passed_all_courses = await main(unpassed_courses, sums, degree_grade); 
    }

    /** @param { { target: { value: string; }; } } element */
    function clickInput(element: { target: { value: string; }; }){
        element.target.value = '';
        inputUpdate(unpassed_courses, sums, degree_grade);
        degree_grade = degree_grade;
    }

    function gradeInput(){
        inputUpdate(unpassed_courses, sums, degree_grade);
        degree_grade = degree_grade;
    }

</script>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<ion-card style="overflow-y: auto;" class="ion-padding-vertical">
    <ion-card-title>Πρόβλεψη Μέσου Όρου</ion-card-title>
    <ion-card-subtitle>Βάλε τους βαθμούς, μεγαλύτερους ή ίσους του 5, που περιμένεις να λάβεις για να δεις πώς επηρεάζεται ο Μ.Ο. σου</ion-card-subtitle>

    {#await universis()}
        <CoursesSkeleton />
    {:then}

        {#if not_passed_all_courses}

            {#each unpassed_courses as course}
            <div class="courses-box">
                
                <Course course_title={course.title} course_semester_id={course.semester_id} course_semester_name={course.semester_name}/>
                
                <div class="input-box"> 
                    <input type="text" inputmode="decimal" 
                    id="{course.id}" class="inputCustom"
                    on:click={clickInput} placeholder="5.00"
                    on:input={gradeInput}/>      
                </div>

            </div>      

            {/each}
        {/if}

        <div class="columnFlex">
            <AvGrades degree_grade={degree_grade}/>

            <Chip chipIcon ={allIonicIcons.cellular} text="Πρόοδος" flip = {flip} />
        </div>

    {/await}

</ion-card>


<style>  

    ion-card {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    }
    
    ion-card-title {
        font-weight: 550;
        margin-top: 1.5rem;
        text-align: center;
        color: var(--app-color-primary-dark);
        
    }

    ion-card-subtitle {
        text-align: center;
        text-transform: none;
        color: var(--app-color-degree-description);
        font-weight: 500;
        margin-top: 0.3rem;
        margin-bottom: 2.5rem;
        margin-inline: 12%;
    }


    .columnFlex {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .input-box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0.75; /* Takes 1/8 of the available space */
    }

    .courses-box {
        margin-bottom: 0.3m; 
        display: flex;
    }

    .inputCustom {
    text-align: center;
    border: 0.15em solid var(--app-color-degree-custom-input);
    border-radius: 0.8em;
    font-size: 0.7em;
    font-weight: bold;
    width: 5em;
    height: 2.5em;
    box-sizing: border-box;
    outline: none;
    background-color: #0000;
    }

    ::placeholder
    {
        color: var(--app-color-placeholder);
    }

    
</style>
