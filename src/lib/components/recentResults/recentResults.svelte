<script>
    // @ts-ignore

    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
    import { dismissedGrades } from "$components/recentResults/dismissedGrades";
    import { refresh } from "ionicons/icons";
    import { gatherNotifications } from '../../../routes/pages/notifications/notifications';
    import SwipeCard from "$components/recentResults/swipeCard.svelte";
    import RecentGrades from "$components/recentResults/recentGrades.svelte";

    /**
	 * @type {any[]}
	 */
    let examPeriod = [];
    /**
	 * @type {any[]}
	 */
    let recentGrades = [];
    /**
	 * @type {any[]}
	 */
    let allRecentGrades = []; //used to bring back recent grades with restore button
    /**
	 * @type {string | any[]}
	 */
    let grades = [];
    /**
	 * @type {any[]}
	 */
    let recentlyDismissedGrades = [];
    /**
	 * @type {any[]}
	 */
    let notifications = [];

    // Subscribe to changes in dismissedGrades
    const unsubscribe = dismissedGrades.subscribe(value => {
        grades = value;
    });   

    /**
     * Adding the course to the dismissed grades
	 * @param {any} id
	 */
    function addToDismissedGrades(id){
        dismissedGrades.update(ids => [...ids, id]);
        recentlyDismissedGrades = [...recentlyDismissedGrades, id];
    }

    /**
     * Removing the course from the dismissed grades
	 * @param {any} id
	 */
    function removeFromDismissedGrades(id){
        dismissedGrades.update(grades => grades.filter(grade => grade !== id));
    }


    onMount(async () => {
        notifications = await gatherNotifications();

        // getting the current period and year 
        examPeriod = (await universisGet("students/me/department?$expand=departmentConfiguration($expand=examYear,examPeriod)&$top=1&$skip=0&$count=false"));

        // exam periods: 1-2 winter, 3-4 sprint, 5-6 september
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

            // switch to the previous exam period
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
            
            allRecentGrades = [...recentGrades];
        }

        // removing the grades that are already deleted
        for (const recentGrade of recentGrades){           
            if (grades.includes(recentGrade.courseExam.id)){
                recentGrades = recentGrades.filter((grade) => grade.courseExam.id !== recentGrade.courseExam.id);
            }
        }
    });       

    // remove card when swipped
    const deleteCard = (/** @type {{ detail: number; }} */ id) => {
        const examId = id.detail;
        recentGrades = recentGrades.filter((course) => course.courseExam.id !== examId);
        addToDismissedGrades(examId);
    }

    function restoreDeletedCard(){
        let id = recentlyDismissedGrades[recentlyDismissedGrades.length - 1];
        recentlyDismissedGrades = recentlyDismissedGrades.slice(0, -1);
        removeFromDismissedGrades(id);
        for (const recentGrade of allRecentGrades){
            if (id === recentGrade.courseExam.id){
                recentGrades = [...recentGrades, recentGrade];
                let temp = [];     
                for (const grade of allRecentGrades){
                    if (recentGrades.includes(grade)){
                        temp.push(grade);
                    }
                }
                recentGrades = [...temp]; //To force svelte to rerender the component
                return;
            }
        }
    }

</script>

<div class="recentGrades ion-padding">

    {#if recentGrades.length === 0}
            <p>Δεν υπάρχουν πρόσφατες αποτελέσματα</p>
    {:else}
        {#each recentGrades as recentGrade } 
                <SwipeCard id={recentGrade.courseExam.id} on:delete-card={deleteCard} > 
                    <RecentGrades subject={recentGrade}/>
                </SwipeCard>
        {/each}
    {/if}

    <div class="button-container">
        {#if recentlyDismissedGrades.length > 0}
          <ion-button class="undoButton ion-padding" on:click={restoreDeletedCard} aria-hidden><ion-icon icon={refresh}></ion-icon></ion-button>
        {/if}
    </div>
    
</div>

<style>
    .recentGrades {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .button-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 999;
    }
    .undoButton {
        --border-radius: 1rem;
        --box-shadow: var(--shadow-short-md);
    }
</style>



