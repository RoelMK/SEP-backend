/**
 *
 *  ------------------------------------- Food diary -------------------------------------
 *
 */

/**
 * Type of a parsed food diary, extends string, string records
 */
export type FoodDiaryData = {
    date: string;
    time: string;
    meal_type: string;
    description: string;
    carbohydrates: string;
    glycemic_index: string;
    base_insulin: string;
    high_correction_insulin: string;
    sports_correction_insulin: string;
    total_insulin: string;
};

/**
 *
 *  ------------------------------------- Abbott -------------------------------------
 *
 */

/**
 * Function to check if an object belongs to the FoodDiaryData interface
 * @param object any object
 * @returns whether the object is part of the interface AbbottData
 */
export function FoodDiaryDataGuard(object: any): object is FoodDiaryData {
    if (object === undefined) {
        return false;
    }
    return (
        'date' in object &&
        'time' in object &&
        'description' in object &&
        'meal_type' in object &&
        'carbohydrates' in object &&
        'glycemic_index' in object &&
        'base_insulin' in object &&
        'high_correction_insulin' in object &&
        'total_insulin' in object
    );
}
/**
 * Function that can return an empty AbbottData entry that might be needed for easy returns
 * @returns Empty AbbottData
 */
export const emptyAbbottData = (): AbbottData => ({
    device: '',
    serial_number: '',
    device_timestamp: '',
    record_type: '',
    historic_glucose_mg_dl: '',
    historic_glucose_mmol_l: '',
    scan_glucose_mg_dl: '',
    scan_glucose_mmol_l: '',
    non_numeric_rapid_acting_insulin: '',
    rapid_acting_insulin__units_: '',
    non_numeric_food: '',
    carbohydrates__grams_: '',
    carbohydrates__servings_: '',
    non_numeric_long_acting_insulin: '',
    long_acting_insulin__units_: '',
    long_acting_insulin_value__units_: '',
    notes: '',
    strip_glucose_mg_dl: '',
    strip_glucose_mmol_l: '',
    ketone_mmol_l: '',
    meal_insulin__units_: '',
    correction_insulin__units_: '',
    user_change_insulin__units_: ''
});

/**
 * Raw Abbott .csv data format
 */
export type AbbottData = {
    device: string;
    serial_number: string;
    device_timestamp: string;
    record_type: string;
    historic_glucose_mg_dl?: string;
    historic_glucose_mmol_l?: string;
    scan_glucose_mg_dl?: string;
    scan_glucose_mmol_l?: string;
    non_numeric_rapid_acting_insulin: string;
    rapid_acting_insulin__units_: string;
    non_numeric_food: string;
    carbohydrates__grams_: string;
    carbohydrates__servings_: string;
    non_numeric_long_acting_insulin: string;
    long_acting_insulin__units_?: string; // apparently there is a difference between US and EU names for these
    long_acting_insulin_value__units_?: string;
    notes: string;
    strip_glucose_mg_dl?: string;
    strip_glucose_mmol_l?: string;
    ketone_mmol_l: string;
    meal_insulin__units_: string;
    correction_insulin__units_: string;
    user_change_insulin__units_: string;
};

/**
 * Function to check if an object belongs to the AbbottData interface
 * @param object any object
 * @returns whether the object is part of the interface AbbottData
 */
export function AbbottDataGuard(object: any): object is AbbottData {
    if (object === undefined) {
        return false;
    }
    return (
        object.device !== undefined &&
        object.serial_number !== undefined &&
        object.device_timestamp !== undefined &&
        object.record_type !== undefined &&
        object.non_numeric_rapid_acting_insulin !== undefined &&
        object.rapid_acting_insulin__units_ !== undefined &&
        object.non_numeric_food !== undefined &&
        object.carbohydrates__grams_ !== undefined &&
        object.carbohydrates__servings_ !== undefined &&
        object.non_numeric_long_acting_insulin !== undefined &&
        object.notes !== undefined &&
        object.ketone_mmol_l !== undefined &&
        object.meal_insulin__units_ !== undefined &&
        object.correction_insulin__units_ !== undefined &&
        object.user_change_insulin__units_ !== undefined
    );
}

/**
 *
 *  ------------------------------------- Eetmeter -------------------------------------
 *
 */

/**
 * Interface that contains Eetmeter consumption data
 */
export interface EetmeterData {
    Consumpties: Consumpties;
}
/**
 * Consumption array with extra attributes
 */
export interface Consumpties {
    Attributes: [any];
    Consumptie: [Consumptie];
}

/**
 * Single concumption
 */
export type Consumptie = {
    Attributes: Periode;
    Datum: Datum;
    Product: Product;
    Nutrienten: Nutrienten;
};

/**
 * Interface for Eetmeter consumption nutrients
 */
export interface Nutrienten {
    Koolhydraten: Koolhydraten;
    Energie: Energie;
    Vet: Vet;
    VerzadigdVet: VerzadigdVet;
    Zout: Zout;
    Water: Water;
    Suikers: Suikers;
}

/**
 * Time of consumption (breakfast, lunch, dinner)
 */
export interface Periode {
    Periode: string;
}

/**
 * Name of the consumed product
 */
export interface Product {
    Naam: string;
}

/**
 * Date of consumption
 */
export interface Datum {
    Dag: number;
    Maand: number;
    Jaar: number;
}

/**
 * Amount of carbohydrates
 */
export interface Koolhydraten {
    Value: number;
}

/**
 * Energy in consumption
 */
export interface Energie {
    Value: number;
}

/**
 * Fat in consumption
 */
export interface Vet {
    Value: number;
}

/**
 * Salt in consumption
 */
export interface Zout {
    Value: number;
}

/**
 * Water in consumption
 */
export interface Water {
    Value: number;
}

/**
 * Sugar in consumption
 */
export interface Suikers {
    Value: number;
}

/**
 * Saturated fat in consumption
 */
export interface VerzadigdVet {
    Value: number;
}

/**
 *
 *  ------------------------------------- Nightscout -------------------------------------
 *
 */

/**
 * Main model for nightscout glucose data, glucose unit (mmol/L or mg/dL) has to be separately retrieved
 * from Nightscout
 */
export type NightScoutEntryModel = {
    type: string;
    dateString?: string;
    date: number;
    sgv: number;
    _id?: string;
    direction?: string;
    noise?: number;
    filtered?: number;
    unfiltered?: number;
    rssi?: number;
    utcOffset?: number;
    sysTime?: string;
};
/**
 * Model of a nightscout treatment, which often contains insulin or food metrics
 * but can also contain glucose
 */
export type NightScoutTreatmentModel = {
    eventType: string;
    created_at: string;
    _id?: string;
    glucose?: string;
    glucoseType?: string; // Finger or sensor
    carbs?: number;
    protein?: number;
    fat?: number;
    insulin?: number;
    units?: string; // glucose units
    notes?: string;
    enteredBy?: string;
    utcOffset?: number;
};

/**
 * Enum of all possible data types to be recovered from GameBus
 */
export enum NightScoutDatatype {
    ENTRY = 0,
    TREATMENT = 1
}
