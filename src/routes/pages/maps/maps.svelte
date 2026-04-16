<script lang="ts">
	import { t, getLocale } from "$src/lib/i18n";
    import type Fuse from "fuse.js";
    import * as helpers from "./helper";
    import * as api from "./functions"
    import { onMount, onDestroy, tick } from "svelte";
    import { slide, fly } from "svelte/transition";
    import * as gis from "./gis";
    import type { BuildingInfo, Department, Rooms } from "./types";
    import { trash, caretDown, close, layersOutline, gridOutline, peopleOutline, backspaceOutline, backspace, mapOutline, navigate } from "ionicons/icons";
    import buildingIcon from "./icons/building.svg"
    import buildingVague from "./icons/building_vague.svg"
    import MapFooter from "./MapFooter.svelte";
	import { FuseResult } from "fuse.js";
    import markerIcon from '$lib/assets/marker.png';

    // Constants
    const MAPANIMATIONDURATION = 0.35; // seconds


    // Canvas options
    let L: any;
    let map: any;
    let mapContainer: HTMLElement;
    let selectedFeatureLayerGroup: any;
    let markerClusterGroup: any;

    //control state
    let activeRoom: helpers.RoomWithBuilding|undefined = undefined;
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
    let allRooms: helpers.RoomWithBuilding[] = []; // flat list of all rooms with building info, used for search and display - Loaded once and kept in memory for fast access
    let deptSearchQuery = "";
    let buildingSearchQuery = "";
    let allowShowingDeptResults = false;
    let allowShowingBuildingResults = false;
    
    // derived variables
    $: buildingIds = new Set(buildings.map(b => b.authBldId))
    $: searchableRooms = updateSearchableRooms(selectedDepartment, selectedBuilding, buildings);
    $: fuse = helpers.createRoomSearch(searchableRooms);
    $: deptFuse = helpers.createDeptSearch(departments);
    $: buildingFuse = helpers.createBuildingSearch(buildings);
    $: searchResults = fuzzySearchResults(searchQuery);
    $: deptSearchResults = fuzzyDeptSearchResults(deptSearchQuery);
    $: buildingSearchResults = fuzzyBuildingSearchResults(buildingSearchQuery);

    function updateSearchableRooms(selectedDepartment: Department|undefined, selectedBuilding: BuildingInfo|undefined, buildings: BuildingInfo[]): helpers.RoomWithBuilding[] {
        if (selectedBuilding) {
            const availRooms = allRooms.filter(r => r.authBldId === selectedBuilding.authBldId);
            return availRooms;
        } else if (selectedDepartment) {
            return allRooms.filter(r => !!buildings.find(b => b.authBldId === r.authBldId));
        } else {
            return allRooms;
        }
    }

    async function setSelectedDepartment(department: Department|undefined) {
        await clearActiveRoom();
        selectedDepartment = department;
        deptSearchQuery = department? department.name : "";
        buildings = await helpers.fetchAvailableBuildings(department);
    }

    async function setSelectedBuilding(building: BuildingInfo|undefined) {
        await clearActiveRoom();
        selectedBuilding = building;
        buildingSearchQuery = building? building.name : "";
    }

    function fuzzySearchResults(searchQuery: string): FuseResult<helpers.RoomWithBuilding>[] {
        if (!fuse || !searchQuery) return searchableRooms.map((room, i) => ({ item: room, refIndex: i, score: 0 }));
        const results = fuse.search(searchQuery);
        return results;
    }

    function fuzzyDeptSearchResults(deptSearchQuery: string): FuseResult<Department>[]{
        if (!deptFuse || !deptSearchQuery) return departments.map((dept, i) => ({item: dept, refIndex: i, score:0}))
        const results = deptFuse.search(deptSearchQuery);
        return results;
    }

    function fuzzyBuildingSearchResults(buildingSearchQuery: string): FuseResult<BuildingInfo>[]{
        if (!buildingFuse || !buildingSearchQuery) return buildings.map((buildingInfo, i) => ({item: buildingInfo, refIndex: i, score:0}))
        const results = buildingFuse.search(buildingSearchQuery);
        return results;
    }

    async function loadBuildings() {
        buildings = await helpers.fetchBuildings();
    }

    async function loadDepartments() {
        departments = await helpers.fetchDepartments();
    }

    async function loadRooms() {
        isLoading = true;
        const [roomsData, gisSpaceIds] = await Promise.all([
            helpers.fetchRoomsForBuildings(buildingIds),
            gis.getAllSpaceIds()
        ]);
        buildingsRooms = roomsData;
        allRooms = helpers.markRoomsWithGis(helpers.flattenRooms(buildingsRooms), gisSpaceIds);
        fuse = helpers.createRoomSearch(allRooms);
        isLoading = false;
    }

    function floorDecode(floorCode: string, isMezz: string): string {
        if (floorCode.startsWith("I")){
            return isMezz == "1" ? $t('maps.floor.ground_mezzanine') : $t('maps.floor.ground');
        }
        else if (floorCode.startsWith("O")){
            const floorNumber = parseInt(floorCode.slice(1));
            const ordinal = helpers.getOrdinalSuffix(floorNumber);
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
        map.flyTo([parseFloat(building.latY), parseFloat(building.longX)], 18, { duration: MAPANIMATIONDURATION });
        await tick(); // Wait for the UI to update with the new building selection, which will update the searchableRooms list
        await tick();
        if (searchableRooms.length > 0) {
            searchBox.focus();
        }
    }

    function hideMarkers(){
        map.removeLayer(markerClusterGroup);
    }

    function showMarkers(){
        if(!map.hasLayer(markerClusterGroup)){
            markerClusterGroup.addTo(map);
        }
    }

    onMount(async () => {
        if (typeof window !== 'undefined') {
            L = (await import('leaflet')).default;
            // @ts-ignore
            await import('leaflet/dist/leaflet.css');
            // @ts-ignore
            await import('leaflet.markercluster');
            // @ts-ignore
            await import('leaflet.markercluster/dist/MarkerCluster.css');
            // @ts-ignore
            await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
        }

        if (mapContainer && L) {
            map = L.map(mapContainer, { zoomControl: false }).setView([40.6300, 22.9550], 17);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 22
            }).addTo(map);
            selectedFeatureLayerGroup = L.layerGroup().addTo(map);
            
            // Initialize marker cluster group with custom options
            markerClusterGroup = L.markerClusterGroup({
                // Customize cluster icon
                iconCreateFunction: function(cluster: any) {
                    const count = cluster.getChildCount();
                    let size = 'small';
                    if (count > 10) size = 'medium';
                    if (count > 25) size = 'large';
                    
                    return L.divIcon({
                        html: `<div><span>${count}</span></div>`,
                        className: `marker-cluster marker-cluster-${size}`,
                        iconSize: L.point(40, 40)
                    });
                },
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                maxClusterRadius: 80,
                disableClusteringAtZoom: 20,
                animate: true,
                animateAddingMarkers: true,
                spiderfyOnMaxZoom: false,
                removeOutsideVisibleBounds: true
            });
            
            markerClusterGroup.addTo(map);
            map.invalidateSize();
        }

        await loadBuildings();
        await loadRooms();
        await loadDepartments();
        searchableRooms = allRooms;

        // Add markers to cluster group
        buildings.forEach(b => {
            if (b.latY && b.longX) {
                const marker = L.marker(
                    [parseFloat(b.latY), parseFloat(b.longX)],
                    {title: b.name, icon: L.icon({iconUrl: markerIcon,iconSize: [30, 30],iconAnchor: [15, 30],popupAnchor: [0, -30]})}
                ).on('click', () => mapMarkerSelect(b)).bindPopup(`<span>${b.name}</span>`);
                
                markerClusterGroup.addLayer(marker);
            }
        });

        const roomid = new URLSearchParams(window.location.search).get("roomid");
        if (roomid) {
            const roomToShow = allRooms.find(r => r.roomId === roomid);
            if (roomToShow) {
                displayRoom(roomToShow);
            }
        }
    });

    onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});

    async function displayRoom(room: helpers.RoomWithBuilding) {
        const bldInfo = (await api.getBuildingInfo(room.authBldId)).buildingInfo;
        room.X = parseFloat(bldInfo.longX)
        room.Y = parseFloat(bldInfo.latY)

        activeRoom = room;
        if (!map || !selectedFeatureLayerGroup) return;

        console.log("Displaying room:", JSON.stringify(room));

        hideMarkers();
        selectedFeatureLayerGroup.clearLayers();

        // If room doesn't have GIS, fall back to building coordinates
        if (!room.hasGis) {
            const building = buildings.find(b => b.authBldId === room.authBldId);
            if (building && building.latY && building.longX) {
                L.marker([parseFloat(building.latY), parseFloat(building.longX)], { title: building.name, icon: L.icon({iconUrl: markerIcon,iconSize: [30, 30],iconAnchor: [15, 30],popupAnchor: [0, -30]}) })
                    .addTo(selectedFeatureLayerGroup)
                map.flyTo([parseFloat(building.latY), parseFloat(building.longX)], 18, { duration: MAPANIMATIONDURATION });
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

    async function clearActiveRoom(){
        activeRoom = undefined;
        selectedFeatureLayerGroup?.clearLayers();
        searchResults = [];
        await tick();
    }

    async function clearDisplay() {
        searchQuery = "";
        deptSearchQuery = "";
        allowShowingDeptResults = false;
        buildingSearchQuery = "";
        allowShowingBuildingResults = false;
        await setSelectedDepartment(undefined);
        await setSelectedBuilding(undefined);
        selectedFeatureLayerGroup?.clearLayers();
        showMarkers();
        activeRoom = undefined;
        searchResults = [];
    }
</script>

    <ion-content>
        
    <div id="map-wrapper" bind:this={mapContainer}></div>
    <div id="top-controls">
        <div class="search-container">
            <div id="search-row-wrapper">
                <input class="searchbox"
                on:focusout={() => {searchResults=[];}}
                on:focusin={() => {searchResults=fuzzySearchResults(searchQuery);}}
                placeholder={activeRoom? activeRoom.roomName : $t('maps.search_placeholder')}
                class:disabled={searchableRooms.length === 0}
                autocomplete="off"
                bind:value={searchQuery}
                bind:this={searchBox} />
                <div 
                    id="trashcan" 
                    on:click={clearDisplay} 
                    aria-hidden 
                    class="ion-activatable"
                    class:disabled={!activeRoom && !selectedDepartment && !selectedBuilding}>
                    <ion-ripple-effect></ion-ripple-effect>
                    <ion-icon icon={backspace}></ion-icon>
                </div>
                {#if searchResults.length > 0}
                    <ul class="autocomplete" transition:slide={{ duration: 200 }}>
                        {#each searchResults as { item } (item.roomId)}
                            <li class="ion-activatable" on:mousedown={() => {displayRoom(item);searchResults=[]}} class:has-gis={item.hasGis} aria-hidden>
                                <ion-ripple-effect></ion-ripple-effect>
                                {item.roomName} - <i class="building-name"><ion-icon class:hasGis={item.hasGis} icon={item.hasGis? buildingIcon : buildingVague}/>{item.authBldId} {item.bldName}</i>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
            <div class="searchable-filter-row-wrapper departments">
                <input class="filter-search searchbox"
                    placeholder={selectedDepartment ? (getLocale()=="el" ? selectedDepartment.name : selectedDepartment.nameEn) : $t('maps.all_departments')}
                    bind:value={deptSearchQuery}
                    autocomplete="off"
                    class:disabled={!!selectedBuilding}
                    on:focusout={() => {deptSearchResults=[];allowShowingDeptResults=false;}}
                    on:focusin={() => {deptSearchResults=fuzzyDeptSearchResults(deptSearchQuery);allowShowingDeptResults=true;}}
                 />
                 {#if deptSearchResults.length > 0 && allowShowingDeptResults}
                    <ul class="autocomplete departments" transition:slide={{ duration: 200 }}>
                        <li class="ion-activatable" on:mousedown={() => {setSelectedDepartment(undefined);deptSearchResults=[]}} aria-hidden><ion-ripple-effect/>{$t('maps.all_departments')}</li>
                        {#each deptSearchResults as { item } (item.unitID)}
                            <li class="ion-activatable" on:mousedown={() => {setSelectedDepartment(item);deptSearchResults=[]}} aria-hidden>
                                <ion-ripple-effect/>
                                {getLocale()=="el" ? item.name : item.nameEn}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
            <div class="searchable-filter-row-wrapper buildings">
                <input class="filter-search searchbox"
                    placeholder={selectedBuilding ? (getLocale()=="el" ? selectedBuilding.name : selectedBuilding.name) : $t('maps.all_buildings')}
                    bind:value={buildingSearchQuery}
                    autocomplete="off"
                    on:focusout={() => {buildingSearchResults=[];allowShowingBuildingResults=false;}}
                    on:focusin={() => {buildingSearchResults=fuzzyBuildingSearchResults(buildingSearchQuery);allowShowingBuildingResults=true;}}
                 />
                 {#if buildingSearchResults.length > 0 && allowShowingBuildingResults}
                    <ul class="autocomplete buildings" transition:slide={{ duration: 200 }}>
                        <li class="ion-activatable" on:mousedown={() => {setSelectedBuilding(undefined); buildingSearchResults=[]}} aria-hidden><ion-ripple-effect/>{$t('maps.all_buildings')}</li>
                        {#each buildingSearchResults as { item } }
                            <li class="ion-activatable" on:mousedown={() => {setSelectedBuilding(item);buildingSearchResults=[]}} aria-hidden>
                                <ion-ripple-effect/>
                                {getLocale()=="el" ? item.name : item.name} <i class="building-name">- {item.authBldId}</i>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </div>
    </div>
    {#if activeRoom}
        <div id="bottom-controls" transition:fly={{ y: 200, duration: MAPANIMATIONDURATION * 1000 }}>
            <ion-icon id="bottom-close" icon={close} on:click={clearDisplay} aria-hidden />
            <!-- <span id="bottom-faculty">{activeRoom.faculty}</span> -->
            <h2 id="bottom-room-name">{activeRoom.roomName}</h2>
            <span id="bottom-building-name">{activeRoom.bldName}</span>
            <div id="bottom-meta">
                <ion-chip>
                    <ion-icon icon={layersOutline}></ion-icon>
                    <ion-label>{floorDecode(activeRoom.floor, '0')}</ion-label>
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
                <a href="https://www.google.com/maps?q={activeRoom.Y},{activeRoom.X}">
                    <ion-chip color="primary">
                        <ion-icon icon={navigate}></ion-icon>
                        <ion-label>{$t("maps.open_in_gmaps")}</ion-label>
                    </ion-chip>
                </a>
            </div>
        </div>
    {:else}
        <div id="map-footer-container" transition:fly={{ y: -200, duration: MAPANIMATIONDURATION * 1000 }}>
            <MapFooter/>
        </div>
    {/if}
    </ion-content>
<style>

    /* Leaflet and marker cluster styles */
    @import 'leaflet/dist/leaflet.css';
    @import 'leaflet.markercluster/dist/MarkerCluster.css';
    @import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

    :global(.marker-cluster div) {
        font-weight: bold;
    }
    
    :global(.marker-cluster span) {
        color: white;
        font-size: 12px;
        line-height: 30px;
    }
    
    :global(.marker-cluster-small) {
        background-color: #155c979f !important;
    }
    :global(.marker-cluster-small div) {
        background-color: #155C97 !important;
    }
    :global(.marker-cluster-medium) {
        background-color: #2788d89f !important;
    }
    :global(.marker-cluster-medium div) {
        background-color: #2788d8 !important;
    }
    :global(.marker-cluster-large) {
        background-color: #2297f79f !important;
    }
    :global(.marker-cluster-large div) {
        background-color: #2297f7 !important;
    }

    /* Map UI styles */
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

    .searchbox {
        flex: 1;
        padding: 8px 16px;
        font-size: 1rem;
        border: 1px solid var(--ion-border-color, #ccc);
        border-radius: 50rem;
        background: var(--app-color-map-input);
        color: var(--app-color-map-input-text);
    }

    .searchbox::placeholder {
        color: var(--ion-color-medium);
    }

    .searchable-filter-row-wrapper {
        width: 100%;
    }
    .searchable-filter-row-wrapper .searchbox {
        width: 100%;
    }

    .search-container {
        position: relative;
        display: inline-block;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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


    .searchable-filter-row-wrapper.departments {
        anchor-name: --department-select;
    }

    .searchable-filter-row-wrapper.buildings {
        anchor-name: --building-select;
    }

    #search-row-wrapper .autocomplete {
        top: anchor(--search-row bottom) !important;
    }

    .searchable-filter-row-wrapper .autocomplete.departments {
        top: anchor(--department-select bottom) !important;
    }

    .searchable-filter-row-wrapper .autocomplete.buildings {
        top: anchor(--building-select bottom) !important;
    }

    li {
        position: relative;
        overflow: hidden;
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
        --color: var(--ion-color-dark);
        margin: 0;
    }

    .hasGis {
        color: var(--ion-color-success)
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