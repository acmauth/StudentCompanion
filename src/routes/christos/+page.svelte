<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    // HTML elements
    let _g_avg = "";
    let _w_avg = "";

    onMount(async () => {

        let exams = await universisGet("students/me/grades?$top=-1&$filter=isPassed eq 1");
        let courses = (await universisGet("students/me/courses?$top=-1")).value;

        let k = 0;
        let passed_courses = [];
        for (const course of courses)
            if (course.isPassed == 1)
                passed_courses[k++] = course;

        let i = 0, j = 0;
        let g_grades = [];
        let g_sum = 0;
        let g_avg = 0;
        let w_sum = 0;
        let w_avg = 0;
        let courses_codes = [];
        let ects_list = [];

        for (const exam of exams.value) {
            g_grades[i] = exam.formattedGrade * 1;
            courses_codes[i++] = exam.course;
        }
        g_sum = g_grades.reduce((total, currentValue) => total + currentValue, 0);
        if (g_grades.length > 0)
           g_avg = Number((g_sum / g_grades.length).toFixed(2));
        _g_avg = String(g_avg);


        for (const code of courses_codes)
            for (const courseEntry of passed_courses)
                if (courseEntry.course == code)
                    ects_list[j++] = courseEntry.ects;

        i = 0;
        for (const g of g_grades)
            w_sum += g * ects_list[i++];

        w_avg = Number((w_sum / ects_list.reduce((total, currentValue) => total + currentValue, 0)).toFixed(2));
        _w_avg = String(w_avg);

    });

</script>

<p>This is Christos's page. Keep out unless you're a moron.</p>
<p>Your general AVG is {_g_avg}</p>
<p>Your weighted AVG is {_w_avg}</p>
