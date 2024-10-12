<script lang="ts">
	import ad1 from '$lib/assets/Advert_dark.png';
	export let margin: string = '1.5';
	import { neoUniversisGet } from '$lib/dataService';
	import type { Advertisements, Advert } from '$lib/types/ads';
	import { close } from 'ionicons/icons';
	import { isDeleted } from './dismissableStore';

	const PROMO_CMS_URL = 'https://promotions.aristomate.gr';
	const FALLBACK_IMAGE = ad1;
	const FALLBACK_LINK = 'https://forms.gle/wTAch9wZPKwztc5EA';

	let marginStr = `margin: ${margin}rem;`;

	let departmentName: string = '';
	let semester: string = '';
	let study_level: string = '';
	let ads: Advertisements = [];

	function deleteBanner() {
		isDeleted.set(true);
	}

	async function getPersonalInfo() {
		let studyProgram = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel), department',
			{
				lifetime: 86000
			}
		);

		ads = (await fetch(PROMO_CMS_URL + '/promos').then((res) => res.json())) as Advertisements;

		departmentName = studyProgram.department.name;
		semester = studyProgram.semester;
		study_level = studyProgram.studyProgram.studyLevel.alternateName;

		return findMatchingAd();
	}

	// Function to check if the department matches (handle negation '!')
	const matchesDepartment = (adDepartments: string[], studentDepartment: string): boolean => {
		return adDepartments.some((department) => {
			return department.toLowerCase() === studentDepartment.toLowerCase();
		});
	};

	// Function to find the right ad based on the filters
	// Filters are applied as follows:
	// 1. If the filter is '*', it matches all, thus returning true
	// 2. If the filter is an array of departments, it matches if the student's department is in the array
	// 3. If the filter is an array of numbers, it matches if the student's semester is in the array
	// 4. If the filter is an array of studyLevels (undergraduate,postgraduate,doctoral), it matches if the student's study level is in the array
	const getMatchingAd = (
		ads: Advertisements,
		studentDepartment: string,
		studentSemester: number,
		studentStudyLevel: string
	) => {
		return ads.filter((ad) => {
			return (
				(ad.filters.find((f) => f.name === 'departments')?.value.includes('*') ||
					matchesDepartment(
						(ad.filters.find((f) => f.name === 'departments')?.value as string[]) || [],
						studentDepartment
					)) &&
				(ad.filters.find((f) => f.name === 'semesters')?.value.includes('*') ||
					(
						(ad.filters.find((f) => f.name === 'semesters')?.value as (string | number)[]) || []
					).includes(studentSemester)) &&
				(ad.filters.find((f) => f.name === 'study_level')?.value.includes('*') ||
					((ad.filters.find((f) => f.name === 'study_level')?.value as string[]) || []).includes(
						studentStudyLevel
					))
			);
		});
	};

	// Find matching add based on the department, semester and study level, if multiple ads are found, return a randomly selected one
	// If no matching ads are found, returns the default promo image
	function findMatchingAd() {
		const matchingAds = getMatchingAd(ads, departmentName, parseInt(semester), study_level);
		let matchingAd: Advert | undefined;
		if (matchingAds) {
			matchingAd = matchingAds[Math.floor(Math.random() * matchingAds.length)];
		}
		const imageUrl = matchingAd ? PROMO_CMS_URL + matchingAd.content.image : FALLBACK_IMAGE;
		const adLink = matchingAd ? PROMO_CMS_URL + matchingAd.content.link : FALLBACK_LINK;
		const adAltText = matchingAd ? matchingAd.content.title : 'altText';

		return { imageUrl, adLink, adAltText };
	}
</script>

{#await getPersonalInfo()}
	<!-- <div style={marginStr} class="card-banner">
		<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={ad1} alt="Tell us your thoughts" /></a>
		<ion-icon class="xmark" icon={ close } on:click={deleteBanner} aria-hidden></ion-icon>
	</div> -->
{:then { imageUrl, adLink, adAltText }}
	{#if !$isDeleted}
		<div style={marginStr} class="card-banner">
			<a href={adLink} target="_blank"><img src={imageUrl} alt={adAltText} /></a>
			<ion-icon class="xmark" icon={close} on:click={deleteBanner} aria-hidden />
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
