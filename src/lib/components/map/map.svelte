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

    const points = coordinates;

    let mapElement;
    let map; 

    onMount(async () => {

        if(browser) {
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView([40.63182425082954, 22.959049527401312], 15);
            leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            for (const point of points) {

                const { name, name_el, coordinates, pointer, url } = point;
                let popupContent = `${name_el}<br><a href=${url}> ${url} </a>`;

                let iconUrl;

                console.log("Pointer ", pointer)

                if (pointer == "department"){
                    iconUrl = university;
                }
                else if (pointer == "gym"){
                    iconUrl = gym;
                }
                else if (pointer == "lesxi"){
                    iconUrl = lesxi;
                }
                else if (pointer == "library") {
                    iconUrl = library;
                }
                else if (pointer == "observatory") {
                    iconUrl = observatory;
                }
                else if (pointer == "ceremony") {
                    iconUrl = ceremony;
                }

                console.log("Here ", iconUrl)

                const customIcon = leaflet.icon({
                    iconUrl:  iconUrl,
                    iconSize: [38, 38],
                    iconAnchor: [19, 38],
                    popupAnchor: [0, -38] 
                });

                console.log(customIcon)
                
                const marker = leaflet.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(map);
                marker.bindPopup(popupContent);
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

<ion-page>
    <SubPageHeader title="Χάρτης του Campus" />
    <div bind:this={mapElement} class="map-container"></div>
</ion-page>

<style>
    @import 'leaflet/dist/leaflet.css';

    .map-container {
        height: 100vh; 
    }
</style>