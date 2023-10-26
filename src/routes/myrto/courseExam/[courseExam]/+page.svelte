<script>
    import {page} from '$app/stores';
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    const courseCode = $page.params.courseExam;

    let i = 0
    let exam_code = [];
    var myGrade = 0;
    var students_better_than_me = 0;
    var students_like_me = 0;
    var students_worse_than_me = 0;
    var students_passed = 0;
    var students_failed = 0;

    onMount(async () => {
        let courses = await universisGet("students/me/grades?$top=-1");
        let course_exam = "";
        
        exam_code = courses.value;
        
        var found = false;
        for (const exam of exam_code){
            if (exam.course == courseCode){
                found = true;
                course_exam = exam.courseExam
                myGrade = exam.grade1
                break;
            }
        }
 
        let statistic = await universisGet(`students/me/exams/${course_exam}/statistics?$top=-1&`)

        for (const exam of statistic){
            console.log(myGrade, exam.examGrade)
            if (myGrade > exam.examGrade){
                students_worse_than_me += exam.total;
            }
            else if (myGrade < exam.examGrade){
                students_better_than_me += exam.total;
            }
            else{
                students_like_me += exam.total;
            }

            if (exam.examGrade >= 0.5){
                students_passed += exam.total;
            } 
            else{
                students_failed += exam.total;
            }
        }

    });

</script>

<style>
    .exam-title {
      color: blue;
      font-size: 24px;
      font-weight: bold;
    }
    .exam-info {
      font-size: 18px;
    }
</style>

<h1 class="exam-title">Exam Statistics for {courseCode}</h1>
<p class="exam-info">You got: {myGrade * 10}</p>
<p class="exam-info">Number of Students who got the same grade: {students_like_me - 1}</p>
<p class="exam-info">Number of Students who got a better grade: {students_better_than_me}</p>
<p class="exam-info">Number of Students who got worse grade: {students_worse_than_me}</p>
<p class="exam-info">Number of Students who passed the exam: {students_passed}</p>
<p class="exam-info">Number of Students who failed the exam: {students_failed}</p>


