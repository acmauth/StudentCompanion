import { neoUniversisGet } from "$lib/dataService";

export async function gatherRecentGrades(refresh: boolean = false){
    const options = {forceFresh: refresh, lifetime: 60 * 60 * 1}
    // getting the current period and year 
    let examPeriod = (await neoUniversisGet("students/me/department?$expand=departmentConfiguration($expand=examYear,examPeriod)&$top=1&$skip=0&$count=false", options));

    // exam periods: 1-2 winter, 3-4 sprint, 5-6 september
    let currentPeriod = examPeriod.currentPeriod;
    if (currentPeriod === 2) currentPeriod = 3;
    if (currentPeriod === 4) currentPeriod = 3;
    if (currentPeriod === 6) currentPeriod = 5;

    let currentYear = examPeriod.currentYear;

    // getting recent grades based on the current period, if empty that exam period didn't arrive
    let recentGrades = (await neoUniversisGet('students/me/grades?$filter=courseExam/year eq ' + currentYear + ' and courseExam/examPeriod eq ' + currentPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false', options)).value;

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
        recentGrades = (await neoUniversisGet('students/me/grades?$filter=courseExam/year eq ' + lastYear + ' and courseExam/examPeriod eq ' + lastPeriod + '&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false', options)).value;
    }

    return recentGrades;
}