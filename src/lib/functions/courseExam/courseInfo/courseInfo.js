
   	import { neoUniversisGet } from "$lib/dataService"
    import { locale } from "$src/lib/i18n"; 
    import { localize } from "../../localize";
    import { get } from 'svelte/store'

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
    let syllabus;
    let eudoxus;
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
            syllabus = "";
            eudoxus = "";
    		weeklyHours = 0;
            courseType = "";
            period = "";
            season = "";

           try {

     

        // Getting an array with courses
        courses = (await neoUniversisGet("students/me/courses?$expand=gradePeriod($expand=locale),courseType($expand=locale)&$top=-1",{lifetime: 600})).value;

        // Getting an array with user's registered courses and information about them
        registrations = (await neoUniversisGet("students/me/Registrations?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$skip=0&$count=false",{lifetime: 600})).value;


        console.log(registrations)
        // Finding the course and storing informations about it in variables
        console.log(get(locale))
        
        

        console.log(courses)
        for (const course of courses) {
            if (course.course === courseInfo){
                //! Course name not localized in courses
                // courseTitle = localize(course, "courseTitle", get(locale)); 
                semester = course.semester.id;
                ects = course.ects;
                weeklyHours = course.hours;
                courseType = localize(course.courseType, "abbreviation", get(locale));
                if (course.gradePeriodDescription != null) {
                    period = `${course.gradePeriodDescription} ${localize(course.gradeYear, "name", get(locale))}`;
                }
                
                season = course.lastRegistrationPeriod.name;
                try{
                    for(const sem of registrations){
                        for(const semClass of sem.classes){
                            //debug
                            // console.log(semClass.courseClass.course.id)
                            // console.log(courseInfo)
                            if(semClass.courseClass.course.id == courseInfo){
                                courseTitle = localize(semClass.courseClass.course, "name", get(locale))
                                semClass.identifier
                                let newCourseObject = await fetch(`https://courses.auth.gr/services/course-catalogue/v1p1/qa/CourseOutlines/${semClass.courseClass.identifier}?$top=1&$skip=0&$count=false`)
                                let newCourseData;
                                if(newCourseObject.ok) {
                                    newCourseData = await newCourseObject.json()
                                    console.log(newCourseData)
                                    syllabus = localize(newCourseData, "content", get(locale))
                                    eudoxus = localize(newCourseData, "eudoxus", get(locale))
                                    //debug
                                    //console.log(syllabus)
                                    //console.log(eudoxus)
                                } else {
                                    newCourseData = null
                                    alert("bad request")
                                } 
                            }
                        }
                    }
                } catch(e){
                    console.log(e)
                }
            }
        }

        // Getting the instructors' names for the course from the registrations

        try {
        let flag = false;
        for (const semester of registrations){
            for (const classes of semester.classes){
                if (classes.course === courseInfo){
                    for (const instructor of classes.courseClass.instructors){
                        courseInstructors.push({familyName: localize(instructor.instructor, "familyName", get(locale)), givenName: localize(instructor.instructor, "givenName", get(locale))});
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
            "syllabus": syllabus,
            "eudoxus": eudoxus,
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
