export interface TimeSlot {
    day: number,
    timeStart: string,
    timeEnd: string
}
export interface TaskItem {
    id: number,
    title: string,
    description: string,
    slot: TimeSlot
}