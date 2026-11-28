import { queryFeatures, getLayer } from '@esri/arcgis-rest-feature-layer';
import type { IFeature } from '@esri/arcgis-rest-types';
import appConfig from '$src/app.config';

type Token = {
    token: string;
    expires: number; // expiration timestamp in ms
};

const BASE_URL = appConfig.map.gis_endpoint;
const TOKEN_URL = appConfig.map.gis_token_url;

// Token cache
let cachedToken: Token | null = null;

async function getToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (cachedToken && cachedToken.expires > Date.now() + 60000) {
        return cachedToken.token;
    }

    const response = await fetch(TOKEN_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch GIS token: ${response.status}`);
    }

    cachedToken = await response.json();
    return cachedToken!.token;
}

async function getAuthParams() {
    return { token: await getToken() };
}

async function getGeoJSONParams() {
    return { ...(await getAuthParams()), f: 'geojson' as const };
}

// Coordinate offset to align vectors with base map
const OFFSET = { x: 3, y: 1 };
const DEG_LAT = 1 / 111320;
const DEG_LNG = 1 / (111320 * Math.cos(40.63 * Math.PI / 180));

function offsetCoords(coords: any): any {
    if (typeof coords[0] === 'number') {
        return [coords[0] + OFFSET.x * DEG_LNG, coords[1] + OFFSET.y * DEG_LAT];
    }
    return coords.map(offsetCoords);
}

export function offsetGeoJSON(geojson: any): any {
    if (!geojson) return geojson;
    if (geojson.type === 'FeatureCollection') {
        return { ...geojson, features: geojson.features.map(offsetGeoJSON) };
    }
    if (geojson.type === 'Feature') {
        return { ...geojson, geometry: { ...geojson.geometry, coordinates: offsetCoords(geojson.geometry.coordinates) } };
    }
    if (geojson.coordinates) {
        return { ...geojson, coordinates: offsetCoords(geojson.coordinates) };
    }
    return geojson;
}

async function query(layerId: number, where: string, opts: { outFields?: string[]; geometry?: boolean; geojson?: boolean } = {}) {
    const { outFields = ["*"], geometry = false, geojson = false } = opts;
    const params = geojson ? await getGeoJSONParams() : await getAuthParams();
    return queryFeatures({
        url: `${BASE_URL}/${layerId}`,
        where,
        outFields,
        returnGeometry: geometry,
        outSR: geometry ? '4326' : undefined,
        params
    }) as Promise<{ features: IFeature[] }>;
}

// --- Active functions ---

export async function getAllSpaceIds(): Promise<Set<string>> {
    const res = await query(0, "1=1", { outFields: ["SPACEID"], geometry: false });
    return new Set(res.features.map(f => f.attributes.SPACEID).filter(Boolean));
}

export async function getSpaceById(spaceId: string) {
    const res = await query(0, `SPACEID='${spaceId}'`);
    return res.features[0] || null;
}

export async function getSpaceGeometry(spaceId: string) {
    const [point, poly] = await Promise.all([
        query(0, `SPACEID='${spaceId}'`, { outFields: [], geometry: true, geojson: true }),
        query(1, `SPACEID='${spaceId}'`, { outFields: [], geometry: true, geojson: true })
    ]);
    return { point: point.features[0] || null, polygon: poly.features[0] || null };
}

export async function getFloorDesign(floorKey: string) {
    return query(2, `FLOORKEY = '${floorKey}'`, { outFields: ["LINETYPE"], geometry: true, geojson: true });
}

// --- Unused (may be useful later) ---

/* unused */ export const getServiceMetadata = async (layerId?: number) =>
    getLayer({ url: layerId !== undefined ? `${BASE_URL}/${layerId}` : BASE_URL, params: await getAuthParams() });

/* unused */ export async function getUniqueValues(field: string, layerId = 0): Promise<string[]> {
    const res = await queryFeatures({
        url: `${BASE_URL}/${layerId}`,
        where: "1=1",
        outFields: [field],
        returnDistinctValues: true,
        returnGeometry: false,
        orderByFields: field,
        params: await getAuthParams()
    }) as { features: IFeature[] };
    return res.features.map(f => f.attributes[field]).filter(v => v != null && v !== "");
}

/* unused */ export const getUniqueBuildings = () => getUniqueValues("BUILDING");
/* unused */ export const getUniqueFloors = () => getUniqueValues("FLOOR");
/* unused */ export const getUniqueSpaceTypes = () => getUniqueValues("SPACETYPE");

/* unused */ export async function getFloorPolygons(building: string, floor: string) {
    return query(1, `BUILDING = '${building}' AND FLOOR = '${floor}'`, { outFields: ["SPACEID", "LONGNAME"], geometry: true, geojson: true });
}

/* unused */ export async function getSpacesFiltered(filters: { building?: string; floor?: string; type?: string }) {
    const conds = [];
    if (filters.building) conds.push(`BUILDING = '${filters.building}'`);
    if (filters.floor) conds.push(`FLOOR = '${filters.floor}'`);
    if (filters.type) conds.push(`SPACETYPE = '${filters.type}'`);
    return query(0, conds.length ? conds.join(" AND ") : "1=1");
}

/* unused */ export async function getFeatureById(objectId: number | string) {
    const res = await query(0, `OBJECTID=${objectId}`);
    return res.features[0];
}

/* unused */ export async function fuzzySearchByLongName(term: string, layerId = 0) {
    return query(layerId, `LONGNAME LIKE '%${term}%'`);
}