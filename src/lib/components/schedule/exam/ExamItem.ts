import type { TimeSlot } from '../TimeSlot';

export interface ExamTimeSlot extends TimeSlot {
    monthDate: string
}

export interface ExamItem {
    id: string,
    subject: string,
    classroom: string,
    date: ExamTimeSlot
}