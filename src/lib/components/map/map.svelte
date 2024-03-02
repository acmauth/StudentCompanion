<script>
    import { MapLibre, DefaultMarker, Popup, Marker} from 'svelte-maplibre';
    import coordinates from "$components/map/coordinates.json"
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

        {#each points as { name, name_el, coordinates }}
            <DefaultMarker lngLat={coordinates} class="">
            <Popup>
                <div class="popup-title-el">{name_el}</div>
                <div class="popup-title-eng">{name}</div>
            </Popup>
            </DefaultMarker>
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


