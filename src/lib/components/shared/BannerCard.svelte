<script lang="ts">
	import ad1 from '$lib/assets/Advert_dark.png';
	import tifad from '$lib/assets/Advert_TIF.png';
	import demoad from '$lib/assets/Advert_demo.png';
	export let altText: string;
	export let margin: string = '1.5';
	import { neoUniversisGet } from '$lib/dataService';
	import { onMount } from 'svelte';

	let marginStr = `margin: ${margin}rem;`;
	const date = new Date();
	let validDateForTif = false;

	let departmentName: string = '';
	let semester: string = '';
	let study_level: string = '';
	let ads;

	if (date.getFullYear() == 2024 && date.getMonth() == 8 && [11, 12, 13].includes(date.getDate())) {
		validDateForTif = true;
	}

	async function getPersonalInfo() {
		let personalData = await neoUniversisGet('Students/me/', { lifetime: 86000 });
		let studyProgram = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel)',
			{
				lifetime: 86000
			}
		);
		let department = await neoUniversisGet('Students/me/department', { lifetime: 86000 });
		ads = await fetch('').then((res) => res.json());

		departmentName = department.name;
		semester = personalData.semester;
		study_level = studyProgram.studyProgram.studyLevel.alternateName;
	}

	onMount(() => {
		getPersonalInfo();
	});

	// Function to check if the department matches (handle negation '!')
	const matchesDepartment = (adDepartments: string[], studentDepartment: string): boolean => {
		return adDepartments.some((department) => {
			if (department.startsWith('!')) {
				return department.substring(1) !== studentDepartment;
			} else {
				return department === studentDepartment;
			}
		});
	};

	// Function to find the right ad based on the filters
	const getMatchingAd = (
		ads: any,
		studentDepartment: string,
		studentSemester: number,
		studentStudyLevel: string
	) => {
		return ads.find(
			(ad) =>
				matchesDepartment(
					ad.filters.find((f) => f.name === 'departments').value,
					studentDepartment
				) &&
				ad.filters.find((f) => f.name === 'semesters').value.includes(studentSemester) &&
				ad.filters.find((f) => f.name === 'study_level').value.includes(studentStudyLevel)
		);
	};

	// Find the matching ad
	let matchingAd = getMatchingAd(ads, departmentName, parseInt(semester), study_level);

	let imageUrl = matchingAd ? matchingAd.content.image : ad1;
	let adLink = matchingAd ? matchingAd.content.link : 'https://forms.gle/wTAch9wZPKwztc5EA';
	let adAltText = matchingAd ? matchingAd.content.title : altText;
</script>

<div style={marginStr} class="card-banner">
	{#if validDateForTif}
		<a href={adLink} target="_blank"><img src={imageUrl} alt={adAltText} /></a>
	{:else}
		<a href={adLink} target="_blank"><img src={imageUrl} alt={adAltText} /></a>
	{/if}
</div>

<style>
	.card-banner {
		margin: 1rem;
	}

	.card-banner img {
		object-fit: cover;
		width: 100%;
		aspect-ratio: 20/6;
		border-radius: 1rem;
	}
</style>
