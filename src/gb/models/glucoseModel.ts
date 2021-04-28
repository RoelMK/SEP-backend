// Glucose interface with UNIX timestamp and glucose level (in mmol/L)
export interface glucoseModel {
    timestamp: number;
    glucoseLevel: number;
}

/**
 * Different record type meanings
 * Glucose levels (0 & 1) are in mmol/L
 * Insulin (4) includes both rapid-acting insulin and long-acting insulin (in units)
 * Carbohydrates are in grams
 */
export enum RecordType {
    HISTORIC_GLUCOSE_LEVEL = 0,
    SCAN_GLUCOSE_LEVEL = 1,
    STRIP_GLUCOSE_LEVEL = 2,
    INSULIN = 4,
    CARBOHYDRATES = 5,
    NOTES = 6
}