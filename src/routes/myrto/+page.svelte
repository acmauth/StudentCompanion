<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    let username = "";

    /**
    * @type {Array<{ courseTitle: string, courseCode: string }>}
    */
    let my_courses = [];

    onMount(async () => {
        
        let i = 0

        // Getting an object that contains an array with courses
        let courses = await universisGet("students/me/courses?$top=-1");
        console.log(courses);

        // With the value property we get one array for each course which stores course related information
        let course_info = courses.value

        for (const course of course_info){
            my_courses.push({courseTitle: course.courseTitle, courseCode: course.course})
        }
        
        my_courses = Array.from(my_courses);

    });
    
</script>


<h1>My Course List</h1>
<ul>
    {#each my_courses as my_course (my_course.courseCode)}
      <li style="color: black; font-weight: bold;"><a href={`myrto/courseExam/${my_course.courseCode}`}>{my_course.courseCode}: {my_course.courseTitle}</a></li>
    {/each}
</ul>
  
<style>
    ul {
        list-style-type: none; /* Remove the default list-style */
    }

    li {
        border: 1px solid #000; /* Add a 1px solid black border around each <li> */
        padding: 10px; /* Add some padding to create space between the content and the border */
        margin: 5px 0; /* Add margin for spacing between list items */
    }

    li a {
        text-decoration: none; /* Remove the default underline */
        color: #1a1717; /* Set link text color */
    }

    li a:hover {
    background-color: #89edff; /* Change the background color on hover */
    }

</style>
