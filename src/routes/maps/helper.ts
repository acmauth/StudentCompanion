import * as authApi from "./functions";
import type { BuildingInfo, Rooms } from "./types";
import Fuse from "fuse.js";
import { registerPlugin } from '@capacitor/core';
// Register the custom AppLauncher plugin 
const AppLauncherPlugin = registerPlugin('AppLauncherPlugin');


export type RoomWithBuilding = Rooms["rooms"][number] & { bldId: string; hasGis?: boolean; isMezz: boolean };

export async function fetchBuildings(): Promise<BuildingInfo[]> {
    const { buildings } = await authApi.getBuildings();
    return buildings.filter(b => b.bldId != null && b.gisBldId != null);
}

export async function fetchRoomsForBuildings(buildingIds: Set<string>): Promise<Record<string, Rooms["rooms"]>> {
    const entries = await Promise.all(
        [...buildingIds].map(async id => {
            const { rooms } = await authApi.getRooms(id);
            return [id, rooms.filter(r => r.roomCode && r.roomName && r.rommId)] as const;
        })
    );
    return Object.fromEntries(entries);
}

export function flattenRooms(roomsByBuilding: Record<string, Rooms["rooms"]>): RoomWithBuilding[] {
    const flat = Object.entries(roomsByBuilding).flatMap(([bldId, rooms]) =>
        rooms.map(room => ({ ...room, bldId, isMezz: room.isMess === "true" || room.isMess === "1" }))
    );
    return [...new Map(flat.map(r => [`${r.rommId},${r.roomName}`, r])).values()];
}

export function createRoomSearch(rooms: RoomWithBuilding[]): Fuse<RoomWithBuilding> {
    return new Fuse(rooms, { keys: ["faculty", "roomName"] });
}

export function markRoomsWithGis(rooms: RoomWithBuilding[], gisIds: Set<string>): RoomWithBuilding[] {
    return rooms.map(room => ({ ...room, hasGis: gisIds.has(room.rommId) }));
}

export async function handleTransportAppClick() {
		const packageName = 'com.amco.city.thessaloniki';
		const iosAppStoreUrl = 'https://apps.apple.com/gr/app/oseth-bus/id6748433667';
		const fallbackUrl = 'https://telematics.oasth.gr/en/#main';

		const ua = navigator.userAgent || navigator.vendor || window.opera;
		const isAndroid = /android/i.test(ua);
		const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

		if (isAndroid) {
			try {
				// Try to launch the app directly using our custom plugin
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

export async function handleCampusSafetyClick() {
		const packageName = 'gr.auth.android.incidentmanager';
		const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=el`;

		const ua = navigator.userAgent || navigator.vendor || window.opera;
		const isAndroid = /android/i.test(ua);

		if (isAndroid) {
			try {
				// Try to launch the app directly using our custom plugin
				const result = await AppLauncherPlugin.launchApp({ packageName });
				
				if (!result.launched) {
					// App not installed, open Play Store
					window.location.href = `market://details?id=${packageName}`;
				}
			} catch (err) {
				console.error('Error launching app:', err);
				window.location.href = `market://details?id=${packageName}`;
			}
		} else {
			// For other platforms, go to Play Store
			window.location.href = playStoreUrl;
		}
	}

