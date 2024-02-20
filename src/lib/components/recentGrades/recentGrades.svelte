<script>

    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
    import GradeCard from "../../../routes/recentGrades/recentGradesCard.svelte";
    import { dismissedGrades } from "../../../routes/recentGrades/dismissedGrades"
;

    let examPeriod = [];
    let recentGrades = [];
    let grades = [];

    // Subscribe to changes in dismissedGrades
    const unsubscribe = dismissedGrades.subscribe(value => {
        grades = value;
    });   

    // Adding the grade from the deleted cards
    function addToDismissedGrades(id){
        dismissedGrades.update(ids => [...ids, id]);
    }

    function removeFromDismissedGrades(id){
        dismissedGrades.update(grades => grades.filter(grade => false));
    }


    onMount(async () => {
        // getting the current period and year 
        examPeriod = (await universisGet("students/me/department?$expand=departmentConfiguration($expand=examYear,examPeriod)&$top=1&$skip=0&$count=false"));

        let currentPeriod = examPeriod.currentPeriod;
        if (currentPeriod === 2) currentPeriod = 1;
        if (currentPeriod === 4) currentPeriod = 3;
        if (currentPeriod === 6) currentPeriod = 5;

        let currentYear = examPeriod.currentYear;

        // getting recent grades based on the current period, if empty that exam period didn't arrive
        recentGrades = (await universisGet('students/me/grades?$filter=courseExam/year eq ' + currentYear + ' and courseExam/examPeriod eq ' + currentPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false')).value;

        // if its empty it means that the recent grades are a period prior
        if (recentGrades.length === 0){
            let lastPeriod;
            let lastYear;

            // exam periods: 1-2 winter, 3-4 sprint, 5-6 september
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

        // removing the grades that are already deleted
        for (const recentGrade of recentGrades){           
            if (grades.includes(recentGrade.courseExam.id)){
                recentGrades = recentGrades.filter((grade) => grade.courseExam.id !== recentGrade.courseExam.id);
            }
        }
    

    });       

    // remove card when swipped
    const deleteCard = (id) => {
        const examId = id.detail;
        recentGrades = recentGrades.filter((course) => course.courseExam.id !== examId);
        addToDismissedGrades(examId);
    }

</script>


<ion-content>

    {#each recentGrades as recentGrade } 

        <GradeCard subject = {recentGrade} on:delete-card={deleteCard}/>

    {/each}

</ion-content>



