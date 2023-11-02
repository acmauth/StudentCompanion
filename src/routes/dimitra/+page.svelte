<script>
	import { onMount } from 'svelte';

	/**
	 * @type {any}
	 */
	let cafeteriaData;

	onMount(async () => {
		const response = await fetch('/cafeteriaService', { method: 'GET' });

		if (response.ok) {
			cafeteriaData = await response.json();
		} else {
			console.error('Error fetching cafeteria data:', response.statusText);
		}
	});
</script>

<h1>Μενού Λέσχης</h1>
<div>{@html cafeteriaData}</div>
