<script>
    import {navController} from 'ionic-svelte'
    import Course from './course.svelte'

    function navigate() {
        navController.push(Course, {prop: 'Hello!'})
    }

</script>

<ion-content fullscreen>
    This is some content!
    <ion-button on:click={navigate}>Navigate</ion-button>
</ion-content>