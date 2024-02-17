export interface TimeSlot {
    day: number,
    startTime: Date,
    endTime: Date
}
export interface ClassItem {
    id: number,
    title: string,
    professor: string,
    classroom: string,
    slots: TimeSlot[] 
}

export interface ClassItemFlat {
    id: number,
    title: string,
    professor: string,
    classroom: string,
    day: number,
    startTime: string,
    endTime: string
}