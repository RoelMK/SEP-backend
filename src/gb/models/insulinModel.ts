// Insulin interface with UNIX timestamp, insulin level (in "units") and type (rapid or long)

export interface InsulinModel {
    timestamp: number;
    insulinAmount: number;
    insulinType: InsulinType;
    activityId?: number; // ID of GameBus activity
}

export enum InsulinType {
    RAPID = 0,
    LONG = 1
}
