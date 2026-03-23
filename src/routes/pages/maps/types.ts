export interface BuildingInfo {
	authBldId: string; // Kodikos ktiriou maps
	gisBldId: string;
	name: string;
	locationName: string;
	longX: string;
	latY: string;
	longXgis: string;
	latYgis: string;
}

export interface BuildingInfoNested {
	buildingInfo: BuildingInfo
}

export interface Floor {
	name: string;
	nameEn: string;
}

export interface Room {
	roomId: string;
	floor: string;
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
	bldName: string;
	floor: string;
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
