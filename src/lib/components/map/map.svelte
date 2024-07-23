<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import SubPageHeader from '$shared/subPageHeader.svelte';
    import gym from '$lib/assets/gym.png';
    import university from '$lib/assets/university.png';
    import library from '$lib/assets/library.png';
    import lesxi from '$lib/assets/lesxi.png';
    import ceremony from '$lib/assets/ceremony.png';
    import observatory from '$lib/assets/observatory.png';
    import coordinates from "$lib/components/map/coordinates.json";
	import Fuse from 'fuse.js';


    let points = coordinates;
    let filteredPoints = points;

    let mapElement;
    let map; 
    let searchQuery = '';

    onMount(async () => {

        if(browser) {
            const leaflet = await import('leaflet');


            if (document.body.classList.contains('dark')) {
                map = leaflet.map(mapElement).setView([40.63182425082954, 22.959049527401312], 15);
            leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                
            }).addTo(map);

            }
            else {
                map = leaflet.map(mapElement).setView([40.63182425082954, 22.959049527401312], 15);
                leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    
                }).addTo(map);
            }

            


            renderMarkers();
        }
    });

    onDestroy(async () => {
        if(map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });

    function normalizeString(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }


    function renderMarkers() {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        
        for (const point of filteredPoints) {
            const { name, name_el, coordinates, pointer, url } = point;
            let popupContent = `${name_el}<br><a href=${url}> ${url} </a>`;

            let iconUrl;
            if (pointer == "department"){
                iconUrl = university;
            } else if (pointer == "gym"){
                iconUrl = gym;
            } else if (pointer == "lesxi"){
                iconUrl = lesxi;
            } else if (pointer == "library") {
                iconUrl = library;
            } else if (pointer == "observatory") {
                iconUrl = observatory;
            } else if (pointer == "ceremony") {
                iconUrl = ceremony;
            }

            const customIcon = L.icon({
                iconUrl:  iconUrl,
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -38] 
            });
            
            const marker = L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(map);
            marker.bindPopup(popupContent);

            // Only bind popup and open if searchQuery is not empty
            if (searchQuery.trim() !== '') {
                marker.bindPopup(popupContent).openPopup();
            }
        }
    }


    function handleSearch(event) {
        const searchQuery = normalizeString(event.target.value.trim().toLowerCase());
        
        if (searchQuery === '' || searchQuery === ' ') {
            filteredPoints = points;
            map.closePopup();
        } else {
            // Initialize Fuse.js with the points data
        const fuse = new Fuse(points, {
            keys: ['name_el'],
            threshold: 0.3, // Adjust the threshold for fuzzy matching sensitivity
            includeScore: true
        });

        // Perform the search
        const results = fuse.search(searchQuery);
        
        // Extract the items from the search results
        filteredPoints = results.map(result => result.item);
        
        // Sort filteredPoints based on the score provided by Fuse.js
        filteredPoints.sort((a, b) => {
            const scoreA = results.find(result => result.item === a).score;
            const scoreB = results.find(result => result.item === b).score;
            return scoreA - scoreB; // Sort based on the search score
        });

        // Open popup for the marker corresponding to the first occurrence of the search query
        if (filteredPoints.length > 0) {
            const { coordinates, name_el, url } = filteredPoints[0];
            const popupContent = `${name_el}<br><a href=${url}> ${url} </a>`;
            map.eachLayer(layer => {
                if (layer instanceof L.Marker && layer.getLatLng().equals(coordinates)) {
                    layer.bindPopup(popupContent).openPopup();
                }
            });
        }
    }
}

</script>

<ion-page>
    <SubPageHeader title="Χάρτης του Campus" />
    <div class="search-container">
        <input type="text" placeholder="Search..." on:input={handleSearch} class="search-input" />
    </div>
    <div bind:this={mapElement} class="map-container"></div>
</ion-page>

<style>
    @import 'leaflet/dist/leaflet.css';

    .search-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background-color: var(--app-color-map-input);
        border-radius: 100px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
        padding: 5px;
        width: 80%; 
        max-width: 300px;
    }

    .search-input {
        flex: 1;
        border: none;
        outline: none;
        padding: 10px;
        font-size: 16px;
        border-radius: 100px;
        background-color: var(--app-color-map-input);
        color: var(--app-color-map-input-text);
    }

    .map-container {
        position: relative;
        height: calc(100vh); 
    }

 




</style>


