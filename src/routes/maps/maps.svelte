<script lang="ts">
	import SubPageHeader from "$components/shared/subPageHeader.svelte";
	import { getLocale, t } from "$src/lib/i18n";
    import type Fuse from "fuse.js";
    import { fetchBuildings, fetchRoomsForBuildings, flattenRooms, createRoomSearch, markRoomsWithGis, type RoomWithBuilding } from "./helper";
    import { onMount } from "svelte";
    import * as gis from "./gis";
    import type { BuildingInfo, Rooms } from "./types";
    import { trash, caretDown, close } from "ionicons/icons";
	import { icon } from "leaflet";


    let L: any;
    let map: any;
    let mapContainer: HTMLElement;
    let featureLayerGroup: any;

    //control state
    let facultyDropdownOpen = false;
    let activeRoom: RoomWithBuilding|undefined = undefined;
    
    //stateful variables
    let isLoading = false; 
    let searchQuery = "";
    let selectedFaculty = "";
    let buildings: BuildingInfo[] = [];
    let buildingsRooms: Record<string, Rooms["rooms"]> = {};
    let allRooms: RoomWithBuilding[] = [];
    let fuse: Fuse<RoomWithBuilding>|undefined = undefined;
    
    // derived variables
    $: buildingIds = new Set(buildings.map(b => b.bldId))
    $: faculties = [...new Set(allRooms.map(r => r.faculty).filter(Boolean))].sort();
    function updateSearchResults(searchQuery: string) {
        if (!fuse || !searchQuery) return [];
        const results = fuse.search(searchQuery);
        return selectedFaculty ? results.filter(r => r.item.faculty === selectedFaculty) : results;
    }
    $: searchResults = updateSearchResults(searchQuery);

    async function loadBuildings() {
        buildings = await fetchBuildings();
    }

    async function loadRooms() {
        isLoading = true;
        const [roomsData, gisSpaceIds] = await Promise.all([
            fetchRoomsForBuildings(buildingIds),
            gis.getAllSpaceIds()
        ]);
        buildingsRooms = roomsData;
        allRooms = markRoomsWithGis(flattenRooms(buildingsRooms), gisSpaceIds);
        fuse = createRoomSearch(allRooms);
        isLoading = false;
    }

    onMount(async () => {
        if (typeof window !== 'undefined') {
            L = (await import('leaflet')).default;
            // @ts-ignore
            await import('leaflet/dist/leaflet.css');
        }

        if (mapContainer && L) {
            map = L.map(mapContainer, { zoomControl: false }).setView([40.6300, 22.9550], 17);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 22
            }).addTo(map);
            featureLayerGroup = L.layerGroup().addTo(map);
        }

        // map.whenReady(async () => {setTimeout(() => {map.invalidateSize();}, 1000);});
    });

    async function displayRoom(room: RoomWithBuilding) {
        activeRoom = room;
        if (!map || !featureLayerGroup) return;

        console.log("Displaying room:", JSON.stringify(room));

        featureLayerGroup.clearLayers();

        // If room doesn't have GIS, fall back to building coordinates
        if (!room.hasGis) {
            const building = buildings.find(b => b.bldId === room.bldId);
            if (building && building.latY && building.longX) {
                L.marker([building.latY + 0.0026, building.longX + 0.0017])
                    .addTo(featureLayerGroup)
                map.setView([building.latY + 0.0026, building.longX + 0.0017], 18);
            } else {
                alert(`Room "${room.roomName}" has no location data available.`);
            }
            return;
        }

        isLoading = true;

        try {
            const spaceInfo = await gis.getSpaceById(room.rommId);
            if (!spaceInfo) return;

            const { SPACEID, FLOORKEY } = spaceInfo.attributes;
            const [geometries, floorDesign] = await Promise.all([
                gis.getSpaceGeometry(SPACEID),
                FLOORKEY ? gis.getFloorDesign(FLOORKEY) : { features: [] }
            ]);

            // Floor design (walls, doors)
            if ((floorDesign as any)?.features?.length > 0) {
                L.geoJSON(gis.offsetGeoJSON(floorDesign), {
                    style: () => ({ color: '#333', weight: 1, opacity: 0.8, fillColor: '#f4f4f4', fillOpacity: 0.5 })
                }).addTo(featureLayerGroup);
            }

            // Room polygon
            if (geometries.polygon) {
                const layer = L.geoJSON(gis.offsetGeoJSON(geometries.polygon), {
                    style: { color: '#0056b3', weight: 3, fillOpacity: 0.6, fillColor: '#007bc2' }
                }).addTo(featureLayerGroup);
                map.fitBounds(layer.getBounds(), { padding: [100, 100], maxZoom: 19 });
            }

            // Room point marker
            if (geometries.point) {
                const layer = L.geoJSON(gis.offsetGeoJSON(geometries.point), {
                    pointToLayer: (_: any, latlng: any) => L.circleMarker(latlng, {
                        radius: 6, fillColor: "red", color: "#000", weight: 1, opacity: 1, fillOpacity: 0.8
                    })
                }).addTo(featureLayerGroup);
                if (!geometries.polygon) {
                    map.setView(layer.getLayers()[0].getLatLng(), 19);
                }
            }
        } catch (e) {
            console.error("Failed to load room geometry", e);
        } finally {
            isLoading = false;
        }
    }

    function clearDisplay(){
        searchQuery="";
        searchResults=[]; 
        selectedFaculty="";
        featureLayerGroup?.clearLayers();
        activeRoom = undefined;
    }

    function floorDecode(floorCode: string, isMezz: boolean): string {
        // Coded Values: [99: Εξωτερικός χώρος] , [I00: Ισόγειο] , [O01: 1ος όροφος] , ...10 more... )
        // isMezz: true/false ημιόροφος
        const locale = getLocale();
        if (floorCode.startsWith("I")){
            return isMezz ? $t('maps.floor.ground_mezzanine') : $t('maps.floor.ground');
        }
        else if (floorCode.startsWith("O")){
            const floorNumber = parseInt(floorCode.slice(1));
            return isMezz ? $t('maps.floor.above_mezzanine', { floor: floorNumber }) : $t('maps.floor.above', { floor: floorNumber });
        }
        else if (floorCode === "99"){
            return $t('maps.floor.outdoor');
        }
        return floorCode;
    }

