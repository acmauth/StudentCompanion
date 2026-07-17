import type { ExamStatistics } from "$types/courseType";
import { Chart } from "chart.js";

const MAX_GRADE = 10;
const PASS_THRESHOLD = 5

export function gradeGaugeChart(canvas: HTMLCanvasElement, {grade, isPassed, formattedGrade}: {grade: number, isPassed: boolean, formattedGrade: string}) {
        let current = grade;

        let colors = isPassed? {
            fill: "#0e6b0e",
            background: "#e3f2e3"
        }: {
            fill: "#6b0e0e",
            background: "#f2e3e3"
        }

        const centerText = {
            id: 'centerText',
            afterDraw(chart: Chart<'doughnut'>) {
                const { ctx, chartArea } = chart;
                const x = (chartArea.left + chartArea.right) / 2;
                const y = chartArea.bottom - 16; // near bottom, since it's a half-circle
                ctx.save();
                ctx.font = 'bold 64px sans-serif';
                ctx.fillStyle = colors.fill;
                ctx.textAlign = 'center';
                ctx.fillText(`${formattedGrade}`, x, y);
                ctx.restore();
            }
        };

        const chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [current, MAX_GRADE - current],
                    backgroundColor: [colors.fill, colors.background],
                    borderWidth: 0,
                    borderRadius: 20,       // rounded ends, like your screenshot
                }]
            },
            options: {
                circumference: 227,
                rotation: -113.5,
                cutout: '85%',
                aspectRatio: 2,
                devicePixelRatio: window.devicePixelRatio * 2,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                }
            },
            plugins: [centerText]
        });

        return {
            update(next: number) {
                current = next;
                chart.data.datasets[0].data = [current, MAX_GRADE - current];
                chart.update();
            },
            destroy() {
                chart.destroy();
            }
        };
    }


export function gradeDistributionChart(canvas: HTMLCanvasElement, statistics: ExamStatistics) {
        const barColorPassed = "#004C96";
        const barColorFailed = "#A2A7AF"
        const trackColorPassed = "#DAE5F7";
        const trackColorFailed = "#C9CDD5";
        const trackColorPassedDark = "#1C2731";
        const trackColorFailedDark = "#303030";
        const labelColor = "#9aa0ac";

        // Aggregate the buckets into one total per integer grade (0..MAX_GRADE).
        function toCounts(stats: ExamStatistics): number[] {
            const counts = new Array(MAX_GRADE + 1).fill(0);
            for (const bucket of stats) {
                const grade = Math.round(bucket.examGrade*MAX_GRADE);
                if (grade >= 0 && grade <= MAX_GRADE) {
                    counts[grade] += bucket.total;
                }
            }
            return counts;
        }

        // roundRect isn't available on older webviews, so trace the path by hand.
        function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
            r = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        // Each integer grade below the pass threshold uses the "failed" colors.
        const barColors = Array.from({ length: MAX_GRADE + 1 }, (_, grade) =>
            grade < PASS_THRESHOLD ? barColorFailed : barColorPassed);
        const trackColors = Array.from({ length: MAX_GRADE + 1 }, (_, grade) =>
            grade < PASS_THRESHOLD ? trackColorFailed : trackColorPassed);
        const trackColorsDark = Array.from({ length: MAX_GRADE + 1 }, (_, grade) =>
            grade < PASS_THRESHOLD ? trackColorFailedDark : trackColorPassedDark);

        // Muted "track" behind every bar, spanning the full height of the plot.
        // The palette is resolved per draw rather than once, so a redraw after a
        // theme toggle picks up the right one.
        const trackBars = {
            id: 'trackBars',
            beforeDatasetsDraw(chart: Chart<'bar'>) {
                const { ctx, chartArea } = chart;
                const tracks = document.body.classList.contains('dark') ? trackColorsDark : trackColors;
                ctx.save();
                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    ctx.fillStyle = tracks[i];
                    const width = (bar as unknown as { width: number }).width;
                    roundedRect(ctx, bar.x - width / 2, chartArea.top, width, chartArea.bottom - chartArea.top, width / 2);
                    ctx.fill();
                });
                ctx.restore();
            }
        };

        let counts = toCounts(statistics);

        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: Array.from({ length: MAX_GRADE + 1 }, (_, i) => i),
                datasets: [{
                    data: counts,
                    backgroundColor: barColors,
                    borderRadius: 100,        // clamped to half the bar width -> rounded ends
                    borderSkipped: false,     // round the base too, not just the top
                    barPercentage: 0.75,
                    categoryPercentage: 0.85,
                }]
            },
            options: {
                aspectRatio: 1.8,
                devicePixelRatio: window.devicePixelRatio * 2,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (item) => ` ${item.parsed.y}`
                        }
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: labelColor, font: { size: 13, weight: 'bold' } },
                    },
                    y: {
                        beginAtZero: true,
                        max: Math.max(...counts, 2),
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: labelColor, count: 4, precision: 1, font: { size: 14, weight: 'bold' } },
                    },
                },
            },
            plugins: [trackBars]
        });

        return {
            update(next: ExamStatistics) {
                counts = toCounts(next);
                chart.data.datasets[0].data = counts;
                chart.options.scales!.y!.max = Math.max(...counts, 2);
                chart.update();
            },
            destroy() {
                chart.destroy();
            }
        };
    }