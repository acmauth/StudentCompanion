import { fetchData } from './fetchData.js';
import { degreeGradeUpdate } from './degreeGradeUpdate.js';

/**
 * @param { { title: string, id: string, semester_id: number, semester_name: string, grade: number, input_grade: string, coefficient: number; }[] } unpassed_courses
 * @param { { based: { grade_sum:number, coefficient: number}, simple: {grade_sum: number, passed: number}; } } sums
 * @param { { based: {value: number, stringed: string}, simple: {value: number, stringed: string}; } } degree_grade
 */
export async function main(unpassed_courses, sums, degree_grade) {
    let not_passed_all_courses = await fetchData(unpassed_courses, sums); 

    let sums_temp = { based: {grade_sum:0, coefficient: sums.based.coefficient}, simple: {grade_sum: 0, passed: sums.simple.passed} };
    degreeGradeUpdate(degree_grade, sums, sums_temp);

    return not_passed_all_courses;
}; 