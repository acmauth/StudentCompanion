<script lang="ts">
	import ad1 from '$lib/assets/Advert_dark.png';
	import demoad from '$lib/assets/Advert_demo.png';
	export let altText: string;
	export let margin: string = '1.5';
	import { neoUniversisGet } from '$lib/dataService';
	import { onMount } from 'svelte';
	import type { Advertisements } from '$lib/types/ads';
	import { close } from "ionicons/icons";
	import { isDeleted } from './dismissableStore';

	const PROMO_CMS_URL = 'https://promotions.aristomate.gr';

	let marginStr = `margin: ${margin}rem;`;

	let matchingAd = null;
	let imageUrl = ad1;
	let adLink = 'https://forms.gle/wTAch9wZPKwztc5EA';
	let adAltText = altText;

	let departmentName: string = '';
	let semester: string = '';
	let study_level: string = '';
	let ads: Advertisements = [];

	function deleteBanner(){
		isDeleted.set(true);
	}

	async function getPersonalInfo() {
		let studyProgram = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel), department',
			{
				lifetime: 86000
			}
		);

		ads = (await fetch(
			PROMO_CMS_URL+'/promos'
		).then((res) => res.json())) as Advertisements;

		departmentName = studyProgram.department.name;
		semester = studyProgram.semester;
		study_level = studyProgram.studyProgram.studyLevel.alternateName;

		findMatchingAd();
	}

	onMount(() => {
		getPersonalInfo();
	});

	// Function to check if the department matches (handle negation '!')
	const matchesDepartment = (adDepartments: string[], studentDepartment: string): boolean => {
		return adDepartments.some((department) => {
			return department.toLowerCase() === studentDepartment.toLowerCase();
		});
	};

	// Function to find the right ad based on the filters
	const getMatchingAd = (
		ads: Advertisements,
		studentDepartment: string,
		studentSemester: number,
		studentStudyLevel: string
	) => {
		return ads.filter((ad) => {
			return (
				matchesDepartment(
					ad.filters.find((f) => f.name === 'departments').value,
					studentDepartment
				) &&
				ad.filters.find((f) => f.name === 'semesters').value.includes(studentSemester) &&
				ad.filters.find((f) => f.name === 'study_level').value.includes(studentStudyLevel)
			);
		});
	};

	function findMatchingAd() {
		matchingAd = getMatchingAd(ads, departmentName, parseInt(semester), study_level);
		if (matchingAd) {
			matchingAd = matchingAd[Math.floor(Math.random() * matchingAd.length)];
		}
		imageUrl = matchingAd ? PROMO_CMS_URL + matchingAd.content.image : ad1;
		adLink = matchingAd ? PROMO_CMS_URL + matchingAd.content.link : 'https://forms.gle/wTAch9wZPKwztc5EA';
		adAltText = matchingAd ? matchingAd.content.title : altText;
	}
</script>

{#await getPersonalInfo() then}
	{#if !$isDeleted}
		<div style={marginStr} class="card-banner">
			<a href={adLink} target="_blank"><img src={imageUrl} alt={adAltText} /></a>
			<ion-icon class="xmark" icon={ close } on:click={deleteBanner} aria-hidden></ion-icon>
		</div>
	{/if}
{/await}

<style>
	.card-banner {
		margin: 1rem;
		position: relative;
	}

	.card-banner img {
		object-fit: cover;
		width: 100%;
		aspect-ratio: 20/6;
		border-radius: 1rem;
	}

	.xmark {
		position: absolute;
		top: 0;
		right: 0;
		color: black;
		font-size: 1.5rem;
		opacity: 0.3;
	}
</style>