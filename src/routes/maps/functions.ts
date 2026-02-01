import type * as apitypes from "./types";

const BASEURL = "https://ws-ext.it.auth.gr"

export async function getBuildings(): Promise<apitypes.Buildings> {
    const response = await fetch(`${BASEURL}/getBuildings`);
    if (!response.ok) {
        throw new Error(`Error fetching buildings: ${response.statusText}`);
    }
    const data: apitypes.Buildings = await response.json();
    return data;
}

export async function getUnitBuildings(unitID: string): Promise<apitypes.Buildings> {
    // unitID is the shortname for the school/unit, e.g., "eng" for Engineering and "csd" for Computer Science Department
    const response = await fetch(`${BASEURL}/getBuildings/${unitID}`);
    if (!response.ok) {
        throw new Error(`Error fetching building data: ${response.statusText}`);
    }
    const data: apitypes.Buildings = await response.json();
    return data;
}

export async function getBuildingInfo(pykaBldId: string): Promise<apitypes.BuildingInfo> {
    const response = await fetch(`${BASEURL}/getBuildingInfo/${pykaBldId}`);
    if (!response.ok) {
        throw new Error(`Error fetching building info: ${response.statusText}`);
    }
    const data: apitypes.BuildingInfo = await response.json();
    return data;
}

export async function getRooms(pykaBldId: string): Promise<apitypes.Rooms> {
    const response = await fetch(`${BASEURL}/getRooms/${pykaBldId}`);
    if (!response.ok) {
        throw new Error(`Error fetching rooms: ${response.statusText}`);
    }
    const data: apitypes.Rooms = await response.json();
    return data;
}

export async function getRoomInfo(roomId: string): Promise<apitypes.RoomDetail> {
    const response = await fetch(`${BASEURL}/getRoomInfo/${roomId}`);
    if (!response.ok) {
        throw new Error(`Error fetching room details: ${response.statusText}`);
    }
    const data: apitypes.RoomDetail = await response.json();
    return data;
}