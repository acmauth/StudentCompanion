export interface BuildingInfo {
	locationId: string;
	gisBldId: string;
	faculty: string;
	name: string;
	locationName: string;
	bldId: string;
	longX: string;
	latY: string;
	longXgis: number;
	latYgis: number;
}

export interface Floor {
	name: string;
	nameEn: string;
}

export interface Room {
	roomId: string;
	floor: string;
	isMezz: string;
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
	isMezz: string;
	roomType: string;
	roomCode: string;
	roomName: string;
	roomId: string;
	capacity: string;
}

export interface Rooms {
	rooms: RoomDetail[];
}

export interface Unit {
    name: string;
    nameEn: string;
    adminUnitIdFormatted: string;
    parentDomain: string;
    childrenDomains?: string;
}
export interface Units {
	units: Record<string, Unit>;
}

export interface Department {
	unitID: string;
	name: string;
	nameEn: string;
    adminUnitIdFormatted: string;
    parentDomain: string;
    childrenDomains?: string;
}
