<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
    import gradeCard from "./recentGradesCard.svelte";

    let examPeriod = [];
    let recentGrades = [];


    onMount(async () => {

        examPeriod = (await universisGet("students/me/department?$expand=departmentConfiguration($expand=examYear,examPeriod)&$top=1&$skip=0&$count=false"));

        let currentPeriod = examPeriod.currentPeriod;
        let currentYear = examPeriod.currentYear;

        recentGrades = (await universisGet('students/me/grades?$filter=courseExam/year eq ' + currentYear + ' and courseExam/examPeriod eq ' + currentPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false')).value;

        
        if (recentGrades.length === 0){
            let lastPeriod;
            let lastYear;
            switch (currentPeriod){
                case 1:
                    lastPeriod = 5;
                    lastYear = currentYear - 1;
                    break;

                case 3:
                    lastPeriod = 1;
                    lastYear = currentYear
                    break;

                case 5:
                    lastPeriod = 3;
                    lastYear = currentYear;
                    break;
            }

            recentGrades = (await universisGet('students/me/grades?$filter=courseExam/year eq ' + lastYear + ' and courseExam/examPeriod eq ' + lastPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false')).value;
        }

    });

</script>