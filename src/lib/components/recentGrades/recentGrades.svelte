<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
    import GradeCard from "./recentGradesCard.svelte";

    let examPeriod = [];
    let recentGrades = [];


    onMount(async () => {
        // getting the current period and year 
        examPeriod = (await universisGet("students/me/department?$expand=departmentConfiguration($expand=examYear,examPeriod)&$top=1&$skip=0&$count=false"));

        let currentPeriod = examPeriod.currentPeriod;
        let currentYear = examPeriod.currentYear;

        // getting recent grades based on the current period, if empty that exam period didn't arrive
        recentGrades = (await universisGet('students/me/grades?$filter=courseExam/year eq ' + currentYear + ' and courseExam/examPeriod eq ' + currentPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false')).value;

        // if its empty it means that the recent grades are a period prior
        if (recentGrades.length === 0){
            let lastPeriod;
            let lastYear;
            // exam periods: 1 χειμερινο, 3 εαρινο, 5 Σεπτεμβριου
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
            // getting recent grades from the previous period
            recentGrades = (await universisGet('students/me/grades?$filter=courseExam/year eq ' + lastYear + ' and courseExam/examPeriod eq ' + lastPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false')).value;
        }

        //for loop
        console.log(recentGrades);
        
    });

</script>


{#each recentGrades as recentGrade } 

    <p>hello</p>
    <GradeCard subject = {recentGrade}/>

{/each}