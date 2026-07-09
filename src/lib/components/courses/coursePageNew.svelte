<script lang="ts">
    import SubPageHeader from "$components/shared/subPageHeader.svelte";
	import { neoUniversisGet } from "$src/lib/dataService";
    import { t } from "$src/lib/i18n";
	import { NewCourseType } from "$types/courseType";
	import { onMount } from "svelte";
    import CoursesSkeleton from "./coursesSkeleton.svelte";

    export let id: string;

    async function fetchCourseContents(): Promise<NewCourseType>{
        
        const decodedCourseID = decodeURIComponent(id);
        // OData escapes a single quote inside a string literal by doubling it
        const courseIdLiteral = encodeURIComponent(`'${decodedCourseID.replace(/'/g, "''")}'`);

        const courses: NewCourseType[] = (await neoUniversisGet(
            `Students/me/courses?$filter=course/id eq ${courseIdLiteral}&$expand=course($expand=locale),courseType($expand=locale),gradeExam($expand=instructors($expand=instructor($select=InstructorSummary)))&$orderby=semester%20desc,gradeYear%20desc&$top=-1&$count=false`,
            {forceFresh: true}
        )).value

        console.log(courses)

        return courses[0];
    }
    

</script>

<ion-content fullscreen>
	<SubPageHeader title={$t('course.title')} stackedNav />
    {#await fetchCourseContents()}
		<ion-progress-bar type="indeterminate" />
		{#each { length: 3 } as i}
			<CoursesSkeleton />
		{/each}
    {:then courseDetails}
	    <p>{id}</p>
        <p>{courseDetails.courseTitle}</p>
    {:catch error}
		<p>{error.message}</p>
	{/await}
</ion-content>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}
</style>
