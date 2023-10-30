<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	import cheerio from 'cheerio';
	let title = ''; // Declare title as a reactive variable with a default value
	console.log('here');
	// Define a function to fetch the webpage and set the title

	onMount(async () => {
		const url = 'http://localhost:5173/getWebpage';
		console.log('what');
		try {
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);

			// Set the title in the component's state
			title = $('title').text(); // This will trigger a re-render
			console.log('Title:', title);
		} catch (error) {
			console.error('An error occurred:', error);
		}
	});
</script>

<main>
	<h1>Scraped Title</h1>
	<p>Title:{title}</p>
</main>
