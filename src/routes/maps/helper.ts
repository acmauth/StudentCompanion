import * as authApi from "./functions";
import type { BuildingInfo, Rooms } from "./types";
import Fuse from "fuse.js";

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
