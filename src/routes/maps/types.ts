export interface BuildingInfo {
	locationId: string;
	gisBldId: string;
	faculty: string;
	name: string;
	locationName: string;
	bldId: string;
	longX: number;
	latY: number;
}

export interface Floor {
	name: string;
	nameEn: string;
}

export interface Room {
	rommId: string; // Note: 'rommId' is intentionally spelled this way to match the API response | GAMW xD
	floor: string;
	isMess: string;
	school: string;
	roomType: string;
	roomCode: string;
	roomName: string;
	capacity: string;
}

export interface RoomsByFloor {
	floor: Floor;
	rooms: Room[];
}

export interface BuildingData {
	buildingInfo: BuildingInfo;
	rooms_by_floor: RoomsByFloor[];
}

export interface Buildings {
    buildings: BuildingInfo[];
};

export interface RoomDetail {
	faculty: string;
	bldName: string;
	school: string;
	floor: string;
	isMess: string;
	roomType: string;
	roomCode: string;
	roomName: string;
	rommId: string;
	capacity: string;
}

export interface Rooms {
	rooms: RoomDetail[];
}
