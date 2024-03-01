<script>
    import { MapLibre, DefaultMarker, Popup } from 'svelte-maplibre';
    import { onMount, onDestroy } from 'svelte';
    import coordinates from "$lib/assets/coordinates.json"
	import { point } from 'leaflet';
    const points = coordinates;

</script>

<MapLibre
    center={[22.959049527401312, 40.63182425082954]}
    zoom={15}
    class="map"
    standardControls
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" 
>

    {#each points as { name, name_el, coordinates }}
        <DefaultMarker lngLat={coordinates}>
        <Popup >
            <div class="popup-title-el">{name_el}</div>
            <div class="popup-title-eng">{name}</div>
        </Popup>
        </DefaultMarker>
    {/each}

</MapLibre>



<style>
    :global(.map) {
        height: 100vh;
    }

    .popup-title-el {
        font-size: 16px;
        font-weight: bold;
        align-items: center;
    }

    .popup-title-eng {
        font-size: 12px;
        align-items: center;
    }

</style>


