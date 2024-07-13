import { neoUniversisGet } from "$lib/dataService";

export async function gatherRecentGrades(refresh: boolean = false){
    const options = {forceFresh: refresh, lifetime: 60 * 60 * 1}
    // getting the current period and year 
    let examPeriods = (await neoUniversisGet("students/me/grades?$select=courseExam/year as gradeYear,courseExam/examPeriod as examPeriod&$orderByDescending=courseExam/year&$thenByDescending=courseExam/examPeriod&$top=-1&$count=false", options)).value;
    
    // exam periods: winter=1, spring=3, september=5
    const currentYear = examPeriods[examPeriods.length-1].gradeYear;
    const currentPeriod = examPeriods[examPeriods.length-1].examPeriod;
    
    // getting recent grades based on the current period, if empty that exam period didn't arrive
    let recentGrades = (await neoUniversisGet('students/me/grades?$filter=courseExam/year eq ' + currentYear + ' and courseExam/examPeriod eq ' + currentPeriod + '&$expand=course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false', options)).value;
    
    return recentGrades;
}