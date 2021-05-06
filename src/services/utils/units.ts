/**
 * The function converts a glucose level measurement in the unit mg/dL to the unit mmol/L
 * https://www.bbraun.com/en/patients/diabetes-care-for-patients/blood-glucose-measurement/conversion-tables-mg-dl-mmol-l.html
 * @param glucoseLevel the glucose measurement in mg/dL
 * @returns the glucose measurement in mmol/L
 */
const convertMG_DLtoMMOL_L = (glucoseLevel: number): number => {
    return glucoseLevel * 0.0555;
};

/**
 * The function converts a glucose level measurement in the unit mmol/L to the unit mg/dL
 * https://www.bbraun.com/en/patients/diabetes-care-for-patients/blood-glucose-measurement/conversion-tables-mg-dl-mmol-l.html
 * @param glucoseLevel the glucose measurement in mmol/L
 * @returns the glucose measurement in mg/dL
 */
const convertMMOL_LtoMG_dL = (glucoseLevel: number): number => {
    return glucoseLevel * 18.018;
};

export { convertMG_DLtoMMOL_L, convertMMOL_LtoMG_dL };
