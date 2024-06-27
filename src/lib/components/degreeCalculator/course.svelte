<script>
    /** @type { string } */
    export let course_title;
    /** @type { number } */
    export let course_semester_id;
    /** @type { string } */
    export let course_semester_name;
</script>


<div class="course-box">

    <div> <ion-text class="course-name">{course_title}</ion-text> </div>

    {#if course_semester_id <= 24}
    <div> <p class="course-semester">{course_semester_id}ο Εξάμηνο</p> </div>
    {:else}
    <div> <p class="course-semester">{course_semester_name}</p> </div>
    {/if}
    

</div>


<style>
    .course-box { 
        padding-left: 1em;
        padding-right: 0.5em;
        margin-bottom: 0.3em;
        flex: 3.25; /* Takes 3/4 of the available space */
    }

    .course-name {
        color: var(--app-color-degree-course);
        font-size: 1em;
        text-align: left;
    }

    .course-semester {
        margin:0;
        font-size: 0.6em;
        color: var(--app-color-degree-semester);
        text-align: left;
    }
    
</style>