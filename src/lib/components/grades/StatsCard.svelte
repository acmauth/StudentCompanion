<script lang="ts">
	import { onMount } from 'svelte';
	import { averages } from '$lib/functions/gradeAverages/averages';
	import * as allIonicIcons from 'ionicons/icons';
	import Chip from '$components/shared/Chips.svelte';
	import { t } from '$lib/i18n';
	import { gradeEvolutionChart } from './charts';
	import type { course } from '$lib/types/courseType';
	import type { AveragesResult, Registration } from '$types/grades';

	export let subjects: number;
	export let passedSubjects: number;
	export let flip: () => void;
	export let subjectsJSON: course[];
	export let registrationsInDegree: Registration[];

	let gradesObject = {
		average: 0,
		weightedAverage: 0,
		grades: [] as number[],
		ects: 0
	};

	/**
	 * js-circle-progress measures its stroke width in a microtask, before our ::part
	 * styles are guaranteed to resolve, and never measures again. Redraw once the
	 * element is actually in the document so the radius accounts for stroke-width: 10.
	 */
	function remeasureRadius(node: HTMLElement & { updateGraph?: () => void }) {
		const frame = requestAnimationFrame(() => node.updateGraph?.());
		return { destroy: () => cancelAnimationFrame(frame) };
	}

	onMount(async () => {
		try {
			const avgResult: AveragesResult = await averages(subjectsJSON);

			gradesObject.average = avgResult.avg;
			gradesObject.weightedAverage = avgResult.weighted_avg;
			gradesObject.grades = avgResult.grades;
			gradesObject.ects = avgResult.ects;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<ion-card class="ion-text-center stats">
	<ion-card-header>
		<ion-card-subtitle>
			<h2 class="subtitle">{$t('progress.passed')}</h2>
		</ion-card-subtitle>
	</ion-card-header>
	<ion-card-content>
		<div class="stat_card_contents">
		{#if !subjects}
			<ion-text>{$t('progress.no_courses_found')}</ion-text>
		{:else}
			<circle-progress use:remeasureRadius max={subjects} value={passedSubjects} />
		{/if}
			<div class="stat_tiles">
				<div class="stat_tile ion-activatable ripple-parent">
					<ion-ripple-effect/>
					<span class="stat_value">{gradesObject.weightedAverage}</span>
					<span class="stat_label">{$t('progress.grade_ects')}</span>
				</div>
				<div class="stat_tile ion-activatable ripple-parent">
					<ion-ripple-effect/>
					<span class="stat_value">{gradesObject.average}</span>
					<span class="stat_label">{$t('progress.grade_simple')}</span>
				</div>
				<div class="stat_tile ion-activatable ripple-parent">
					<ion-ripple-effect/>
					<span class="stat_value">{gradesObject.ects}</span>
					<span class="stat_label">ECTS</span>
				</div>
			</div>
			<canvas
				id="gradeChart"
				use:gradeEvolutionChart={{
					registrations: registrationsInDegree,
					title: $t('progress.average_evolution')
				}}
			/>
			 </div>
			<Chip chipIcon={allIonicIcons.calculator} text={$t('progress.average_prediction')} {flip} />
	</ion-card-content>
</ion-card>

<style>

	.stat_card_contents {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stat_tiles {
		display: flex;
		gap: 0.5rem;
	}

	.stat_tile {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.9rem 0.4rem;
		border-radius: 1rem;
		background: var(--app-color-degree-chip);
		text-align: center;
        position: relative;
        overflow: hidden;
	}

	.stat_value {
		font-size: 1.4rem;
		font-weight: bold;
		color: var(--app-color-degree-chip-text);
	}

	.stat_label {
		font-size: 0.75rem;
		color: var(--ion-color-medium);
	}

	ion-text {
		color: var(--app-color-primary-dark-variation);
	}

	circle-progress::part(base) {
		width: 120px;
		height: auto;
		overflow: visible;
	}

	circle-progress::part(value) {
		stroke-width: 10;
		stroke: var(--app-color-progress-value);
	}

	circle-progress::part(circle) {
		stroke-width: 10;
		stroke: var(--app-color-progress-circle);
	}

	circle-progress::part(text) {
		font-weight: bold;
		fill: var(--app-color-primary-dark);
	}

	.subtitle {
		color: var(--app-color-primary-dark);
		font-weight: medium;
		margin: 0.5rem;
	}
</style>
