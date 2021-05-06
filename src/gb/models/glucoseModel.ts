// Glucose interface with UNIX timestamp, glucose level (in mmol/L)
export interface GlucoseModel {
    timestamp: number;
    glucoseLevel: number;
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
 * Glucose "activity" for GameBus includes the UNIX timestamp and glucose level (in mmol/L)
 */
export interface GameBusGlucoseActivity {
    timestamp: number;
    glucoseLevel: number;
}
