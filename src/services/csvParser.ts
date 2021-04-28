import Papa, { ParseConfig } from 'papaparse';
import { readFileSync } from 'fs';

/**
 * Generic CSV reader and parser to be used for all CSV files
 */
export default class CSVParser {
    constructor(private readonly config: ParseConfig = defaultConfig) {}

    /**
     * Async function that parses the given .csv file's path
     * @param filePath Path of .csv file
     * @param skipLine Whether the first line should be skipped in case the headers are on the second line
     * @returns Array of csv entries as objects
     */
    async parse(filePath: string, skipLine: boolean = false): Promise<any[]> {
        // TODO: change path to uploaded .csv?
        // Open file from given filePath
        // TODO: Papa.parse should be able to open URLs as well
        const csvFile = readFileSync(filePath);
        var csvData = csvFile.toString();

        // If the first line should be skipped (because they are not headers)
        if (skipLine) {
            // Split on newline
            const tempCsvData = csvData.split('\n');
            // Remove first line
            tempCsvData.shift();
            // Join back together
            csvData = tempCsvData.join('\n');
        }

        return new Promise((resolve) => {
            // Parse csv file with config provided and return result as a promise
            Papa.parse(csvData, {
                ...this.config,
                complete: (result) => {
                    console.log(`Parsing completed, read ${result.data.length} records.`);
                    resolve(result.data);
                }
            });
        });
    }
}

/**
 * Default parsing config that assumes the presence of headers and transforms them to remove spaces and capitals
 */
const defaultConfig: ParseConfig = {
    header: true,
    worker: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => {
        return header.toLowerCase().replace(/\W/g, '_');
    }
};

/**
 * Raw Abbott .csv data format
 * TODO: what is non_numeric_food?
 */
export interface AbbottData {
    device: string;
    serial_number: string;
    device_timestamp: string;
    record_type: string;
    historic_glucose_mg_dl: string;
    scan_glucose_mg_dl: string;
    non_numeric_rapid_acting_insulin: string;
    rapid_acting_insulin__units_: string;
    non_numeric_food: string;
    carbohydrates__grams_: string;
    carbohydrates__servings_: string;
    non_numeric_long_acting_insulin: string;
    long_acting_insulin__units_: string;
    notes: string;
    strip_glucose_mg_dl: string;
    ketone_mmol_l: string;
    meal_insulin__units_: string;
    correction_insulin__units_: string;
    user_change_insulin__units_: string;
}
