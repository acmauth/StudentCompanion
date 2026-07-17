<script lang="ts">
    import UnpassedCourseRow from './UnpassedCourseRow.svelte';
    import GradeSummary from './GradeSummary.svelte';
    let degree_grade = { based: {value:0, stringed:'0.00'}, simple: {value: 0, stringed: '0.00'} };
</script>

<UnpassedCourseRow course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>
<UnpassedCourseRow course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>
<UnpassedCourseRow course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>
<UnpassedCourseRow course_title={"ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ"} course_semester_id={-1} course_semester_name={""}/>


<GradeSummary degree_grade={degree_grade} />
