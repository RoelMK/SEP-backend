import XLSX from 'xlsx';
import { DataSource } from '../dataParsers/dataParserTypes';
import { convertExcelDateTimes } from '../utils/dates';
import { getKeys } from '../utils/interfaceKeys';
import { FileParser } from './fileParser';

/**
 * Default class for parsing .xlsx files
 */

export default class ExcelParser extends FileParser {
    constructor(private readonly config: ExcelConfig = defaultExcelConfig) {
        super();
    }

    /**
     * Parsing the Excel file
     * @param filePath Path to the excel file
     * @param dataSource if a data source is specified, corresponding keys are added to the object
     * @returns parsed Excel data
     */
    parse(filePath: string, dataSource?: DataSource): Record<string, string>[] {
        const workbook = XLSX.read(filePath, { type: 'file' });
        const [firstSheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets[firstSheetName];

        let resultData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet, {
            ...this.config,
            header: getKeys(dataSource) // use keys of interface if not undefined
        });
        if (dataSource == DataSource.FOOD_DIARY) resultData = convertExcelDateTimes(resultData);
        return resultData;
    }

    /**
     * Converts an excel table with two columns into a mapping with keys in the first column
     * and values in the second
     * @param filePath Path of the file in which the table is stored
     * @param tableName Name of the mapping table
     * @returns A map containing the values of the excel table
     */
    static getMappingTableValues(filePath: string): Map<string, string> {
        const workbook = XLSX.read(filePath, { type: 'file' });
        const secondSheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[secondSheetName];
        const rawTableData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            ...defaultExcelConfig,
            header: 1
        });

        return this.checkRawTableData(rawTableData);
    }

    static checkRawTableData(rawTableData: any[][]): Map<string, string> {
        // check for empty table
        if (rawTableData === undefined) {
            return new Map<string, string>();
        }

        // check if there are results
        if (rawTableData.length == 0) {
            return new Map<string, string>();
        }

        // check if the mapping contains more or less than two columns
        if (rawTableData[0].length != 2) {
            return new Map<string, string>();
        }

        // turn raw table data into a mapping
        const resultMap = new Map<string, string>();
        rawTableData.forEach(function (entry: any[]) {
            resultMap.set(entry[0], entry[1]);
        });
        return resultMap;
    }
}

/**
 * Default excel parsing config that assumes the presence of headers
 * And the automatic casting of keys onto the object according to a specified DataSource
 */
const defaultExcelConfig: ExcelConfig = {
    raw: true, // Use raw values to parse dates uniformly
    range: 1, // if keys are specified under header property, the package does not remove the header so start at 1
    defval: '', // standard value for missing values
    blankrows: false // do not include blank rows
};

export type ExcelConfig = {
    raw: boolean;
    range: number;
    defval: any;
    blankrows: boolean;
};
