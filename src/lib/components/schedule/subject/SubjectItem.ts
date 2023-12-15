export interface TimeSlot {
    day: string,
    timeStart: string,
    timeEnd: string
}
export interface SubjectItem {
    id: number,
    title: string,
    professor: string,
    classroom: string,
    slots: TimeSlot[] 
}