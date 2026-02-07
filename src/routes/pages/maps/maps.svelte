<script lang="ts">
	import SubPageHeader from "$components/shared/subPageHeader.svelte";
	import { t, getLocale } from "$src/lib/i18n";
    import type Fuse from "fuse.js";
    import { fetchBuildings, fetchRoomsForBuildings, flattenRooms, createRoomSearch, markRoomsWithGis, fetchDepartments, type RoomWithBuilding } from "./helper";
    import * as api from "./functions"
    import { onMount, onDestroy, tick } from "svelte";
    import { slide, fly } from "svelte/transition";
    import * as gis from "./gis";
    import type { BuildingInfo, Department, Rooms } from "./types";
    import { trash, caretDown, close, layersOutline, gridOutline, peopleOutline, backspaceOutline, backspace } from "ionicons/icons";
    import MapFooter from "./MapFooter.svelte";
	import { FuseResult } from "fuse.js";

    // Constants
    const MAPANIMATIONDURATION = 0.35; // seconds
    const OFFSETS = {Y: 0.0026, X: 0.0017};


    // Canvas options
    let L: any;
    let map: any;
    let mapContainer: HTMLElement;
    let selectedFeatureLayerGroup: any;
    let markerLayerGroup: any;

    //control state
    let departmentDropdownOpen = false;
    let buildingDropdownOpen = false;
    let activeRoom: RoomWithBuilding|undefined = undefined;
    // activeRoom = {"faculty":"ΣΧΟΛΗ ΓΕΩΠΟΝΙΚΗ","bldName":"ΓΕΩΠΟΝΙΑΣ ΚΑΙ ΔΑΣΟΛΟΓΙΑΣ ΚΤΙΡΙΟ Β","school":"Σχολή Γεωπονίας, Δασολογίας και Φυσικού Περιβάλλοντος","floor":"O01","isMezz":false,"roomType":"Αμφιθέατρο","roomCode":"A02","roomName":"ΑΜΦΙΘΕΑΤΡΟ Β","roomId":"001-004-O01-0-A02","capacity":"176","bldId":"19","hasGis":false};
    
    //stateful variables
    let searchBox: HTMLInputElement;
    let isLoading = false; 
    let searchQuery = "";
    let selectedDepartment: Department|undefined = undefined;
    let selectedBuilding: BuildingInfo|undefined = undefined;
    let buildings: BuildingInfo[] = [];
    let buildingsRooms: Record<string, Rooms["rooms"]> = {};
    let departments: Department[] = [];
    let allRooms: RoomWithBuilding[] = []; // flat list of all rooms with building info, used for search and display - Loaded once and kept in memory for fast access
    // let searchableRooms: RoomWithBuilding[] = []; // Filtered list of rooms that are actually searchable based on current building/department selection
    // let fuse: Fuse<RoomWithBuilding>|undefined = undefined;
    
    // derived variables
    $: buildingIds = new Set(buildings.map(b => b.bldId))
    $: faculties = [...new Set(allRooms.map(r => r.faculty).filter(Boolean))].sort();
    $: searchableRooms = updateSearchableRooms(selectedDepartment, selectedBuilding, buildings);
    $: fuse = createRoomSearch(searchableRooms);
    $: searchResults = fuzzySearchResults(searchQuery);

    function updateSearchableRooms(selectedDepartment: Department|undefined, selectedBuilding: BuildingInfo|undefined, buildings: BuildingInfo[]): RoomWithBuilding[] {
        if (selectedBuilding) {
            const availRooms = allRooms.filter(r => r.bldId === selectedBuilding.bldId);
            return availRooms;
        } else if (selectedDepartment) {
            return allRooms.filter(r => !!buildings.find(b => b.bldId === r.bldId));
        } else {
            return allRooms;
        }
    }

    async function fetchAvailableBuildings(selectedDepartment: Department|undefined): Promise<BuildingInfo[]> {
        if (!selectedDepartment) return (await api.getBuildings()).buildings;
        return (await api.getUnitBuildings(selectedDepartment.unitID)).buildings;
    }

    async function setSelectedDepartment(department: Department|undefined) {
        selectedDepartment = department;
        // Handling side-effects TODO:
        buildings = await fetchAvailableBuildings(department);
    }

    async function setSelectedBuilding(building: BuildingInfo|undefined) {
        selectedBuilding = building;
        // Handling side-effects TODO:
    }


    function fuzzySearchResults(searchQuery: string): FuseResult<RoomWithBuilding>[] {
        if (!fuse || !searchQuery) return searchableRooms.map((room, i) => ({ item: room, refIndex: i, score: 0 }));
        const results = fuse.search(searchQuery);
        return results;
    }
    
    async function loadBuildings() {
        buildings = await fetchBuildings();
    }

    async function loadDepartments() {
        departments = await fetchDepartments();
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

    function getOrdinalSuffix(n: number): string {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    function floorDecode(floorCode: string, isMezz: string): string {
        if (floorCode.startsWith("I")){
            return isMezz == "1" ? $t('maps.floor.ground_mezzanine') : $t('maps.floor.ground');
        }
        else if (floorCode.startsWith("O")){
            const floorNumber = parseInt(floorCode.slice(1));
            const ordinal = getOrdinalSuffix(floorNumber);
            return isMezz 
                ? $t('maps.floor.above_mezzanine', { floor: floorNumber, ordinal }) 
                : $t('maps.floor.above', { floor: floorNumber, ordinal });
        }
        else if (floorCode === "99"){
            return $t('maps.floor.outdoor');
        }
        return floorCode;
    }

    async function mapMarkerSelect(building: BuildingInfo) {
        setSelectedBuilding(building);
        map.flyTo([building.latY + OFFSETS.Y, building.longX + OFFSETS.X], 18, { duration: MAPANIMATIONDURATION });
        await tick(); // Wait for the UI to update with the new building selection, which will update the searchableRooms list
        if (searchableRooms.length > 0) {
            searchBox.focus();
        }
    }

    function hideMarkers(){
        map.removeLayer(markerLayerGroup);
    }

    function showMarkers(){
        if(!map.hasLayer(markerLayerGroup)){
            markerLayerGroup.addTo(map);
        }
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
            selectedFeatureLayerGroup = L.layerGroup().addTo(map);
            markerLayerGroup = L.layerGroup().addTo(map);
            map.invalidateSize();
        }

        await loadBuildings();
        await loadRooms();
        await loadDepartments();
        searchableRooms = allRooms;

        buildings.forEach(b => {
            if (b.latY && b.longX) {
                L.marker([b.latY + OFFSETS.Y, b.longX + OFFSETS.X], { title: b.name }).on('click', () => mapMarkerSelect(b)).addTo(markerLayerGroup);
            }
        });
    });

    onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});

    async function displayRoom(room: RoomWithBuilding) {
        activeRoom = room;
        if (!map || !selectedFeatureLayerGroup) return;

        console.log("Displaying room:", JSON.stringify(room));

        hideMarkers();
        selectedFeatureLayerGroup.clearLayers();

        // If room doesn't have GIS, fall back to building coordinates
        if (!room.hasGis) {
            const building = buildings.find(b => b.bldId === room.bldId);
            if (building && building.latY && building.longX) {
                L.marker([building.latY + OFFSETS.Y, building.longX + OFFSETS.X])
                    .addTo(selectedFeatureLayerGroup)
                map.flyTo([building.latY + OFFSETS.Y, building.longX + OFFSETS.X], 18, { duration: MAPANIMATIONDURATION });
            } else {
                alert(`Room "${room.roomName}" has no location data available.`);
            }
            return;
        }

        isLoading = true;

        try {
            const spaceInfo = await gis.getSpaceById(room.roomId);
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
                }).addTo(selectedFeatureLayerGroup);
            }

            // Room polygon
            if (geometries.polygon) {
                const layer = L.geoJSON(gis.offsetGeoJSON(geometries.polygon), {
                    style: { color: '#0056b3', weight: 3, fillOpacity: 0.6, fillColor: '#007bc2' }
                }).addTo(selectedFeatureLayerGroup);
                map.flyToBounds(layer.getBounds(), { padding: [100, 100], maxZoom: 19, duration: MAPANIMATIONDURATION });
            }

            // Room point marker
            if (geometries.point) {
                const layer = L.geoJSON(gis.offsetGeoJSON(geometries.point), {
                    pointToLayer: (_: any, latlng: any) => L.circleMarker(latlng, {
                        radius: 6, fillColor: "red", color: "#000", weight: 1, opacity: 1, fillOpacity: 0.8
                    })
                }).addTo(selectedFeatureLayerGroup);
                if (!geometries.polygon) {
                    map.flyTo(layer.getLayers()[0].getLatLng(), 19, { duration: MAPANIMATIONDURATION });
                }
            }
        } catch (e) {
            console.error("Failed to load room geometry", e);
        } finally {
            isLoading = false;
        }
    }

    async function clearDisplay() {
        searchQuery = "";
        buildingDropdownOpen = false;
        departmentDropdownOpen = false;
        await setSelectedDepartment(undefined);
        await setSelectedBuilding(undefined);
        selectedFeatureLayerGroup?.clearLayers();
        showMarkers();
        activeRoom = undefined;
        searchResults = [];
    }
