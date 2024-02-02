export interface TimeSlot {
    weekDay: string,
    monthDate: string,
    startTime: string,
    endTime: string
}
export interface ExamItem {
    subject: string,
    classroom: string,
    date: TimeSlot
}