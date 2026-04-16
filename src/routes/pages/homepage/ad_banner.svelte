<script lang="ts">
	import { onMount } from "svelte";
    import { neoUniversisGet } from "$src/lib/dataService";

    export let semester;
    export let departmentName;


    let isPast = new Date() > new Date("2026-02-17T15:00:00.000+02:00");
</script>

{#if !isPast && departmentName=="ΤΜΗΜΑ ΠΛΗΡΟΦΟΡΙΚΗΣ" && semester <= 8}
    <div id="ad_banner">
        <a href="https://www.instagram.com/p/DUtBFRTDf6z/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==" target="_blank"><img src="https://cdn.discordapp.com/attachments/430798390041903139/1472338652540698910/meetacm.webp?ex=699235b9&is=6990e439&hm=b4aee173afbacf4ce282852a552243d192e96fb0d9a36f20a5ce1c13575328fe" alt="meetACM"/></a>
    </div>
{/if}
<style>
    #ad_banner {
        border-radius: 1rem;
        overflow: hidden;
        aspect-ratio: 896/225;
        margin-left: 1.5rem;
        margin-right: 1.5rem;
        margin-bottom: 1.5rem;
    }

    #ad_banner a{
        width:fit-content;
        height: fit-content;
    }
</style>