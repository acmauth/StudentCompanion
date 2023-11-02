<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let mapElement;
    let map; 
    let keyPoints; 

    onMount(async () => {
    	// Getting coordinates from a JSON on the AUTh-coordinates github repository
	// Feel free to add any key locations not already included
    	const response = await fetch("https://raw.githubusercontent.com/acmauth/AUTh-coordinates/main/coordinates.json")
	const json = await response.json()
	keyPoints = json

        if(browser) {
            const leaflet = await import('leaflet');

            // This part of the code sets the viewport, essentially the area the user will be greeted with
	    // This will not be dynamic, we only want this area
            map = leaflet.map(mapElement).setView([40.63182425082954, 22.959049527401312], 15);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Key locations markers loop
	    for(const key in keyPoints){
		const {name, coordinates} = keyPoints[key]; 
		//adding marker
            	leaflet.marker(coordinates).addTo(map)
                	.bindPopup(name)
                	.openPopup();
	    }
        }
    });

    onDestroy(async () => {
        if(map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });
</script>

<main>
    <div bind:this={mapElement}></div>
</main>

<style>
    @import 'leaflet/dist/leaflet.css';
    main div {
        height: 100vh;
	width: 100vw; 
    }
</style>
