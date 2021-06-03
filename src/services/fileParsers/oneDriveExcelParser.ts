import { OneDriveClient } from '../../onedrive/odClient';
import { DataSource } from '../dataParsers/dataParser';
import { convertExcelDateTimes } from '../utils/dates';
import { getFileDirectory, getFileName } from '../utils/files';
import { getKeys } from '../utils/interfaceKeys';
import { FileParser } from './fileParser';

/**
 * Default class for parsing .xlsx files from a OneDrive
 */
export default class OneDriveExcelParser extends FileParser {
    // on which page the mapping tables reside
    private static mappingTableSheet = 'Sheet2';

    constructor() {
        super();
    }
    /**
     * Asynchronous function that parses Excel data on a onedrive
     * @param filePath path to the file on the OneDrive
     * @param dataSource defines from which kind of input file the data originates
     * @param oneDriveToken authorization token for OneDrive
     * @returns Array of excel entry objects
     */
    async parse(
        filePath: string,
        dataSource: DataSource,
        oneDriveToken: string,
        tableName: string,
        sampleInput?: any[]
    ): Promise<Record<string, string>[]> {
        // Initiate oneDrive read
        // eslint-disable-next-line no-async-promise-executor
        let result;

        // if not a test
        if (sampleInput === undefined) {
            // create oneDrive client
            const odClient = new OneDriveClient(
                oneDriveToken,
                getFileName(filePath),
                getFileDirectory(filePath),
                tableName
            );
            result = this.assignKeys(await odClient.getTableValues(), getKeys(dataSource));
        }
        // if a test is being executed
        else {
            result = this.assignKeys(sampleInput, getKeys(dataSource));
        }

        result = convertExcelDateTimes(result);
        return result;
    }

    /**
     * Converts an excel table with two columns into a mapping with keys in the first column
     * and values in the second
     * @param filePath Path of the file in which the table is stored
     * @param oneDriveToken token to access the OneDrive
     * @param tableName Name of the mapping table
     * @returns A map containing the values of the excel table
     */
    static async getMappingTableValues(
        filePath: string,
        oneDriveToken: string,
        tableName: string
    ): Promise<Map<string, string>> {

        
        // create onedrive client
        const odClient = new OneDriveClient(
            oneDriveToken,
            getFileName(filePath),
            getFileDirectory(filePath),
            tableName,
            this.mappingTableSheet
        );
        const rawTableData = await odClient.getTableValues();

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

    /**
     * Helper function to convert the 2D array input from the OneDrive data collecter into an array of objects
     * @param array2D string[][], array that contains arrays which represent objects
     * @param keys The keys that belong to the objects, i.e. key[0] belongs to array2D[i][0] etc.
     * @returns An array of objects with key-value pairs
     */
    assignKeys(array2D: string[][], keys: string[]): Record<string, string>[] {
        // amount of values in an object-array must be equal to the amount of passed keys
        if (array2D[0].length != keys.length) {
            throw Error(
                'Length mismatch: 2D array cannot be converted to an object with given keys!'
            );
        }

        // resulting object array
        const result: Record<string, string>[] = [];
        // to be constructed object
        let object: Record<string, string>;

        // loop over all object-arrays, convert them to actual objects and
        // store them in the result array
        array2D.forEach(function (array: string[]) {
            object = {};
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = array[i];
                object[key] = value;
            }
            result.push(object);
        });
        return result;
    }
}
