<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import SubPageHeader from '$shared/subPageHeader.svelte';
    import red_pointer from '$lib/assets/red_pointer.svg'
    import blue_pointer from '$lib/assets/blue_pointer.svg'
    import coordinates from "$lib/components/map/coordinates.json"

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

            const redIcon = leaflet.icon({
                iconUrl:  red_pointer,
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -38] 
            });

            const blueIcon = leaflet.icon({
                iconUrl:  blue_pointer,
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -38] 
            });

            for (const point of points) {
                const { name, name_el, coordinates, pointer } = point;
                if (pointer == "blue"){
                    leaflet.marker([coordinates.lat, coordinates.lng], { icon: blueIcon }).addTo(map)
                        .bindPopup(name_el)
                        .openPopup();
                }
                else {
                    leaflet.marker([coordinates.lat, coordinates.lng], { icon: redIcon }).addTo(map)
                        .bindPopup(name_el)
                        .openPopup();
                }
                    
                
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