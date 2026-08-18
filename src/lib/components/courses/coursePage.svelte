<script lang="ts">
    import SubPageHeader from "$components/shared/subPageHeader.svelte";
	import { neoUniversisGet } from "$src/lib/dataService";
    import { t, getLocale } from "$src/lib/i18n";
	import type { NewCourseType, ExamStatistics, InstructorType, StudentCourseClass, StudentRegistration } from "$types/courseType";
    import CoursesSkeleton from "./coursesSkeleton.svelte";
    import ExamStatsSkeleton from "./examStatsSkeleton.svelte";
    import trophyOutline from "./trophy-outline.svg"
    import { caretDown, personCircleOutline } from "ionicons/icons";
	import { getOrdinalSuffix } from '$src/routes/pages/maps/helper';
    import { gradeGaugeChart, gradeDistributionChart } from './charts';
	import DOMPurify from 'dompurify';
	import { fade, fly } from 'svelte/transition';


    export let id: string;

    
    const reducedMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ANIMDURATION = reducedMotion ? 0 : 250; // ms
    const STAGGER = reducedMotion ? 0 : 60; // ms between stats subsections

    let courseDetails: NewCourseType|null = null;
    let statistics: ExamStatistics|null = null;
    let instructors: InstructorType[] = [];
    let topTen: number;

    
    const courseIdLiteral = encodeURIComponent(`'${decodeURIComponent(id).replace(/'/g, "''")}'`);
    const studentClassPromise = fetchStudentClass();

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

    function sanitize(input: string|any){
        if (input){
            return DOMPurify.sanitize(input, { SANITIZE_NAMED_PROPS: true });
        } else {
            return '';
        }
    }


    
    async function fetchStudentClass(): Promise<StudentCourseClass|null>{

        // Nothing here is load-bearing enough to fail the page over — losing it
        // costs the staff chips and the syllabus, not the grade.
        try {
            const registrations: StudentRegistration[] = (await neoUniversisGet(
                `Students/me/registrations?$filter=classes/courseClass/course/id eq ${courseIdLiteral}&$expand=classes($filter=course/id eq ${courseIdLiteral};$expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$count=false`
            ))?.value ?? [];

            // A repeated course appears in several registrations; the newest one
            // holds the staff that taught it most recently.
            return registrations
                .sort((a, b) =>
                    (b.registrationYear?.id - a.registrationYear?.id)
                    || (b.registrationPeriod?.id - a.registrationPeriod?.id))
                .flatMap(registration => registration.classes ?? [])[0] ?? null;
        } catch (error) {
            console.error("Could not resolve the registration for", id, error);
            return null;
        }
    }

    
    function gatherInstructors(course: NewCourseType, studentClass: StudentCourseClass|null): InstructorType[]{
        const staff = (studentClass?.courseClass?.instructors ?? []).map(entry => entry.instructor);
        const examBoard = (course.gradeExam?.instructors ?? []).map(entry => entry.instructor);
        const found = staff.length ? staff : examBoard.length ? examBoard : [course.course.instructor];

        // The same person can be listed twice when a class runs in sections
        const seen = new Set<number>();
        return found.filter((instructor): instructor is InstructorType => {
            if (!instructor || seen.has(instructor.id)) return false;
            seen.add(instructor.id);
            return true;
        });
    }

    async function fetchCourseContents(): Promise<NewCourseType>{

        const [courseObj, studentClass] = await Promise.all([
            neoUniversisGet(
                `Students/me/courses?$filter=course/id eq ${courseIdLiteral}&$expand=course($expand=locale,instructor($select=InstructorSummary)),courseType($expand=locale),gradeExam($expand=instructors($expand=instructor($select=InstructorSummary)))&$orderby=semester%20desc,gradeYear%20desc&$top=-1&$count=false`,
                // {forceFresh: true}
            ).then(response => response.value[0] as NewCourseType),
            studentClassPromise
        ]);

        courseDetails = courseObj;
        instructors = gatherInstructors(courseObj, studentClass);

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
            // if (studentsAbove < 10){
            //     topTen = studentsAbove;
            // }
            topTen = studentsAbove < 10? studentsAbove : undefined;
            // topTen = 500;
        }

        return examStatistics
    }

    async function fetchCourseSyllabusEudoxus(): Promise<{syllabus: any, eudoxus: any}>{


        const classIdentifier = (await studentClassPromise)?.courseClass?.identifier;
        if (!classIdentifier){
            return {syllabus: false, eudoxus: false}
        }

        // Thanks @Panagiotis Skoulis!
        const syllabus_info = await fetch(`https://courses.auth.gr/services/course-catalogue/v1p1/qa/CourseOutlines/${encodeURI(classIdentifier)}?$top=1&$skip=0&$count=false`)
        if (syllabus_info.status == 200) {
            const {content, eudoxus} = await syllabus_info.json();
            return {syllabus: content, eudoxus}
        }
        else {
            return {syllabus: false, eudoxus: false}
        }
    }

    function produceStatistics(courseDetails: NewCourseType, statistics: ExamStatistics){
        const avgGrade = (10 * statistics.reduce((s, i) => s + i.examGrade * i.total, 0) / statistics.reduce((s, i) => s + i.total, 0)).toFixed(1)
        const avgPassed = ((d => d ? 10 * statistics.reduce((s, i) => s + i.examGrade * i.total * i.isPassed, 0) / d : 0)(statistics.reduce((s, i) => s + i.total * i.isPassed, 0))).toFixed(1);
        const gradedTotal = statistics.reduce((s, i) => s + i.total, 0);
        const failedTotal = statistics.reduce((s, i) => s + i.total * (1-i.isPassed), 0);
        const passedTotal = statistics.reduce((s, i) => s + i.total * i.isPassed, 0);
        const myGrade = courseDetails.grade || 0;
        const betterGrades = statistics.reduce((s, i) => s + (i.examGrade > myGrade? 1 : 0) * i.total, 0)
        const equalGrades = statistics.reduce((s, i) => s + (i.examGrade == myGrade? 1 : 0) * i.total, 0)
        const worseGrades = statistics.reduce((s, i) => s + (i.examGrade < myGrade? 1 : 0) * i.total, 0)
        return {avgGrade, avgPassed, gradedTotal, failedTotal, passedTotal, betterGrades, equalGrades, worseGrades}
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

        <div class="page_contents">
            
        <div class="course_view" in:fly={{ y: 8, duration: ANIMDURATION }}>
            <!-- Grade Gauge -->
            {#if courseDetails.grade !== null}
                <div class="grade-gauge">
                    <canvas use:gradeGaugeChart={{grade: courseDetails.grade*10, isPassed: !!courseDetails.isPassed, formattedGrade: courseDetails.formattedGrade}}></canvas>
                </div>
            {:else}
                <div class="no_grade">
                    <h1>{localize(courseDetails.courseTitle, courseDetails.course.locale?.name)}</h1>
                    <span class="no_grade_value" aria-hidden="true">–</span>
                    <p class="no_grade_message">{$t('course.graded')}</p>
                </div>
            {/if}

            <!-- Gamification chip -->
            {#if topTen < 10}
                <ion-chip color="success"><ion-icon src={trophyOutline} style="font-size:1rem"></ion-icon>{$t('course.top10Percent')}</ion-chip>
            {/if}

            <div class="course_overview">
                <!-- Course Code -->
                <ion-chip color="primary">#{courseDetails.course.displayCode}</ion-chip>
                <!-- Course Hours -->
                {#if courseDetails.hours}
                    <ion-chip color="primary">{courseDetails.hours} <span class="label">{$t('course.weekly_hours_short')}</span></ion-chip>
                {/if}
                <!-- Course ECTS -->
                <ion-chip color="primary">
                    {courseDetails.ects} <span class="label">ECTS</span>
                </ion-chip>
                <!-- Course Semester -->
                <ion-chip color="primary">
                    {localize(`${courseDetails.semester.alternateName}ο`, getOrdinalSuffix(Number(courseDetails.semester.alternateName)))} <span class="label">{$t('course.semester')}</span>
                </ion-chip>
                <!-- Course Type -->
                <ion-chip color="primary">
                    {localize(courseDetails.courseType.abbreviation, courseDetails.courseType.locale?.abbreviation)} <span class="label">{$t('course.type_short')}</span>
                </ion-chip>
                <!-- Course Period -->
                {#if courseDetails.lastRegistrationPeriod.name}
                    <ion-chip color="primary">
                        {localize(courseDetails.lastRegistrationPeriod.name, courseDetails.lastRegistrationPeriod.alternateName)} <span class="label">{$t('course.period')}</span>
                    </ion-chip>
                {/if}
                <!-- Course Calculated? -->
                {#if !courseDetails.calculateGrade}
                    <ion-chip color="warning">{$t('course.not_calculated')}</ion-chip>
                {/if}
            </div>

            
            {#if instructors.length}
                <div class="instructors" in:fade={{ duration: ANIMDURATION, delay: STAGGER }}>
                    <span class="instructors_label">{$t('course.professors')}</span>
                    <div class="instructor_chips">
                        {#each instructors as instructor (instructor.id)}
                            <ion-chip color="warning">
                                <ion-icon src={personCircleOutline} style="margin: 0;"/>
                                {localize(instructor.givenName, instructor.locale?.givenName)} {localize(instructor.familyName, instructor.locale?.familyName)}
                            </ion-chip>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        <div class="syllabus_eudoxus_accordions">
            {#await fetchCourseSyllabusEudoxus()}
                <ion-accordion-group class="accordion" expand="compact" in:fade={{ duration: ANIMDURATION }}>
                        <ion-accordion value="first">
                                <ion-item slot="header">
                                    <ion-label>{$t("course.syllabus")}<ion-label/>
                                </ion-item>
                                    <p slot="content" style="white-space: pre-line;">{$t("maps.loading")}</p>
                            </ion-accordion>
                    </ion-accordion-group>
                    <ion-accordion-group class="accordion" expand="compact" in:fade={{ duration: ANIMDURATION, delay: STAGGER }}>
                            <ion-accordion value="first">
                                <ion-item slot="header">
								    <ion-label>{$t("course.eudoxus")}</ion-label>
                                </ion-item>
                                    <p slot="content" style="white-space: pre-line;">{$t("maps.loading")}</p>
                            </ion-accordion>
                        </ion-accordion-group>
            {:then CourseSyllabusEudoxus}
                    <ion-accordion-group class="accordion" expand="compact" in:fade={{ duration: ANIMDURATION }}>
                        <ion-accordion value="first">
                                <ion-item slot="header">
                                    <ion-label>{$t("course.syllabus")}<ion-label/>
                                </ion-item>
                                {#if CourseSyllabusEudoxus.syllabus}
                                    <p slot="content" style="white-space: pre-line;">{@html sanitize(CourseSyllabusEudoxus.syllabus)}</p>
                                {:else}
                                    <p slot="content" style="white-space: pre-line;">{$t("course.no_syllabus")}</p>
                                {/if}
                            </ion-accordion>
                    </ion-accordion-group>
                    <ion-accordion-group class="accordion" expand="compact" in:fade={{ duration: ANIMDURATION, delay: STAGGER }}>
                            <ion-accordion value="first">
                                <ion-item slot="header">
								    <ion-label>{$t("course.eudoxus")}</ion-label>
                                </ion-item>
                                {#if CourseSyllabusEudoxus.eudoxus}
                                    <p slot="content" style="white-space: pre-line;">{@html sanitize(CourseSyllabusEudoxus.eudoxus)}</p>
                                {:else}
                                    <p slot="content" style="white-space: pre-line;">{$t("course.no_eudoxus")}</p>
                                {/if}
                            </ion-accordion>
                        </ion-accordion-group>

            {:catch error}
                <!-- Printing nothing if this fails -->
                <!-- <p>{error.message}</p> -->
            {/await}
        </div>

        {#if courseDetails.gradeExam && courseDetails.gradeExam.id}
            <div class="stats_section" in:fly={{ y: 8, duration: ANIMDURATION }}>
                <!-- Section header (known as soon as courseDetails resolves, no need to wait) -->
                <div class="stats_header">
                    <span class="stats_title">{$t('course.stats')}</span>
                    <span class="stats_subtitle">{courseDetails.gradeExam.description}</span>
                </div>

            {#await fetchExamStatistics(courseDetails.gradeExam.id)}
                <!-- Distribution chart placeholder -->
                <div class="grade-distribution">
                    <span class="chart-title">{$t('course.dist')}</span>
                    <ion-skeleton-text animated style="width: 100%; aspect-ratio: 1.8; border-radius: 0.75rem; margin: 0;"></ion-skeleton-text>
                </div>
                <ExamStatsSkeleton />
            {:then examStatistics}
                    {#if examStatistics.length}
                        <!-- Distribution chart -->
                        <div class="grade-distribution" in:fade={{ duration: ANIMDURATION }}>
                            <span class="chart-title">{$t('course.dist')}</span>
                            <canvas use:gradeDistributionChart={examStatistics}></canvas>
                        </div>
                    {:else}
                        <p class="no_stats">{$t('course.no_stats')}</p>
                    {/if}

                    {#if examStatistics.length}
                        {#await produceStatistics(courseDetails, examStatistics)}
                            <ExamStatsSkeleton />
                        {:then insights}
                            <!-- Aggregate stat tiles -->
                            <div class="stat_tiles" in:fade={{ duration: ANIMDURATION, delay: STAGGER }}>
                                <div class="stat_tile ion-activatable ripple-parent">
                                    <ion-ripple-effect/>
                                    <span class="stat_value">{insights.avgGrade}</span>
                                    <span class="stat_label">{$t('course.average')}</span>
                                </div>
                                <div class="stat_tile ion-activatable ripple-parent">
                                    <ion-ripple-effect/>
                                    <span class="stat_value">{insights.gradedTotal}</span>
                                    <span class="stat_label">{$t('course.graded_students')}</span>
                                </div>
                                <div class="stat_tile ion-activatable ripple-parent">
                                    <ion-ripple-effect/>
                                    <span class="stat_value">{insights.avgPassed}</span>
                                    <span class="stat_label">{$t('course.successfull_average')}</span>
                                </div>
                            </div>

                            <!-- Comparison against my grade -->
                            <span class="section_label" in:fade={{ duration: ANIMDURATION, delay: STAGGER * 2 }}>{$t('course.comparison')}</span>
                            <ion-card class="stats_card" href="" in:fade={{ duration: ANIMDURATION, delay: STAGGER * 2 }}>
                                <div class="you_are_here">
                                    <div class="here_label label_label" style="">
                                        <ion-label>{$t('course.your_grade')}</ion-label>
                                        <ion-label style="font-size:1.2rem; font-weight: bold;">{courseDetails.formattedGrade}</ion-label>
                                    </div>
                                    <div class="here_label">
                                        <ion-icon src={caretDown}></ion-icon>
                                    </div>
                                    <div class="here_anchor" style="anchor-name: --grade_needle;width: 0;height: 0;margin-left: calc({((insights.worseGrades + (insights.equalGrades/2)) / insights.gradedTotal) * 100}%)"></div>
                                </div>
                                    
                                <div class="grade-comparison-bar">
                                    <div class="bar-segment bar-segment-worse" style="flex-grow: {insights.worseGrades}"></div>
                                    <div class="bar-segment bar-segment-equal" style="flex-grow: {insights.equalGrades}"></div>
                                    <div class="bar-segment bar-segment-better" style="flex-grow: {insights.betterGrades}"></div>
                                </div>
                                <div class="legend">
                                    <div class="legend_item lower">
                                        <ion-label class="category ion-color-warning">{$t('course.grade_lower')}</ion-label>
                                        <div class="legend_bottom_half">
                                            <span class="total">{insights.worseGrades}</span>
                                            <ion-label class="percentage">({(100*insights.worseGrades/insights.gradedTotal).toFixed(0)}%)</ion-label>
                                        </div>
                                    </div>
                                    <div class="legend_item similar">
                                        <ion-label class="category">{$t('course.grade_similar')}</ion-label>
                                        <div class="legend_bottom_half">
                                            <span class="total">{insights.equalGrades}</span>
                                            <ion-label class="percentage">({(100*insights.equalGrades/insights.gradedTotal).toFixed(0)}%)</ion-label>
                                        </div>
                                    </div>
                                    <div class="legend_item higher">
                                        <ion-label class="category">{$t('course.grade_higher')}</ion-label>
                                        <div class="legend_bottom_half">
                                            <span class="total">{insights.betterGrades}</span>
                                            <ion-label class="percentage">({(100*insights.betterGrades/insights.gradedTotal).toFixed(0)}%)</ion-label>
                                        </div>
                                    </div>
                                </div>
                            </ion-card>

                            <!-- Pass/fail results -->
                            <span class="section_label" in:fade={{ duration: ANIMDURATION, delay: STAGGER * 3 }}>{$t('course.results')}</span>
                            <ion-card class="stats_card" href="" in:fade={{ duration: ANIMDURATION, delay: STAGGER * 3 }}>
                                <ion-list>
                                    <ion-item>
                                        <ion-label>{$t('course.graded_students')}</ion-label>
                                        <span slot="end" class="row_value">{insights.gradedTotal}</span>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>{$t('course.passed')}</ion-label>
                                        <span slot="end" class="row_value">{insights.passedTotal}</span>
                                    </ion-item>
                                    <ion-item lines="none">
                                        <ion-label>{$t('course.failed')}</ion-label>
                                        <span slot="end" class="row_value">{insights.failedTotal}</span>
                                    </ion-item>
                                </ion-list>
                            </ion-card>

                            <div style="display:block; width: 0; height: 2rem;"></div>
                        {/await}
                    {/if}
            {:catch error}
		        <p>{error.message}</p>
            {/await}
            </div>
        {/if}

        </div>

    {:catch error}
		<p>{error.message}</p>
	{/await}
</ion-content>

<style>
	ion-content {
		--padding-end: 1.5rem;
		--padding-start: 1.5rem;
	}

    .page_contents{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .syllabus_eudoxus_accordions{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    ion-accordion {
        background: var(--ion-color-light-shade);
        border: 1px solid var(--ion-color-light-shade);
        border-radius: 1rem;
        overflow: hidden;
    }

    /* Matches ion-accordion's own look, so the loading state occupies the same
       footprint as the header that replaces it. */
    .accordion_skeleton {
        background: var(--ion-color-light-shade);
        border: 1px solid var(--ion-color-light-shade);
        border-radius: 1rem;
        overflow: hidden;
    }


    ion-accordion [slot='content'] {
        background-color: var(--ion-background-color);
        color: var(--ion-text-color);
        padding: 1rem;
        margin: 0;
     }

	.grade-gauge {
		max-width: 16rem;
		margin: 0 auto;
	}

	/* Empty state shown in place of the gauge. Height roughly tracks the gauge's
	   own (16rem wide at aspectRatio 2) so the chips below sit in the same spot
	   whether or not a grade exists. */
	.no_grade {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 8rem;
		max-width: 16rem;
		margin: 0 auto;
		text-align: center;
	}

	/* Matches the 64px bold the gauge draws its grade in. */
	.no_grade_value {
		font-size: 4rem;
		font-weight: bold;
		line-height: 1;
		color: var(--ion-color-medium);
	}

	.no_grade_message {
		margin: 0;
		font-size: 0.9rem;
		color: var(--ion-color-medium);
	}

    .legend {
        display: flex;
        flex-direction: row;
        margin: 1rem;
        justify-content: space-between;
    }

    .legend_bottom_half {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
    }

    .legend_item {
        display: flex;
        flex-direction: column;
        width: fit-content;
    }

    .legend_item .category{
        font-weight: bold;
    }

    .legend_item .total {
        font-size: 1rem;
    }

    .legend_item .percentage {
        font-size: 0.7rem;
    }

    .total {
        font-weight: bold;
    }

    .lower {
        align-items: start;
    }

    .similar {
        align-items: center;
    }

    .higher {
        align-items: end;
    }

    .lower .total {
        color: var(--ion-color-warning-shade);
    }

    .higher .total {
        color: #004C96
    }

    .ripple-parent {
        position: relative;
        overflow: hidden;
    }

	.chart-title {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
		text-align: center;
		color: var(--app-color-primary-dark);
	}

	/* Statistics section */
	.stats_section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.stats_section ion-card {
		margin-inline: 0;
		margin-block: 0;
	}

	.stats_header {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.stats_title {
		color: var(--app-color-primary-dark);
		font-weight: bold;
		font-size: 1.3rem;
	}

	.stats_subtitle {
		color: var(--ion-color-medium);
		font-size: 0.9rem;
	}

	.grade-distribution {
		/* padding-inline: 1rem; */
        padding-inline-start: 0rem;
        padding-inline-end: 1rem;
	}

	.no_stats {
		color: var(--ion-color-medium);
		margin: 0;
	}

	.stat_tiles {
		display: flex;
		gap: 0.5rem;
	}

	.stat_tile {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.9rem 0.4rem;
		border-radius: 1rem;
		background: var(--app-color-degree-chip);
		text-align: center;
	}

	.stat_value {
		font-size: 1.4rem;
		font-weight: bold;
		color: var(--app-color-degree-chip-text);
	}

	.stat_label {
		font-size: 0.75rem;
		color: var(--ion-color-medium);
	}

	.section_label {
		display: block;
		color: var(--ion-color-medium);
		font-size: 0.85rem;
		margin: 0.5rem 0.25rem -0.25rem;
	}

	.row_value {
		font-weight: bold;
		color: var(--app-color-primary-dark);
	}

	.grade-comparison-bar {
		display: flex;
		width: calc(100% - 2rem);
		box-sizing: border-box;
		height: 0.85rem;
		margin: 1rem;
		border-radius: 999px;
		overflow: hidden;
	}

	.bar-segment {
		height: 100%;
	}

	.bar-segment-worse {
		background: var(--ion-color-warning-shade);
	}

	.bar-segment-equal {
		background: var(--ion-color-medium);
	}

	.bar-segment-better {
		background: #004C96;
	}

    .you_are_here {
        position: relative;
        margin: 1rem;
        margin-bottom: -1rem;
        padding-top: 3.5rem;
    }

    .here_label.label_label {
        left: clamp(10%, anchor(center), 90%);
        margin-bottom: 1rem;
    }

    .here_label {
        position: absolute;
        position-anchor: --grade_needle;
        bottom: anchor(top);
        left: anchor(center);
        translate: -50%;
        display:flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        white-space: nowrap;
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

    
    .instructors {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        width: 100%;
        margin-top: 0.5rem;
    }

    .instructors_label {
        color: var(--ion-color-medium);
        font-size: 0.85rem;
    }

    .instructor_chips {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 0.5rem;
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
