import { DataSource } from '../dataParsers/dataParserTypes';

/**
 * Obtains the keys that are matched to the values of parsed Excel rows
 * @param dataSource enum value defining the source of the raw data
 * @returns string of keys corresponding to the interface keys of the data
 */
export function getKeys(dataSource?: DataSource): string[] | undefined {
    // get all keys corresponding to the data source
    switch (dataSource) {
        case DataSource.FOOD_DIARY:
            return FoodDiaryDataKeys();

        case DataSource.ABBOTT:
            return AbbottDataKeys();
        default:
            return undefined;
    }
}

/**
 * Excel parser does not accept interfaces as argument, only stringarray
 * It seems not possible as the import { keys } from 'ts-transformer-keys' is broken
 * To get this automatically at runtime
 * @returns array containing all keys of interface FoodDiaryData
 */
export function FoodDiaryDataKeys(): string[] {
    return [
        'date',
        'time',
        'meal_type',
        'description',
        'carbohydrates',
        'glycemic_index',
        'base_insulin',
        'high_correction_insulin',
        'sports_correction_insulin',
        'total_insulin'
    ];
}

/**
 * Excel parser does not accept interfaces as argument, only stringarray
 * It seems not possible as the import { keys } from 'ts-transformer-keys' is broken
 * To get this automatically at runtime
 * @returns array containing all keys of interface AbbottData
 */
export function AbbottDataKeys(): string[] {
    return [
        'device',
        'serial_number',
        'device_timestamp',
        'record_type',
        'historic_glucose',
        'scan_glucose',
        'non_numeric_rapid_acting_insulin',
        'rapid_acting_insulin__units_',
        'non_numeric_food',
        'carbohydrates__grams_',
        'carbohydrates__servings_',
        'non_numeric_long_acting_insulin',
        'long_acting_insulin__units_',
        'notes',
        'strip_glucose',
        'ketone_mmol_l',
        'meal_insulin__units_',
        'correction_insulin__units_',
        'user_change_insulin__units'
    ];
}
