import { neoUniversisGet } from "$lib/dataService";

export async function gatherRecentGrades(refresh: boolean = false){
    const options = {forceFresh: refresh, lifetime: 60 * 60 * 1}
    // calling the exam periods and years for all the graded subjects in descending order
    let examPeriods = (await neoUniversisGet("students/me/grades?$select=courseExam/year as gradeYear,courseExam/examPeriod as examPeriod&$orderby=courseExam/year desc, courseExam/examPeriod desc&$top=1&$count=false", options)).value;
    
    let recentGrades = [];
    // exam periods: winter=1, spring=3, september=5
    // last subject has the latest year and period becauses they are sorted
    if (examPeriods.length !==0) {
        const currentYear = examPeriods[0].gradeYear;
        const currentPeriod = examPeriods[0].examPeriod;
    
        // getting recent grades based on the current exam period
        recentGrades = (await neoUniversisGet('students/me/grades?$filter=courseExam/year eq ' + currentYear + ' and courseExam/examPeriod eq ' + currentPeriod + '&$expand=course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false', options)).value;
    }
    
    return recentGrades;
}