</script>

<ion-page>
    <div id="map-wrapper" bind:this={mapContainer}></div>
    <div id="top-controls">
        <div class="search-container" on:focusout={() => {searchResults=[];}} on:focusin={() => {searchResults=fuzzySearchResults(searchQuery);}}>
            <div id="search-row-wrapper">
                <input id="searchbox" placeholder={$t('maps.search_placeholder')} class:disabled={searchableRooms.length === 0} autocomplete="off" bind:value={searchQuery} bind:this={searchBox} />
                <div 
                    id="trashcan" 
                    on:click={clearDisplay} 
                    aria-hidden 
                    class="ion-activatable"
                    class:disabled={!searchQuery && !selectedDepartment && !selectedBuilding}
                >
                    <ion-ripple-effect></ion-ripple-effect>
                    <ion-icon icon={backspace}></ion-icon>
                </div>
                {#if searchResults.length > 0}
                <ul class="autocomplete" transition:slide={{ duration: 200 }}>
                    {#each searchResults as { item } (item.roomId)}
                        <li on:mousedown={() => {displayRoom(item);searchResults=[]}} class:has-gis={item.hasGis} aria-hidden>
                            {#if item.hasGis}<span class="gis-indicator">📍</span>{/if}
                            {item.roomName} - <i class="building-name">{item.bldName}</i>
                        </li>
                    {/each}
                </ul>
            {/if}
            </div>

            <div class="debug-buttons" style="display:none;">
                <span>{isLoading ? $t('maps.loading') : ""}</span>
                <button on:click={loadBuildings}>{$t('maps.load_buildings')}</button>
                <button on:click={loadRooms} disabled={buildingIds.size === 0}>{$t('maps.load_rooms')}</button>
            </div>
            <div class="filter-row-wrapper">
                <div class="filter ion-activatable" class:disabled={!!selectedBuilding} on:click={() => {departmentDropdownOpen = !departmentDropdownOpen}} aria-hidden>
                    <ion-ripple-effect></ion-ripple-effect>
                    <span>{selectedDepartment ? (getLocale()=="el" ? selectedDepartment.name : selectedDepartment.nameEn) : $t('maps.all_departments')}</span>
                    <ion-icon icon={caretDown}></ion-icon>
                </div>
            </div>
            <div class="filter-row-wrapper">
                <div class="filter ion-activatable" on:click={() => {buildingDropdownOpen = !buildingDropdownOpen}} aria-hidden>
                    <ion-ripple-effect></ion-ripple-effect>
                    <span>{selectedBuilding?.name || $t('maps.all_buildings')}</span>
                    <ion-icon icon={caretDown}></ion-icon>
                </div>
            </div>
            {#if departmentDropdownOpen}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="dropdown-backdrop" on:click={() => departmentDropdownOpen = false}></div>
                <div id="department-select" class="filter-dropdown" transition:slide={{ duration: 200 }}>
                    <ul class="autocomplete">
                        <li on:click={async () => {departmentDropdownOpen=false; await setSelectedDepartment(undefined); }} aria-hidden>{$t('maps.all_departments')}</li>
                        {#each departments as department}
                            <li on:click={async () => {departmentDropdownOpen=false; await setSelectedDepartment(department); }} aria-hidden>{getLocale()=="el" ? department.name : department.nameEn}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
            {#if buildingDropdownOpen}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="dropdown-backdrop" on:click={() => buildingDropdownOpen = false}></div>
                <div id="building-select" class="filter-dropdown" transition:slide={{ duration: 200 }}>
                    <ul class="autocomplete">
                        <li on:click={async () => { buildingDropdownOpen=false; await setSelectedBuilding(undefined);}} aria-hidden>{$t('maps.all_buildings')}</li>
                        {#each buildings as building}
                            <li on:click={async () => { buildingDropdownOpen=false; await setSelectedBuilding(building);}} aria-hidden>{building.name}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    </div>
    {#if activeRoom}
        <div id="bottom-controls" transition:fly={{ y: 200, duration: MAPANIMATIONDURATION * 1000 }}>
            <ion-icon id="bottom-close" icon={close} on:click={clearDisplay} aria-hidden />
            <span id="bottom-faculty">{activeRoom.faculty}</span>
            <h2 id="bottom-room-name">{activeRoom.roomName}</h2>
            <span id="bottom-building-name">{activeRoom.bldName}</span>
            <div id="bottom-meta">
                <ion-chip>
                    <ion-icon icon={layersOutline}></ion-icon>
                    <ion-label>{floorDecode(activeRoom.floor, activeRoom.isMezz)}</ion-label>
                </ion-chip>
                {#if activeRoom.capacity}
                    <ion-chip>
                        <ion-icon icon={peopleOutline}></ion-icon>
                        <ion-label>{activeRoom.capacity}</ion-label>
                    </ion-chip>
                {/if}
                <ion-chip>
                    <ion-icon icon={gridOutline}></ion-icon>
                    <ion-label>{activeRoom.roomType}</ion-label>
                </ion-chip>
            </div>
        </div>
    {:else}
        <div id="map-footer-container" transition:fly={{ y: -200, duration: MAPANIMATIONDURATION * 1000 }}>
            <MapFooter/>
        </div>
    {/if}
</ion-page>

<style>
    @import 'leaflet/dist/leaflet.css';

    #map-footer-container{
        display:block;
    }

    #bottom-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--ion-color-medium);
    }

    .filter-row-wrapper {
        margin-top: 0.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .filter {
        position: relative;
        padding: 8px 16px;
        font-size: 1rem;
        border: 1px solid var(--ion-border-color, #ccc);
        border-radius: 50rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        cursor: pointer;
        background: var(--app-color-map-input);
        color: var(--app-color-map-input-text);
    }

    .disabled {
        opacity: 0.4;
        pointer-events: none;
        cursor: default;
    }

    .building-name {
        font-size: 0.85rem;
        color: var(--ion-color-medium);
    }

    #search-row-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
        anchor-name: --search-row;
    }

    #trashcan {
        position: relative;
        padding: 8px;
        border: solid 1px var(--ion-border-color, #ccc);
        border-radius: 8px;
        font-size: 1.2rem;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--app-color-map-input);
        color: var(--app-color-map-input-text);
        transition: all 0.3s ease;
    }

    #searchbox {
        flex: 1;
        padding: 8px 16px;
        font-size: 1rem;
        border: 1px solid var(--ion-border-color, #ccc);
        border-radius: 50rem;
        background: var(--app-color-map-input);
        color: var(--app-color-map-input-text);
    }

    #searchbox::placeholder {
        color: var(--ion-color-medium);
    }

    .debug-buttons {
        display: flex;
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
        background: var(--ion-background-color, white);
        border: 1px solid var(--ion-border-color, #ccc);
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


    #department-select {
        anchor-name: --department-select;
    }

    #building-select {
        anchor-name: --building-select;
    }

    #search-row-wrapper .autocomplete {
        top: anchor(--search-row bottom) !important;
    }

    #department-select .autocomplete {
        top: anchor(--department-select bottom) !important;
    }

    #building-select .autocomplete {
        top: anchor(--building-select bottom) !important;
    }

    .autocomplete li {
        padding: 10px 14px;
        cursor: pointer;
        color: var(--ion-text-color);
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
        color: var(--ion-text-color);
    }

    .autocomplete li:hover {
        background: var(--ion-color-light);
    }

    .filter-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1001;
    }

    .filter-dropdown .autocomplete {
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
        background: var(--ion-background-color, white);
        padding: 1rem;
        border-radius: 0 0 2rem 2rem;
        border-style: solid;
        border-color: var(--ion-border-color, #E8E8E8);
        border-width: 0 0 1px 0;
        box-shadow: var(--shadow-md);
        clip-path: inset(0px 0px -100vh 0px);
    }

    #bottom-controls {
        position: absolute;
        width: 100%;
        bottom: -2px;
        z-index: 1000;
        background: var(--ion-background-color, white);
        padding: 1.25rem 1rem 1.5rem;
        border-radius: 1.5rem 1.5rem 0 0;
        border-style: solid;
        border-color: var(--ion-border-color, #E8E8E8);
        border-width: 1px 0 0 0;
        box-shadow: rgba(100, 100, 111, 0.2) 0px -7px 29px 0px;
        clip-path: inset(-100vh 0px 0px 0px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        text-align: center;
    }

    #bottom-faculty {
        font-size: 0.75rem;
        color: var(--ion-color-medium);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
    }

    #bottom-room-name {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: var(--ion-text-color);
    }

    #bottom-building-name {
        font-size: 0.9rem;
        color: var(--ion-color-step-600, #999);
        margin-bottom: 0.5rem;
    }

    #bottom-meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.25rem;
    }

    #bottom-meta ion-chip {
        --background: var(--ion-color-light);
        --color: var(--ion-color-dark);
        margin: 0;
    }

    @media (min-width: 768px) {
        #top-controls {
            width: 50%;
            left: 25%;
        }
        #bottom-controls {
            width: 50%;
            left: 25%;
        }
    }

    @media (min-width: 1024px) {
        #top-controls {
            width: 33%;
            left: 33%;
        }
        #bottom-controls {
            width: 33%;
            left: 33%;
        }

        #map-footer-container{
            display:none;
        }
    }

</style>