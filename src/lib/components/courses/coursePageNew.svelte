<script lang="ts">
	import Chart from 'chart.js/auto';
    import SubPageHeader from "$components/shared/subPageHeader.svelte";
	import { neoUniversisGet } from "$src/lib/dataService";
    import { t, getLocale } from "$src/lib/i18n";
	import { NewCourseType, ExamStatistics } from "$types/courseType";
    import CoursesSkeleton from "./coursesSkeleton.svelte";
    import trophyOutline from "./trophy-outline.svg"
	import { getOrdinalSuffix } from '$src/routes/pages/maps/helper';

    export let id: string;

    let courseDetails: NewCourseType|null = null;
    let statistics: ExamStatistics|null = null;
    let topTen: number;
    const MAX_GRADE = 10;

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


    function gradeGauge(canvas: HTMLCanvasElement, {grade, isPassed, formattedGrade}: {grade: number, isPassed: boolean, formattedGrade: string}) {
        let current = grade;

        let colors = isPassed? {
            fill: "#0e6b0e",
            background: "#e3f2e3"
        }: {
            fill: "#6b0e0e",
            background: "#f2e3e3"
        }

        const centerText = {
            id: 'centerText',
            afterDraw(chart: Chart<'doughnut'>) {
                const { ctx, chartArea } = chart;
                const x = (chartArea.left + chartArea.right) / 2;
                const y = chartArea.bottom - 16; // near bottom, since it's a half-circle
                ctx.save();
                ctx.font = 'bold 64px sans-serif';
                ctx.fillStyle = colors.fill;
                ctx.textAlign = 'center';
                ctx.fillText(`${formattedGrade}`, x, y);
                ctx.restore();
            }
        };

        const chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [current, MAX_GRADE - current],
                    backgroundColor: [colors.fill, colors.background],
                    borderWidth: 0,
                    borderRadius: 20,       // rounded ends, like your screenshot
                }]
            },
            options: {
                circumference: 227,
                rotation: -113.5,
                cutout: '85%',
                aspectRatio: 2,
                devicePixelRatio: window.devicePixelRatio * 2,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                }
            },
            plugins: [centerText]
        });

        return {
            update(next: number) {
                current = next;
                chart.data.datasets[0].data = [current, MAX_GRADE - current];
                chart.update();
            },
            destroy() {
                chart.destroy();
            }
        };
    }


    function gradeDistribution(canvas: HTMLCanvasElement, statistics: ExamStatistics) {
        const barColor = "#6c63ff";
        const trackColor = "#ededf5";
        const labelColor = "#9aa0ac";

        // Aggregate the buckets into one total per integer grade (0..MAX_GRADE).
        function toCounts(stats: ExamStatistics): number[] {
            const counts = new Array(MAX_GRADE + 1).fill(0);
            for (const bucket of stats) {
                const grade = Math.round(bucket.examGrade);
                if (grade >= 0 && grade <= MAX_GRADE) {
                    counts[grade] += bucket.total;
                }
            }
            return counts;
        }

        // roundRect isn't available on older webviews, so trace the path by hand.
        function topRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
            r = Math.min(r, w / 2, h);
            ctx.beginPath();
            ctx.moveTo(x, y + h);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.lineTo(x + w - r, y);
            ctx.arcTo(x + w, y, x + w, y + r, r);
            ctx.lineTo(x + w, y + h);
            ctx.closePath();
        }

        // Light "track" behind every bar, spanning the full height of the plot.
        const trackBars = {
            id: 'trackBars',
            beforeDatasetsDraw(chart: Chart<'bar'>) {
                const { ctx, chartArea } = chart;
                ctx.save();
                ctx.fillStyle = trackColor;
                for (const bar of chart.getDatasetMeta(0).data) {
                    const width = (bar as unknown as { width: number }).width;
                    topRoundedRect(ctx, bar.x - width / 2, chartArea.top, width, chartArea.bottom - chartArea.top, width / 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        };

        let counts = toCounts(statistics);

        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: Array.from({ length: MAX_GRADE + 1 }, (_, i) => i),
                datasets: [{
                    data: counts,
                    backgroundColor: barColor,
                    borderRadius: 100,        // clamped to half the bar width -> rounded tops
                    borderSkipped: 'start',   // keep the base square, only round the top
                    barPercentage: 0.6,
                    categoryPercentage: 0.85,
                }]
            },
            options: {
                aspectRatio: 1.8,
                devicePixelRatio: window.devicePixelRatio * 2,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (item) => ` ${item.parsed.y}`
                        }
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: labelColor, font: { size: 13, weight: 'bold' } },
                    },
                    y: {
                        beginAtZero: true,
                        max: Math.max(...counts, 2),
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: labelColor, count: 3, precision: 0, font: { size: 13, weight: 'bold' } },
                    },
                },
            },
            plugins: [trackBars]
        });

        return {
            update(next: ExamStatistics) {
                counts = toCounts(next);
                chart.data.datasets[0].data = counts;
                chart.options.scales!.y!.max = Math.max(...counts, 2);
                chart.update();
            },
            destroy() {
                chart.destroy();
            }
        };
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
            {#if courseDetails.grade !== null}
                <div class="grade-gauge">
                    <canvas use:gradeGauge={{grade: courseDetails.grade*10, isPassed: !!courseDetails.isPassed, formattedGrade: courseDetails.formattedGrade}}></canvas>
                </div>
            {/if}
            {#if topTen < 10}
                <ion-chip color="success"><ion-icon src={trophyOutline} class="font-size: 34px"></ion-icon>Βρίσκεσαι στο 10% των καλύτερων βαθμών</ion-chip>
            {/if}
            <div class="course_overview">
                <ion-chip color="primary">#{courseDetails.course.displayCode}</ion-chip>
                {#if courseDetails.hours}
                    <ion-chip color="primary">{courseDetails.hours} <span class="label">Εβδ. Ώρες</span></ion-chip>
                {/if}
                <ion-chip color="primary">{courseDetails.ects} <span class="label">ECTS</span></ion-chip>
                <ion-chip color="primary">{localize(`${courseDetails.semester.alternateName}ο`, getOrdinalSuffix(Number(courseDetails.semester.alternateName)))} <span class="label">Εξάμηνο</span></ion-chip>
                <ion-chip color="primary">{localize(courseDetails.courseType.abbreviation, courseDetails.courseType.locale?.abbreviation)} <span class="label">Τύπος</span></ion-chip>
                {#if courseDetails.lastRegistrationPeriod.name}
                    <ion-chip color="primary">{localize(courseDetails.lastRegistrationPeriod.name, courseDetails.lastRegistrationPeriod.alternateName)} <span class="label">Περίοδος</span></ion-chip>
                {/if}
                {#if !courseDetails.calculateGrade}
                    <ion-chip color="warning">Δεν υπολογίζεται στον Μ.Ο.</ion-chip>
                {/if}
                <!-- Maybe show category -->
                {#if courseDetails.course.instructor}
                    <ion-chip color="warning">{localize(courseDetails.course.instructor?.givenName, courseDetails.course.instructor?.locale?.givenName)} {localize(courseDetails.course.instructor?.familyName, courseDetails.course.instructor?.locale?.familyName)}</ion-chip>
                {/if}
            </div>
        </div>

        {#if courseDetails.gradeExam && courseDetails.gradeExam.id}
            {#await fetchExamStatistics(courseDetails.gradeExam.id)}
                <p>Loading</p>
            {:then examStatistics}
                <ion-title>{$t('course.stats')}</ion-title>
                <ion-subtitle>{courseDetails.gradeExam.description}</ion-subtitle>
                {#if examStatistics.length}
                    <div class="grade-distribution">
                        <span class="chart-title">{$t('course.dist')}</span>
                        <canvas use:gradeDistribution={examStatistics}></canvas>
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

	.grade-distribution {
		display: block;
		max-width: 32rem;
		margin: 0.5rem auto 1rem;
		padding: 0.75rem 1rem 1rem;
		border-radius: 1rem;
		background: var(--ion-card-background, var(--ion-background-color));
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
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
        row-gap: .5rem;
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
