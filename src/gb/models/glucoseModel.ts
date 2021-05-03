// Glucose interface with UNIX timestamp and glucose level (in mmol/L)
//TODO: addd baseUnits in comments!
export interface glucoseModel {
    //translationkey : inputType  //baseUnit
    timestamp: number;
    recordType: number;
    historicGlucoseLevel?: number;
    scanGlucoseLevel?: number;
    stripGlucoseLevel?: number;
}
