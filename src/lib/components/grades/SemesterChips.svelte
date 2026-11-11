<script lang="ts">
	import { getSemester } from './helpers';
	import { t, getLocale } from '$lib/i18n';
	import type { course } from '$lib/types/courseType';

	interface Props {
		coursesBySemester?: { [key: string]: course[] };
	}

	let { coursesBySemester = {} }: Props = $props();
	let semesterId = '';

	function handleClick(semId: string) {
			semesterId = semId;
			const element = document.getElementById(semesterId);
			if (element) {
				element.scrollIntoView({ 
					behavior: 'smooth',
					
				});
			}		
	}
	

</script>


<div class="chipsrow">

	{#each Object.entries(coursesBySemester) as [id, courses]}
	    <!-- svelte-ignore a11y_click_events_have_key_events -->
	    <!-- svelte-ignore a11y_no_static_element_interactions -->
		{#if courses[0].semester.id <= 24}
	    <ion-chip color="primary" onclick={() => handleClick(id)}>
	        <ion-label>{getSemester(id, getLocale())} {$t('progress.semesterL')}</ion-label>
	    </ion-chip>
		{:else}
		<ion-chip onclick={() => handleClick(id)} color="primary">
	        <ion-label>{courses[0].semester.name}</ion-label>
	    </ion-chip>
		{/if}
	{/each}

</div>	


<style>
    .chipsrow {
        overflow-x: scroll;
        white-space: nowrap;
        padding-left: 1rem;
        padding-right: 1rem;
        /* background-color: #FBFBF9; */
        &::-webkit-scrollbar {
            display: none;
        }

    }

	ion-chip {
		color: var(--app-color-primary-dark);
	}

</style>
