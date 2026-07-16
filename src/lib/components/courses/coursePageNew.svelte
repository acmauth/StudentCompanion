<script lang="ts">
	import Chart from 'chart.js/auto';
    import SubPageHeader from "$components/shared/subPageHeader.svelte";
	import { neoUniversisGet } from "$src/lib/dataService";
    import { t, getLocale } from "$src/lib/i18n";
	import { NewCourseType, ExamStatistics } from "$types/courseType";
    import CoursesSkeleton from "./coursesSkeleton.svelte";
    import trophyOutline from "./trophy-outline.svg"
	import { getOrdinalSuffix } from '$src/routes/pages/maps/helper';
    import { gradeGaugeChart, gradeDistributionChart } from './charts';
    

    export let id: string;

    let courseDetails: NewCourseType|null = null;
    let statistics: ExamStatistics|null = null;
    let topTen: number;

    function localize(Greek: string, English: string|null|undefined) {
        if (!English){
            return Greek;
        }
        if (getLocale() == "en" && English){
            return English;
        } else {
            return Greek;
        }
    }


    async function fetchCourseContents(): Promise<NewCourseType>{
        
        const decodedCourseID = decodeURIComponent(id);
        // OData escapes a single quote inside a string literal by doubling it
        const courseIdLiteral = encodeURIComponent(`'${decodedCourseID.replace(/'/g, "''")}'`);

        const courseObj: NewCourseType = (await neoUniversisGet(
            `Students/me/courses?$filter=course/id eq ${courseIdLiteral}&$expand=course($expand=locale,instructor($select=InstructorSummary)),courseType($expand=locale),gradeExam($expand=instructors($expand=instructor($select=InstructorSummary)))&$orderby=semester%20desc,gradeYear%20desc&$top=-1&$count=false`,
            // {forceFresh: true}
        )).value[0]
        courseDetails = courseObj;
        console.log(courseDetails)

        return courseObj;
    }

    async function fetchExamStatistics(id: number): Promise<ExamStatistics>{
        const examStatistics: ExamStatistics = (await neoUniversisGet(`students/me/exams/${id}/statistics?$top=-1`))

        statistics = examStatistics;

        // Checking if grade is top 10
        if (courseDetails && statistics && courseDetails.grade !== null){
            const myGrade = courseDetails.grade;
            // students strictly better than me across all grade buckets
            const studentsAbove = statistics.reduce(
                (sum, bucket) => bucket.examGrade > myGrade ? sum + bucket.total : sum,
                0
            );
            // true if my grade bucket at least reaches into the top 10 ranks
            console.log(studentsAbove)
            // if (studentsAbove < 10){
            //     topTen = studentsAbove;
            // }
            topTen = studentsAbove < 10? studentsAbove : undefined;
            // topTen = 500;
        }

        return examStatistics
    }

    async function fetchCourseSyllabusEudoxus(courseID: string): Promise<{syllabus: any, eudoxus: any}>{
        // Thanks @Panagiotis Skoulis!
        const syllabus_info = await fetch(`https://courses.auth.gr/services/course-catalogue/v1p1/qa/CourseOutlines/${encodeURI(courseID)}?$top=1&$skip=0&$count=false`)
        if (syllabus_info.ok) {
            const {syllabus, eudoxus} = await syllabus_info.json();
            return {syllabus, eudoxus}
        }
        else {
            throw "Couldn't retrieve course Syllabus info"
        }
    }
    

</script>

