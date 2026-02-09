import * as authApi from "./functions";
import type { BuildingInfo, Rooms, Department } from "./types";
import Fuse from "fuse.js";
import { registerPlugin } from '@capacitor/core';
import appConfig from "$src/app.config";
// Register the custom AppLauncher plugin 
const AppLauncherPlugin = registerPlugin('AppLauncherPlugin');


export type RoomWithBuilding = Rooms["rooms"][number] & { bldId: string; hasGis?: boolean; isMezz: string };

export async function fetchBuildings(): Promise<BuildingInfo[]> {
    const { buildings } = await authApi.getBuildings();
    return buildings.filter(b => b.bldId != null && b.gisBldId != null);
}

export async function fetchDepartments(): Promise<Department[]> {
	const units = (await authApi.getUnits()).units;
	return Object.keys(units).map(key => {
		const u = units[key];
		return {
			unitID: key,
			name: u.name,
			nameEn: u.nameEn,
			adminUnitIdFormatted: u.adminUnitIdFormatted,
			parentDomain: u.parentDomain,
			childrenDomains: u.childrenDomains
		} as Department;
	});
	// return Object.values(units).map(u => ({
	// 	unitID: u.adminUnitIdFormatted,
	// 	name: u.name,
	// 	nameEn: u.nameEn,
	// 	adminUnitIdFormatted: u.adminUnitIdFormatted,
	// 	parentDomain: u.parentDomain,
	// 	childrenDomains: u.childrenDomains
	// }));
}

export async function fetchRoomsForBuildings(buildingIds: Set<string>): Promise<Record<string, Rooms["rooms"]>> {
    // const entries = await Promise.all(
    //     [...buildingIds].map(async id => {
    //         const { rooms } = await authApi.getRooms(id);
    //         return [id, rooms.filter(r => r.roomCode && r.roomName && r.roomId)] as const;
    //     })
    // );
    // let data = Object.fromEntries(entries);
    // console.log(JSON.stringify(data))
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
    return new Fuse(rooms, { keys: ["roomName"] });
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
	return (await authApi.getUnitBuildings(selectedDepartment.unitID)).buildings;
}

export async function handleTransportAppClick() {
		const packageName = 'com.amco.city.thessaloniki';
		const iosAppStoreUrl = 'https://apps.apple.com/gr/app/oseth-bus/id6748433667';
		const fallbackUrl = 'https://telematics.oasth.gr/en/#main';
		//@ts-ignore
		const ua = navigator.userAgent || navigator.vendor || window.opera;
		const isAndroid = /android/i.test(ua);
		//@ts-ignore
		const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream; //@ts-ignore

		if (isAndroid) {
			try {
				// Try to launch the app directly using our custom plugin
				//@ts-ignore
				const result = await AppLauncherPlugin.launchApp({packageName});
				
				if (!result.launched) {
					// App not installed, go to fallback URL
					window.location.href = fallbackUrl;
				}
			} catch (err) {
				console.error('Error launching app:', err);
				window.location.href = fallbackUrl;
			}
		} else {
			// Non-mobile devices always go to telematics URL
			window.location.href = fallbackUrl;
		}
	}

