import XLSX from 'xlsx';
import { DataSource } from '../dataParsers/dataParser';
import { convertExcelDateTimes } from '../utils/dates';
import { getKeys } from '../utils/interfaceKeys';

/**
 * Default class for parsing .xlsx files
 */

export default class ExcelParser {
    constructor() {}

    async parse(filePath: string, dataSource: DataSource): Promise<Record<string, string>[]> {
        //

        const workbook = XLSX.read(filePath, { type: 'file' });
        const [firstSheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets[firstSheetName];

        return new Promise((resolve) => {
            let resultData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet, {
                raw: true, // Use raw values (true) or formatted strings (false)
                header: getKeys(dataSource), // use keys of interface
                range: 1, // if keys are specified under header property, the package does not remove the header so start at 1
                defval: '', // standard value for missing values
                blankrows: false
            });
            resultData = convertExcelDateTimes(resultData);
            resolve(resultData);
        });
    }
}