</script>

<ion-page>
	<SubPageHeader title={$t('maps.title')} stackedNav />
    <div id="map-wrapper" bind:this={mapContainer}></div>
    <div id="top-controls">
        <div class="search-container" on:focusout={() => {searchResults=[];}} on:focusin={() => {searchResults=updateSearchResults(searchQuery);}}>
            <div id="search-row-wrapper">
                <input id="searchbox" placeholder="Search Classrooms" autocomplete="off" bind:value={searchQuery} />
                <div 
                    id="trashcan" 
                    on:click={clearDisplay} 
                    aria-hidden 
                    class="ion-activatable"
                    class:disabled={!searchQuery && !selectedFaculty}
                >
                    <ion-ripple-effect></ion-ripple-effect>
                    <ion-icon icon={trash}></ion-icon>
                </div>
            </div>

            <div class="debug-buttons">
                <span>{isLoading? "Loading": ""}</span>
                <button on:click={loadBuildings}>Load Buildings</button>
                <button on:click={loadRooms} disabled={buildingIds.size === 0}>Load Rooms</button>
            </div>
            <div id="faculty-filter-row-wrapper">
                <div id="faculty-filter" on:click={() => {facultyDropdownOpen = !facultyDropdownOpen}} aria-hidden class="ion-activatable">
                    <ion-ripple-effect></ion-ripple-effect>
                    <span>
                        {selectedFaculty || "All Schools"}
                    </span>
                    <ion-icon icon={caretDown}></ion-icon>
                </div>
            </div>
            {#if searchResults.length > 0}
                <ul class="autocomplete">
                    {#each searchResults as { item }}
                        <li on:mousedown={() => {displayRoom(item);searchResults=[]}} class:has-gis={item.hasGis} aria-hidden>
                            {#if item.hasGis}<span class="gis-indicator">📍</span>{/if}
                            {item.roomCode} - {item.roomName} - {item.bldName}
                        </li>
                    {/each}
                </ul>
            {/if}
            {#if facultyDropdownOpen}                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="dropdown-backdrop" on:click={() => facultyDropdownOpen = false}></div>                <div id="faculty-filter-dropdown">
                    <ul class="autocomplete">
                        <li on:click={() => {selectedFaculty=""; facultyDropdownOpen=false;}} aria-hidden>All Schools</li>
                        {#each faculties as faculty}
                            <li on:click={() => {selectedFaculty=faculty; facultyDropdownOpen=false;}} aria-hidden>{faculty}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    </div>
    {#if activeRoom}
        <div id="bottom-controls">
            <span id="bottom-faculty">{activeRoom.faculty}</span>
            <ion-icon id="bottom-close" icon={close} on:click={clearDisplay} aria-hidden />
            <span id="bottom-room-name">{activeRoom.roomName}</span>
            <span id="bottom-floor">{floorDecode(activeRoom.floor, activeRoom.isMezz)}</span>
            <span id="bottom-building-name">{activeRoom.bldName}</span>
        </div>
    {/if}
</ion-page>

<style>
    @import 'leaflet/dist/leaflet.css';

    #faculty-filter-row-wrapper {
        margin-top: 0.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
    }

    #faculty-filter{
        position: relative;
        padding: 8px 16px 8px 16px; /* top | left and right | bottom */
        font-size: 1rem;
        border: 1px solid #CCC;
        /* text-box: trim-both cap alphabetic; */
        border-radius: 50rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        cursor: pointer;
    }

    #search-row-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
    }

    #trashcan {
        position: relative;
        padding: 8px;
        border: solid 1px #CCC;
        border-radius: 8px;
        font-size: 1.2rem;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #trashcan.disabled {
        opacity: 0.4;
        pointer-events: none;
        cursor: default;
    }


    #searchbox {
        flex: 1;
        padding: 8px 16px 8px 16px; /* top | left and right | bottom */
        font-size: 1rem;
        border: 1px solid #CCC;
        /* text-box: trim-both cap alphabetic; */
        border-radius: 50rem;
    }

    .debug-buttons {
        display:flex;
        flex-direction: row;
    }

    .search-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .autocomplete {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid #ccc;
        list-style: none;
        margin: 0;
        margin-top: 0.5rem;
        padding: 0;
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 1000;
        width: 100%;
        border-radius: 1rem;
    }

    .autocomplete li {
        padding: 10px 14px;
        cursor: pointer;
        /* color: #888; */
    }

    .autocomplete li:first-child {
        border-radius: 1rem 1rem 0 0;
    }

    .autocomplete li:last-child {
        border-radius: 0 0 1rem 1rem;
    }

    .autocomplete li:only-child {
        border-radius: 1rem;
    }

    .autocomplete li.has-gis {
        color: #000;
    }

    .autocomplete li:hover {
        background: #f1f1f1;
    }

    #faculty-filter-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1001;
    }

    #faculty-filter-dropdown .autocomplete {
        position: relative;
        top: 0;
    }

    .dropdown-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
    }

    #map-wrapper {
		position: fixed;
        width: 100%;
        height: 100%;
	}

    #top-controls {
        position: absolute;
        width: 100%;
        z-index: 1000;
        background: white;
        padding: 1rem;
        border-radius: 0 0 2rem 2rem;
        border-style: solid;
        border-color: #E8E8E8;
        border-width:  0 0 1px 0;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        clip-path: inset(0px 0px -100vh 0px);
    }

    #bottom-controls {
        position: absolute;
        width: 100%;
        bottom: -2px;
        z-index: 1000;
        background: white;
        padding: 1rem;
        border-radius: 2rem 2rem 0 0;
        border-style: solid;
        border-color: #E8E8E8;
        border-width:  1px 0 0 0;
        box-shadow: rgba(100, 100, 111, 0.2) 0px -7px 29px 0px;
        clip-path: inset(-100vh 0px 0px 0px);
    }

</style>