<script>
    import { MapLibre, Popup, Marker} from 'svelte-maplibre';
    import coordinates from "$lib/components/map/coordinates.json"
    import SubPageHeader from '$shared/subPageHeader.svelte';
    const points = coordinates;
</script>

<ion-page>
    <SubPageHeader title="Χάρτης του Campus" />
    <MapLibre
    center={[22.959049527401312, 40.63182425082954]}
    zoom={15}
    class="map"
    standardControls
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" >

        {#each points as { name, name_el, coordinates, color }}
            <Marker 
            lngLat={coordinates} 
            class="bg-{color} h-8 w-2">
            <Popup>
                <div class="popup-title-el">{name_el}</div>
                <div class="popup-title-eng">{name}</div>
            </Popup>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path
                  fill="{color}"
                  stroke="{color}"
                  d="M14 11.5A2.5 2.5 0 0 0 16.5 9A2.5 2.5 0 0 0 14 6.5A2.5 2.5 0 0 0 11.5 9a2.5 2.5 0 0 0 2.5 2.5M14 2c3.86 0 7 3.13 7 7c0 5.25-7 13-7 13S7 14.25 7 9a7 7 0 0 1 7-7M5 9c0 4.5 5.08 10.66 6 11.81L10 22S3 14.25 3 9c0-3.17 2.11-5.85 5-6.71C6.16 3.94 5 6.33 5 9Z"
                /></svg
              >

            </Marker>
        {/each}
    
    </MapLibre>


</ion-page>


<style>
    :global(.map) {
        height: 100vh;
    }

    .popup-title-el {
        font-size: 13px;
        font-weight: bold;
        align-items: center;
    }

    .popup-title-eng {
        font-size: 12px;
        align-items: center;
    }

</style>