<ion-content fullscreen>
    {#await fetchCourseContents()}
        <SubPageHeader title={id} stackedNav />
		<ion-progress-bar type="indeterminate" />
		{#each { length: 3 } as i}
			<CoursesSkeleton />
		{/each}
    {:then courseDetails}
        <SubPageHeader title={localize(courseDetails.courseTitle, courseDetails.course.locale?.name)} stackedNav />

        <div class="course_view">  
            <!-- Grade Gauge -->
            {#if courseDetails.grade !== null}
                <div class="grade-gauge">
                    <canvas use:gradeGaugeChart={{grade: courseDetails.grade*10, isPassed: !!courseDetails.isPassed, formattedGrade: courseDetails.formattedGrade}}></canvas>
                </div>
            {/if}

            <!-- Gamification chip -->
            {#if topTen < 10}
                <ion-chip color="success"><ion-icon src={trophyOutline} style="font-size:1rem"></ion-icon>Βρίσκεσαι στο 10% των καλύτερων βαθμών</ion-chip>
            {/if}

            <div class="course_overview">
                <!-- Course Code -->
                <ion-chip color="primary">#{courseDetails.course.displayCode}</ion-chip>
                <!-- Course Hours -->
                {#if courseDetails.hours}
                    <ion-chip color="primary">{courseDetails.hours} <span class="label">Εβδ. Ώρες</span></ion-chip>
                {/if}
                <!-- Course ECTS -->
                <ion-chip color="primary">
                    {courseDetails.ects} <span class="label">ECTS</span>
                </ion-chip>
                <!-- Course Semester -->
                <ion-chip color="primary">
                    {localize(`${courseDetails.semester.alternateName}ο`, getOrdinalSuffix(Number(courseDetails.semester.alternateName)))} <span class="label">Εξάμηνο</span>
                </ion-chip>
                <!-- Course Type -->
                <ion-chip color="primary">
                    {localize(courseDetails.courseType.abbreviation, courseDetails.courseType.locale?.abbreviation)} <span class="label">Τύπος</span>
                </ion-chip>
                <!-- Course Period -->
                {#if courseDetails.lastRegistrationPeriod.name}
                    <ion-chip color="primary">
                        {localize(courseDetails.lastRegistrationPeriod.name, courseDetails.lastRegistrationPeriod.alternateName)} <span class="label">Περίοδος</span>
                    </ion-chip>
                {/if}
                <!-- Course Calculated? -->
                {#if !courseDetails.calculateGrade}
                    <ion-chip color="warning">Δεν υπολογίζεται στον Μ.Ο.</ion-chip>
                {/if}
                <!-- Maybe show category -->
                {#if courseDetails.course.instructor}
                    <ion-chip color="warning">
                        {localize(courseDetails.course.instructor?.givenName, courseDetails.course.instructor?.locale?.givenName)} {localize(courseDetails.course.instructor?.familyName, courseDetails.course.instructor?.locale?.familyName)}
                    </ion-chip>
                {/if}
            </div>
        </div>
        <ion-accordion>
            {#await fetchCourseSyllabusEudoxus(courseDetails.id)}
                Loading...
            {:then CourseSyllabusEudoxus} 
                <p>{CourseSyllabusEudoxus.syllabus}</p>
                <p>{CourseSyllabusEudoxus.eudoxus}</p>
            {/await}
        </ion-accordion>

        {#if courseDetails.gradeExam && courseDetails.gradeExam.id}
            {#await fetchExamStatistics(courseDetails.gradeExam.id)}
                <p>Loading</p>
            {:then examStatistics}
                <ion-title>{$t('course.stats')}</ion-title>
                <ion-subtitle>{courseDetails.gradeExam.description}</ion-subtitle>
                {#if examStatistics.length}
                    <div class="grade-distribution">
                        <span class="chart-title">{$t('course.dist')}</span>
                        <canvas use:gradeDistributionChart={examStatistics}></canvas>
                    </div>
                {/if}
            {:catch error}
		        <p>{error.message}</p>
            {/await}
        {/if}

    {:catch error}
		<p>{error.message}</p>
	{/await}
</ion-content>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}

	.grade-gauge {
		max-width: 16rem;
		margin: 0 auto;
	}

	.grade-distribution .chart-title {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: var(--ion-color-medium);
	}

    .course_overview {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        column-gap: 1rem;
        row-gap: .35rem;
        align-items: center;
        justify-content: center;
        justify-content: safe center;
    }

    .label {
        color: var(--ion-color-medium);
        font-weight: normal;
    }

    ion-chip {
        font-weight: bold;
        gap: 0.5em;
        flex-shrink: 0;
        white-space: nowrap;
        width: fit-content
    }

    .course_view{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: .75rem;
    }

</style>
