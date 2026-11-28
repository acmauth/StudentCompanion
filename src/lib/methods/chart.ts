/**
 * The single place chart.js is registered.
 *
 * chart.js ships unregistered: constructing a chart whose controller, scale or
 * plugin was never registered throws at runtime. Importing 'chart.js/auto'
 * registers everything as a module side effect, so whichever module imports it
 * silently supplies registration for every other chart in the bundle.
 *
 * Import { Chart } from here rather than from 'chart.js' directly, so a chart
 * carries its own registration instead of depending on an unrelated feature
 * having been loaded first.
 */
import Chart from 'chart.js/auto';

export { Chart };
