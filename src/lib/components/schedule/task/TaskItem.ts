export interface TaskTimeSlot {
    startDate: Date,
    endDate: Date
}

export enum TaskType {
    PROJECT = 'project',
    TEST = 'test',
    OTHER = 'other',
}

export interface TaskItem {
    id: number,
    title: string,
    description: string,
    date: TaskTimeSlot,
    type: TaskType
}