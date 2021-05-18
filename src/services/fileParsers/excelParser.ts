import XLSX from 'xlsx';
import { DataSource } from '../dataParsers/dataParser';
import { convertExcelDateTimes } from '../utils/dates';
import { getKeys } from '../utils/interfaceKeys';

/**
 * Default class for parsing .xlsx files
 */

export default class ExcelParser {
    constructor(private readonly config: ExcelConfig = defaultExcelConfig) {}

    async parse(filePath: string, dataSource: DataSource): Promise<Record<string, string>[]> {

        const workbook = XLSX.read(filePath, { type: 'file' });
        const [firstSheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets[firstSheetName];

        return new Promise((resolve) => {
            let resultData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet, {
                ...this.config, 
                header: getKeys(dataSource), // use keys of interface
            });
            resultData = convertExcelDateTimes(resultData);
            resolve(resultData);
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
    raw: boolean,
    range: number,
    defval: any,
    blankrows: boolean,
}