<script lang="ts">
    import Course from '$components/degreeCalculator/course.svelte';
    import AvGrades from '$components/degreeCalculator/avGrades.svelte';
    let degree_grade = { ects: {value:0, stringed:'0.00'}, simple: {value: 0, stringed: '0.00'} };
</script>

<Course course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>
<Course course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>
<Course course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>
<Course course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>


<AvGrades degree_grade={degree_grade} />
