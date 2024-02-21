<script>
    /** @type {string} */
    export let course_title;
    /** @type {number} */
    export let course_semester;
</script>


<div class="course-box">

    <div> <ion-text class="course-name">{course_title}</ion-text> </div>

    <div> <p class="course-semester">{course_semester}ο Εξάμηνο</p> </div>

</div>


<style>
    .course-box {
        padding-left: 1rem;
        flex: 3.25; /* Takes 3/4 of the available space */
    }

    .course-name {
        color: #000000;
        font-size: 12px;
        text-align: left;
    }

    .course-semester {
        margin:0;
        font-size: 8px;
        color: #727272;
        text-align: left;
    }    
</style>