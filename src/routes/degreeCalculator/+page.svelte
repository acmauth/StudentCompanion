<script lang="ts">
    import { universisGet } from "$lib/dataService";
    import { gradeString } from  './gradeString.js';
    import { checkPrecision } from './checkPrecision.js';
    import { test } from './test.js';
    import CoursesSkeleton from '$components/degreeCalculator/coursesSkeleton.svelte';
    import AvGrades from '$components/degreeCalculator/avGrades.svelte';
    import Course from '$components/degreeCalculator/course.svelte';


    let unpassed_courses: { title: string; id:string; semester: number; grade: number; input_grade: string; ects: number;}[] = [];

    let not_passed_all_courses = false; // If true then, the student did not pass all of their courses

    // For the ect grade
    let sum_passed_courses_ects = 0;
    let degree_grade_ects = 0;
    let degree_grade_string_ect = "";
    let ects_sum = 0;   

    // For the simple grade
    let sum_passed_courses_simple = 0;
    let degree_grade_simple = 0;
    let degree_grade_string_simple = "";
    let grades_Passed = 0;


    
    async function fetchData()
    {   
        let courses = (await universisGet("students/me/courses?$top=-1")).value;

        courses.sort((a: { semester: { id: number; }; }, b: { semester: { id: number; }; }) => a.semester.id - b.semester.id);
        courses = courses.filter((course: { calculateGrade: number; }) => course.calculateGrade == 1);

        for (const course of courses)
        {
            if (course.isPassed == 1)
            {
                sum_passed_courses_ects += course.grade * course.ects * 10;
                ects_sum += course.ects;

                sum_passed_courses_simple +=  course.grade * 10;
                grades_Passed++;

                continue;
            }
                not_passed_all_courses = true;
                unpassed_courses.push({ title: course.courseTitle, id: course.id, semester: course.semester.id, grade: course.grade, input_grade: "", ects: course.ects}); 
        }
    }

    async function main() {
        await fetchData();     
        degree_grade_ects = sum_passed_courses_ects / ects_sum;
        degree_grade_simple = sum_passed_courses_simple / grades_Passed;

        degree_grade_string_ect = gradeString(degree_grade_ects);
        degree_grade_string_simple = gradeString(degree_grade_simple);
    };   

    function inputUpdate(){
        let sum_unpassed_courses_ects = 0
        let ects_sum_all = ects_sum;

        let sum_unpassed_courses_simple = 0;
        let grades_Passed_all = grades_Passed;

        for (var course of unpassed_courses)
        {
            if (test(course))
                continue;

            course = checkPrecision(course);
            
            sum_unpassed_courses_ects += course.grade * course.ects;
            ects_sum_all += course.ects;

            sum_unpassed_courses_simple += course.grade;
            grades_Passed_all++;
        }
            
        degree_grade_ects = ((sum_unpassed_courses_ects+sum_passed_courses_ects) / ects_sum_all);
        degree_grade_string_ect = gradeString(degree_grade_ects);

        degree_grade_simple = ((sum_unpassed_courses_simple+sum_passed_courses_simple) / grades_Passed_all);
        degree_grade_string_simple = gradeString(degree_grade_simple);
    }

</script>


<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<ion-card style="overflow-y: auto;">
    <ion-card-title>Πρόβλεψη Μέσου Όρου</ion-card-title>
    <ion-card-subtitle>Βάλε τους βαθμούς που περιμένεις να λάβεις για να δεις πώς επηρεάζεται ο Μ.Ο. σου</ion-card-subtitle>

    {#await main()}
        <CoursesSkeleton />
    {:then}

        {#if not_passed_all_courses}
            {#each unpassed_courses as course}

            <div class="courses-box">
                
                <Course course_title={course.title} course_semester={course.semester} />
                
                <div class="input-box"> 
                    <input type="text" inputmode="decimal" 
                    id="{course.id}" class="inputCustom"
                    onclick="this.value = ''" placeholder="0.00"
                    on:input={inputUpdate} />      
                </div>

            </div>      

            {/each}
        {/if}

        <AvGrades degree_grade_string_ect={degree_grade_string_ect} degree_grade_string_simple={degree_grade_string_simple}/>

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
        color: #515151;
    }

    ion-card-subtitle {
        text-align: center;
        text-transform: none;
        color: #515151;
        font-weight: 500;
        margin-top: 0.3rem;
        margin-bottom: 2.5rem;
        margin-inline: 12%;
    }

    .input-box {
        display: flex;
        align-items: center;
        flex: 0.75; /* Takes 1/8 of the available space */
    }

    .courses-box {
        margin-bottom: 0.3em; 
        display: flex;
    }

    .inputCustom {
    text-align: center;
    border: 0.1px solid #ccc;
    border-radius: 5px;
    font-size: 10px;
    width: 4em;
    height: 2.5em;
    box-sizing: border-box;
    outline: none;
    }
    
</style>



<!-- NOTES 
1. id={course.id} -> no ""
-->
