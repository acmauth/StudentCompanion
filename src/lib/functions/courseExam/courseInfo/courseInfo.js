
   	import { neoUniversisGet } from "$lib/dataService" 

    let courses;
    let registrations;
    let courseTitle;
    let semester;
    let ects;
    let courseType;
    let period;
    let season;
    /**
 * @type {{ familyName: any; givenName: any; }[]}
 */
    let courseInstructors;
    let weeklyHours;

    
		/**
 * @param {any} courseID;
 */
		export async function courseInformation(courseID) {

            let courseInfo = decodeURIComponent(courseID);

            courses = [];
			registrations = [];
			courseTitle = "";
			semester = "";
			ects = 0;
			courseInstructors = [];
    		weeklyHours = 0;
            courseType = "";
            period = "";
            season = "";

           try {

     

        // Getting an array with courses
        courses = (await neoUniversisGet("students/me/courses?$top=-1",{lifetime: 600})).value;

        // Getting an array with user's registered courses and information about them
        registrations = (await neoUniversisGet("students/me/Registrations?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$skip=0&$count=false",{lifetime: 600})).value;


        // Finding the course and storing informations about it in variables
        
        for (const course of courses) {
            if (course.course === courseInfo){
                courseTitle = course.courseTitle;
                semester = course.semester.id;
                ects = course.ects;
                weeklyHours = course.hours;
                courseType = course.courseType.abbreviation;
                if (course.gradePeriodDescription != null) {
                    period = `${course.gradePeriodDescription} ${course.gradeYear.name}`;
                }
                
                season = course.lastRegistrationPeriod.name;
                
                
               
            }
        }

        // Getting the instructors' names for the course from the registrations

        try {
        let flag = false;
        for (const semester of registrations){
            for (const classes of semester.classes){
                if (classes.course === courseInfo){
                    for (const instructor of classes.courseClass.instructors){
                        courseInstructors.push({familyName: instructor.instructor.familyName, givenName: instructor.instructor.givenName});
                    }
                    flag = true;
                }
                if (flag)
                    break;
            }
            if (flag)
                break;
        }

    } catch (error) {
        console.log(error)
    }


		const courseInformation = {
			"courseTitle": courseTitle,
			"semester": semester,
			"ects": ects,
			"courseInstructors": courseInstructors,
			"weeklyHours": weeklyHours,
            "courseType": courseType,
            "period": period,
            "season": season
		};


		return courseInformation;


    }
    catch (error) {
        console.error("An error occurred:", error);
        return error;
    }

		}
