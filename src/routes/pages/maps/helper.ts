import * as authApi from "./functions";
import type { BuildingInfo, Rooms, Department } from "./types";
import Fuse from "fuse.js";
import { registerPlugin } from '@capacitor/core';
import appConfig from "$src/app.config";
// Register the custom AppLauncher plugin 
const AppLauncherPlugin = registerPlugin('AppLauncherPlugin');


export type RoomWithBuilding = Rooms["rooms"][number] & { bldId: string; hasGis?: boolean; isMezz: string; X: number; Y:number };

export async function fetchBuildings(): Promise<BuildingInfo[]> {
    const { buildings } = await authApi.getBuildings();
    return buildings.filter(b => b.bldId != null && b.gisBldId != null).sort((a, b) => (a.name?? '').localeCompare(b.name ?? ''));
}

export async function fetchDepartments(): Promise<Department[]> {
	const units = (await authApi.getUnits()).units;

	return Object.keys(units)
		.map(key => {
			const u = units[key];
			return {
				unitID: key,
				name: u.name,
				nameEn: u.nameEn,
				adminUnitIdFormatted: u.adminUnitIdFormatted,
				parentDomain: u.parentDomain,
				childrenDomains: u.childrenDomains
			} as Department;
		})
		.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
}

export async function fetchRoomsForBuildings(buildingIds: Set<string>): Promise<Record<string, Rooms["rooms"]>> {
    const response = await fetch(appConfig.map.aristomate_ws_ext_buildings_endpoint)
    if (!response.ok){
        throw new Error(`Error fetching rooms: ${response.statusText}`);
    } else {
        return response.json();
    }
}

export function flattenRooms(roomsByBuilding: Record<string, Rooms["rooms"]>): RoomWithBuilding[] {
    const flat = Object.entries(roomsByBuilding).flatMap(([bldId, rooms]) =>
        rooms.map(room => ({ ...room, bldId, isMezz: room.isMezz }))
    );
    return [...new Map(flat.map(r => [`${r.roomId},${r.roomName}`, r])).values()];
}

export function createRoomSearch(rooms: RoomWithBuilding[]): Fuse<RoomWithBuilding> {
    return new Fuse(rooms, { 
		keys: ["roomName"],
		ignoreDiacritics: true,
		threshold: 0.4
	});
}

export function createDeptSearch(departments: Department[]): Fuse<Department> {
    return new Fuse(departments, { 
		keys: ["name", "nameEn"],
		ignoreDiacritics: true,
		threshold: 0.4
	});
}

export function createBuildingSearch(buildings: BuildingInfo[]): Fuse<BuildingInfo>{
	return new Fuse(buildings, {
		keys: ["name"],
		ignoreDiacritics: true,
		threshold: 0.4
	})
}

export function markRoomsWithGis(rooms: RoomWithBuilding[], gisIds: Set<string>): RoomWithBuilding[] {
    return rooms.map(room => ({ ...room, hasGis: gisIds.has(room.roomId) }));
}

export function getOrdinalSuffix(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export async function fetchAvailableBuildings(selectedDepartment: Department|undefined): Promise<BuildingInfo[]> {
	if (!selectedDepartment) return (await authApi.getBuildings()).buildings;
	return (await authApi.getUnitBuildings(selectedDepartment.unitID)).buildings.sort((a, b) => (a.name?? '').localeCompare(b.name ?? ''));
}

