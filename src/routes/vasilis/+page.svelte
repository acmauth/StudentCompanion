<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    onMount(async () => {

        let grades = await universisGet("students/me/grades");

        let subjects = await universisGet("students/me/courses");
    });
</script>

<p>Hello Vasilis</p>