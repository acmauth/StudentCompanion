export interface EventTimeSlot {
    start: Date,
    end: Date
}

export enum EventType {
    TASK = 'task',
    TEST = 'test',
    ASSIGNMENT = 'assignment',
    CLASS = 'class',
    OTHER = 'other'
}

export interface Event {
    id: number;
    title: string;
    slots: EventTimeSlot[];
    location?: string;
    description?: string;
    professor?: string,
    type: EventType;
    repeat: EventRepeatType;
    repeatInterval: number;
    repeatUntil: Date | null;
    notify: boolean;
    notifyTime: number;
}

export interface EventFlat {
    id: number;
    title: string;
    slot: EventTimeSlot;
    location?: string;
    description?: string;
    professor?: string,
    type: EventType;
    repeat: EventRepeatType;
    repeatInterval: number;
    repeatUntil: Date | null;
    notify: boolean;
    notifyTime: number;
}

export enum EventRepeatType {
    NONE = "none",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}