// 'chart.js/auto' registers every controller as a side effect, and is the only
// auto-import in the app — $components/courses/charts.ts imports the bare
// 'chart.js' and registers nothing, so it relies on this module being loaded.
// Kept out of ./helpers.ts on purpose: chart.js is ~200KB and cannot be
// tree-shaken past a side-effecting import, so anything importing getSemester
// from helpers would drag the whole of it in.
import Chart from 'chart.js/auto';
import type { Registration } from '$types/grades';

/** Weighted average per semester, keyed by semester id. */
function gpaPerSemester(registrations: Registration[]): Record<number, string> {
	const averages: Record<number, string> = {};

	for (const registration of registrations) {
		const coefficientSum = registration.classes.reduce((sum, c) => sum + c.coefficient, 0);
		const weightedSum = registration.classes.reduce(
			(sum, c) => sum + c.coefficient * c.finalGrade,
			0
		);

		if (coefficientSum > 0) {
			averages[registration.semester] = ((10 * weightedSum) / coefficientSum).toFixed(2);
		}
	}

	return averages;
}

type GradeChartParams = { registrations: Registration[]; title: string };

/**
 * Svelte action drawing how the weighted average evolves across semesters.
 * Built once and updated in place, mirroring $components/courses/charts.ts.
 */
export function gradeEvolutionChart(
	canvas: HTMLCanvasElement,
	{ registrations, title }: GradeChartParams
) {
	const root = document.body.classList.contains('dark') ? document.body : document.documentElement;
	const primaryColor = getComputedStyle(root).getPropertyValue('--app-color-grade-graph').trim();
	const gradeFill = getComputedStyle(root).getPropertyValue('--app-color-grade-graph-fill').trim();

	const chart = new Chart(canvas, {
		type: 'line',
		data: {
			datasets: [
				{
					data: gpaPerSemester(registrations) as any,
					fill: { target: 'origin', above: gradeFill },
					tension: 0.4,
					borderColor: primaryColor,
					backgroundColor: 'primaryColor'
				}
			]
		},
		options: {
			responsive: true,
			scales: {
				y: { beginAtZero: false, grid: { display: false } },
				x: { grid: { display: false } }
			},
			plugins: {
				legend: { display: false },
				title: {
					display: true,
					text: title,
					font: { size: 15 }
				}
			}
		}
	});

	return {
		update(next: GradeChartParams) {
			chart.data.datasets[0].data = gpaPerSemester(next.registrations) as any;
			chart.options.plugins!.title!.text = next.title;
			chart.update();
		},
		destroy() {
			chart.destroy();
		}
	};
}
