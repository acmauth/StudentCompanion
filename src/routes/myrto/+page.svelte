<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    let username = "";

    // This array is used to store all the codes that identify every exam that the user has ever taken
    let exam_code = [];

    // In this array will be stored every grade for all exams taken by the user
    // @ts-ignore
    let my_grades = [];

    // This array is used to store the number of students with a better grade (in every exam)
    // @ts-ignore
    let students_better_than_me = [];

    // This array is used to store the number of students with the same grade (in every exam)
    // @ts-ignore
    let students_like_me = [];

    // This array is used to store the number of students with a worse grade (in every exam)
    // @ts-ignore
    let students_worse_than_me = [];
   
    // This is the text that will be rendered in the HTML paragraph
    var myText = ""

    onMount(async () => {

        let personalData = await universisGet("users/me");
        let courses = await universisGet("students/me/grades?$top=-1");
        
        let i = 0
        let statistics = [];
        let students_passed = [];
        let students_failed = [];

        // The value field returns a list of objects, one for every exam
        exam_code = courses.value;
        username = personalData.name;

        for (const exam of exam_code) {
            // The formattedGrade returns the grade of a specific exam in the scale 0-10 as a string
            my_grades[i] = exam.formattedGrade;
            
            // With this API call the program gets the statistics of an exam 
            let statistic = await universisGet(`students/me/exams/${exam.courseExam}/statistics?$top=-1&`)
            statistics[i] = statistic
            i++;
        }
        
        i = 0;

        for (const statistic of statistics){
            students_like_me[i] = 0;
            students_better_than_me[i] = 0;
            students_worse_than_me[i] = 0;
            students_passed[i] = 0;
            students_failed[i] = 0;

            for (const exam of statistic){

                // @ts-ignore
                if ((my_grades[i] * 1).toFixed(1) == (exam.examGrade * 10).toFixed(1)){
                    students_like_me[i] = exam.total;
                }
                // @ts-ignore
                else if (my_grades[i] > exam.examGrade * 10){
                    // @ts-ignore
                    students_worse_than_me[i] += exam.total;
                }
                else{
                    // @ts-ignore
                    students_better_than_me[i] += exam.total;
                }

                if (exam.examGrade >= 0.5){
                    students_passed[i] += exam.total;
                } 
                else{
                    students_failed[i] += exam.total;
                }
            }
            i++;
        }


        for (i = 0; i < exam_code.length; i++){
            myText += `Exam statistics for the class with code: ${exam_code[i].course}<br>`;
            // @ts-ignore
            myText += `Your grade: ${my_grades[i]}<br>`
            // @ts-ignore
            myText += `Students with the same grade: ${students_like_me[i]}<br>`;
            // @ts-ignore
            myText += `Students with better grade: ${students_better_than_me[i]}<br>`;
            // @ts-ignore
            myText += `Students with worse grade: ${students_worse_than_me[i]}<br>`;
            myText += `Students who failed this exam: ${students_failed[i]} <br>`;
            myText += `Students who passed this exam: ${students_passed[i]}<br><br>`;
        }

    });
    
</script>

<p>Hello {username} </p>
<p>{@html myText}</p>


