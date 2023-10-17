<script lang="ts">
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    // General AVG html element
    var _g_avg = "";

    onMount(async () => {

        let exams = await universisGet("students/me/grades?$top=-1&$filter=isPassed eq 1");

        let i = 0;
        let g_grades = [];
        let g_sum = 0;
        let g_avg = 0
        for (const exam of exams.value) {
            g_grades[i++] = exam.formattedGrade * 1;
            console.log(exam);
        }
        g_sum = g_grades.reduce((total, currentValue) => total + currentValue, 0);


        if (g_grades.length > 0)
           g_avg = Number((g_sum / g_grades.length).toFixed(2));
        _g_avg = String(g_avg);

    });

</script>

<p>This is Christos's page. Keep out unless you're a moron. (Kidding)</p>
<p>Your general AVG is {_g_avg}</p>
