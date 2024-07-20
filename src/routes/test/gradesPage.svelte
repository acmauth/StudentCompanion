<script>
    import {navController} from '$shared/StackedNav'
    import Course from './course.svelte'

    function navigate() {
        navController.push(Course, {prop: 'Hello!'})
    }

</script>

<ion-content fullscreen>
    This is some content!
    <ion-button on:click={navigate} aria-hidden>Navigate</ion-button>
</ion-content>