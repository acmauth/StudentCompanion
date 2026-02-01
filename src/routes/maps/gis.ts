import { queryFeatures, getLayer } from '@esri/arcgis-rest-feature-layer';
import type { IFeature } from '@esri/arcgis-rest-types';

const TOKEN = "_kGw8JmQu9Bjxsmo4TAqw77D33D7s5Zp1bohsiah00clGdsdu-43c3E65w8SUgFIVRdF-brVhGk6pyZN8XJoSlZlh4OKz4nOsIS-Pwmxep6IVKoBqnf6BZmngXmOwawil9SXZoxn8Vy0dZBsk-xTQ8nykBELgJPtn6XMfpjae3DUTmWHtHsnL64DspnSDQQZzDeQEvxzhDkWJyUdT96ZqMidx01215e_T1s8J8tWDHi-0sxumMb3RtjzCame83bHnRX7m7m776Vi-bDtrkPVzDiVEMPoOnWLwA-S7ozIv0B6Qz_B0q5SPO-zMi46Lmcz";
const BASE_URL = "https://geoportal.auth.gr/giswa/rest/services/Aristomate/InteriorSpace_001_026/MapServer";
const AUTH = { token: TOKEN };
const GEOJSON = { ...AUTH, f: 'geojson' as const };

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
    return queryFeatures({
        url: `${BASE_URL}/${layerId}`,
        where,
        outFields,
        returnGeometry: geometry,
        outSR: geometry ? '4326' : undefined,
        params: geojson ? GEOJSON : AUTH
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

/* unused */ export const getServiceMetadata = (layerId?: number) =>
    getLayer({ url: layerId !== undefined ? `${BASE_URL}/${layerId}` : BASE_URL, params: AUTH });

/* unused */ export async function getUniqueValues(field: string, layerId = 0): Promise<string[]> {
    const res = await queryFeatures({
        url: `${BASE_URL}/${layerId}`,
        where: "1=1",
        outFields: [field],
        returnDistinctValues: true,
        returnGeometry: false,
        orderByFields: field,
        params: AUTH
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