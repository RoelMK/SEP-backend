import XLSX from 'xlsx';
import { DataSource } from '../dataParsers/dataParser';
import { convertExcelDateTimes } from '../utils/dates';
import { getKeys } from '../utils/interfaceKeys';

/**
 * Default class for parsing .xlsx files
 */

export default class ExcelParser {
    constructor(private readonly config: ExcelConfig = defaultExcelConfig) {}

    parse(filePath: string, dataSource: DataSource): Promise<Record<string, string>[]> {
        const workbook = XLSX.read(filePath, { type: 'file' });
        const [firstSheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets[firstSheetName];

        return new Promise((resolve) => {
            let resultData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet, {
                ...this.config,
                header: getKeys(dataSource) // use keys of interface
            });
            resultData = convertExcelDateTimes(resultData);
            console.log(resultData);
            resolve(resultData);
        });
    }

    /**
     * Converts an excel table with two columns into a mapping with keys in the first column
     * and values in the second
     * @param filePath Path of the file in which the table is stored
     * @param tableName Name of the mapping table
     * @returns A map containing the values of the excel table
     */
    static getMappingTableValues(filePath: string): Promise<Map<string, string>> {
        return new Promise((resolve) => {
            const workbook = XLSX.read(filePath, { type: 'file' });
            const secondSheetName = workbook.SheetNames[1];
            const worksheet = workbook.Sheets[secondSheetName];
            const rawTableData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
                ...defaultExcelConfig,
                header: 1
            });
            console.log(rawTableData + ' ' + secondSheetName);
            
            // check for empty table
            if (rawTableData === undefined) {
                resolve(new Map<string, string>());
                return;
            }

            // check if there are results
            if (rawTableData.length == 0) {
                resolve(new Map<string, string>());
                return;
            }

            // check if the mapping contains more or less than two columns
            if (rawTableData[0].length != 2) {
                resolve(new Map<string, string>());
                return;
            }

            // turn raw table data into a mapping
            const resultMap = new Map<string, string>();
            rawTableData.forEach(function (entry: any[]) {
                resultMap.set(entry[0], entry[1]);
            });
            resolve(resultMap);
        });
    }
}

/**
 * Default ecel parsing config that assumes the presence of headers and transforms them to remove spaces and capitals
 */
const defaultExcelConfig: ExcelConfig = {
    raw: true, // Use raw values to parse dates uniformly
    range: 1, // if keys are specified under header property, the package does not remove the header so start at 1
    defval: '', // standard value for missing values
    blankrows: false
};

type ExcelConfig = {
    raw: boolean;
    range: number;
    defval: any;
    blankrows: boolean;
};
