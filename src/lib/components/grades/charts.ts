import type { Plugin } from 'chart.js';
import { Chart } from '$lib/chart';
import type { Registration } from '$types/grades';

/** Weighted average per semester, keyed by semester id. */
export function gpaPerSemester(registrations: Registration[]): Record<number, string> {
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

// Bottom padding
const BOTTOM_SHARE = 0.2;
const FLAT_PADDING = 0.5;

/** Bottom of the y axis for these averages; undefined lets chart.js pick when there are none. */
function yMin(averages: Record<number, string>): number | undefined {
	const values = Object.values(averages).map(Number);
	if (!values.length) return undefined;

	const lowest = Math.min(...values);
	const range = Math.max(...values) - lowest;
	return lowest - (range ? (range * BOTTOM_SHARE) / (1 - BOTTOM_SHARE) : FLAT_PADDING);
}

type GradeChartParams = { registrations: Registration[]; title: string };

const FILL_RADIUS = 16;
const clipped = new WeakSet<Chart>();


// Round the chart
const roundedFill: Plugin<'line'> = {
	id: 'roundedFill',
	beforeDatasetsDraw(chart) {
		const points = chart.getDatasetMeta(0).data;
		if (points.length < 2) return;

		const { top, bottom } = chart.chartArea;
		const left = points[0].x;
		const right = points[points.length - 1].x;

		chart.ctx.save();
		chart.ctx.beginPath();
		chart.ctx.roundRect(left, top, right - left, bottom - top, [0, 0, FILL_RADIUS, FILL_RADIUS]);
		chart.ctx.clip();
		clipped.add(chart);
	},
	beforeDatasetDraw(chart) {
		if (clipped.delete(chart)) chart.ctx.restore();
	}
};

const LABEL_SIZE = 11;
const LABEL_OFFSET_VERTICAL = 8;
const LABEL_GAP = 6;

type PointLabel = { text: string; centre: number };


// Label every n-th point if screen narrow
function labelStep(labels: PointLabel[], width: (label: PointLabel) => number): number {
	for (let step = 1; step < labels.length; step++) {
		const shown = labels.filter((_, i) => (labels.length - 1 - i) % step === 0);
		const fits = shown.every(
			(label, i) =>
				i === 0 ||
				shown[i - 1].centre + width(shown[i - 1]) / 2 + LABEL_GAP <= label.centre - width(label) / 2
		);
		if (fits) return step;
	}
	return labels.length;
}


// Add grade per semester above the points
const pointLabels: Plugin<'line'> = {
	id: 'pointLabels',
	afterDatasetsDraw(chart) {
		const meta = chart.getDatasetMeta(0);
		// Averages from gpaPerSemester, in the same order as the points.
		const values = Object.values(chart.data.datasets[0].data);
		const { ctx, chartArea } = chart;

		ctx.save();
		ctx.font = `600 ${LABEL_SIZE}px ${Chart.defaults.font.family}`;
		// Same colour as the axis tick labels.
		ctx.fillStyle = Chart.defaults.color as string;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';

		const width = (label: PointLabel) => ctx.measureText(label.text).width;
		const labels = meta.data.map((point, i) => {
			const text = Number(values[i]).toFixed(1);
			const half = ctx.measureText(text).width / 2;
			// Keep labels at the ends inside the shaded area rather than centred on its edge.
			const centre = Math.min(Math.max(point.x, chartArea.left + half), chartArea.right - half);
			return { text, centre };
		});

		const step = labelStep(labels, width);
		labels.forEach((label, i) => {
			if ((labels.length - 1 - i) % step === 0) {
				ctx.fillText(label.text, label.centre, meta.data[i].y - LABEL_OFFSET_VERTICAL);
			}
		});
		ctx.restore();
	}
};

/**
 * Svelte action drawing how the weighted average evolves across semesters.
 */
export function gradeEvolutionChart(
	canvas: HTMLCanvasElement,
	{ registrations, title }: GradeChartParams
) {
	const root = document.body.classList.contains('dark') ? document.body : document.documentElement;
	const primaryColor = getComputedStyle(root).getPropertyValue('--app-color-grade-graph').trim();
	const gradeFill = getComputedStyle(root).getPropertyValue('--app-color-grade-graph-fill').trim();

	const averages = gpaPerSemester(registrations);

	const chart = new Chart(canvas, {
		type: 'line',
		plugins: [roundedFill, pointLabels],
		data: {
			datasets: [
				{
					data: averages as any,
					fill: { target: 'origin', above: gradeFill },
					tension: 0.4,
					borderColor: primaryColor,
					backgroundColor: 'primaryColor'
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animations: { x: { duration: 0 }, y: { duration: 0 } },
			layout: { padding: { top: LABEL_SIZE + LABEL_OFFSET_VERTICAL + 2 } },
			scales: {
				y: { display: false, beginAtZero: false, min: yMin(averages) },
				x: { grid: { display: false }, border: { display: false } }
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
			const averages = gpaPerSemester(next.registrations);
			chart.data.datasets[0].data = averages as any;
			chart.options.scales!.y!.min = yMin(averages);
			chart.options.plugins!.title!.text = next.title;
			chart.update();
		},
		destroy() {
			chart.destroy();
		}
	};
}
