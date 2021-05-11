import XLSX from "xlsx"
import { DataSource } from "../dataParsers/dataParser";

/**
 * Default class for parsing .xlsx files
 */
export default class ExcelParser {   // <D extends {} = Record<string, string>>

    constructor(){}

    async parse(filePath: string, dataSource: DataSource ):  Promise<Record<string, string>[]>{ // 
            
            const workbook = XLSX.read(filePath, { type: 'file' });
            const [firstSheetName] = workbook.SheetNames;
            const worksheet = workbook.Sheets[firstSheetName];           
        
           return new Promise((resolve) => {
               const resultData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet, {
                raw: false, // Use raw values (true) or formatted strings (false)
                header: this.getKeys(dataSource), // use keys of interface
                range: 1, // if keys are specified under header property, the package does not remove the header so start at 1
                defval: '' // standard value for missing values
                });
                resolve(resultData);
        });
    }

    /**
     * Obtains the keys that are matched to the values of parsed Excel rows
     * @param dataSource enum value defining the source of the raw data
     * @returns string of keys corresponding to the interface keys of the data 
     */
    private getKeys(dataSource: DataSource): string[]{
        
        // get all keys corresponding to the data source
        switch(dataSource){
            case DataSource.FOOD_DIARY:
                return FoodDiaryDataKeys();

            default:
                // TODO This should not happen
                return FoodDiaryDataKeys();
        } 
    }
}
/**
* Excel parser does not accept interfaces as argument, only stringarray
* //TODO until now I have not found a way of generating this automatically
* It seems not possible as the import { keys } from 'ts-transformer-keys' is broken
* @returns array containing all keys of interface FoodDiaryData
*/
export function FoodDiaryDataKeys(): string[]{
    return [
        "date",
        "time",
        "description",
        "carbohydrates",
        "base_insulin",
        "high_correction_insulin",
        "sports_correction_insulin",
        "total_insulin"
    ];
};

