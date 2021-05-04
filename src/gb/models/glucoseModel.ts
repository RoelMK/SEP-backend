// Glucose interface with UNIX timestamp and glucose level (in mmol/L)
export interface glucoseModel {
    timestamp: number;
    recordType: number;
    historicGlucoseLevel?: number;
    scanGlucoseLevel?: number;
    stripGlucoseLevel?: number;
}

/**
 * Glucose "activity" for GameBus includes the UNIX timestamp and glucose level (in mmol/L)
 */
export interface GameBusGlucoseActivity {
    timestamp: number;
    glucoseLevel: number;
}
