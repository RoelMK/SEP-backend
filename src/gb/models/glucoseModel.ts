// Glucose interface with UNIX timestamp, glucose level (in mmol/L)
export interface GlucoseModel {
    timestamp: number;
    glucoseLevel: number;
    activityId?: number; // ID of GameBus activity
}

/**
 * Units for defining the glucose level differ per region
 * In the USA mg/dL is more common, whereas mmol/L is more common in Europe
 */
export enum GlucoseUnit {
    UNDEFINED = 'undefined',
    MMOL_L = 'mmol/L',
    MG_DL = 'mg/dL'
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
