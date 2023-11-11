<script>
    import {page} from '$app/stores';
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    const courseInfo = $page.params.courseInfo;

    let courses = [];
    let registrations = [];
    let courseTitle = "";
    let semester = "";
    let ects = 0;
    let courseInstructors = [];
    let weeklyHours = 0;

    onMount(async () => {

        // Getting an array with courses
        courses = (await universisGet("students/me/courses?$top=-1")).value;

        // Getting an array with user's registered courses and information about them
        registrations = (await universisGet("students/me/Registrations?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$skip=0&$count=false")).value;

        console.log(registrations);

        // Finding the course and storing informations about it in variables
        for (const course of courses) {
            if (course.course === courseInfo){
                courseTitle = course.courseTitle;
                semester = course.semester.name;
                ects = course.ects;
                weeklyHours = course.hours;
            }
        }

        // Getting the instructors' names for the course from the registrations
        let familyName = [];
        let givenName = [];
        let flag = false;
        for (const semester of registrations){
            for (const classes of semester.classes){
                if (classes.course === courseInfo){
                    for (const instructor of classes.courseClass.instructors){
                        courseInstructors.push({familyName: instructor.instructor.familyName, givenName: instructor.instructor.givenName});
                    }
                    flag = true;
                }
                if (flag)
                    break;
            }
            if (flag)
                break;
        }

        console.log(courseInstructors);
    });
    


</script>


{#if courses.length > 0 && courseInstructors.length > 0}
    <p>courseTitle: {courseTitle}</p>
    <p>courseCode: {courseInfo}</p>
    <p>Semester: {semester}</p>
    <p>Instructor/-s:</p>
    {#each courseInstructors as instructor}
        <p>- {instructor.givenName} {instructor.familyName}</p>
    {/each}
    <p>Ects: {ects}</p>
    <p>weeklyHours: {weeklyHours}</p>
{/if}