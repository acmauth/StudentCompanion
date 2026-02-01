import { queryFeatures, getLayer } from '@esri/arcgis-rest-feature-layer';
import type { IFeature } from '@esri/arcgis-rest-types';

const TOKEN = "NZ2mNOaBrq6yeXiEoVF0zacxNIOh26dSpooO_iFhcCDXWWpUJmKykqakUYSKJtl5TGBLrjPEvSGx3HQJ27AQrRhn_BLQP-QjYmfzrz9UPw8cnwhLJnxnWb1OwN0xo2G0E0_atW9SkSjuABrE3BKhnZPRTWyjDk1YbUNII7GM7XThyMn7Z0QBhbLWj__YBOd-gVgYfk0LOW1QCU9Kn_DGarrSQacykIDWEt3VSYl00dKdv26geC8y8spuCJAz4T5LNEjD4o-aDJ-jljInWGZIserNxl-0n1noRmXy0bnhXJ3N1HZsSDxQNJw9WTXnM311";
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