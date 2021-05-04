/**
 * Insulin "activity" for GameBus includes the UNIX timestamp, insulin amount (in "units") and type of insulin (rapid or long)
 */
export interface GameBusInsulinActivity {
    timestamp: number;
    insulinAmount: number;
    insulinType: InsulinType;
}

/**
 * Just to differentiate between rapid-acting insulin and long-acting insulin
 */
export enum InsulinType {
    RAPID = 0,
    LONG = 1
}
