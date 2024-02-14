export interface TimeSlot {
    day: string,
    timeStart: string,
    timeEnd: string
}
export interface ClassItem {
    id: number,
    title: string,
    professor: string,
    classroom: string,
    slots: TimeSlot[] 
}