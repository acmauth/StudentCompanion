<script>
// @ts-nocheck

    import SubPageHeader from '$components/shared/subPageHeader.svelte';
    import {achievementStore} from '$lib/globalFunctions/achievements';
</script>
<SubPageHeader title="Achievements Page" stackedNav/>
<ion-content>
    {#each Object.keys($achievementStore) as achievement}
        {#if $achievementStore[achievement].achieved}
        <ion-card>
            <p>{$achievementStore[achievement].title}</p>
        </ion-card>
        {/if}
    {/each}
</ion-content>