import XLSX from "xlsx"


/**
 * Default class for parsing .xlsx files
 */
export default class ExcelParser<D extends {} = Record<string, string>> {

    // resulting data from Excel parse
    protected rawData: D[] = [];

    constructor(private readonly filePath: string){}

    async parse(interfaceKeys: string[]):  Promise<D[]>{ // 
            
            const workbook = XLSX.read(this.filePath, { type: 'file' });
            const [firstSheetName] = workbook.SheetNames;
            const worksheet = workbook.Sheets[firstSheetName];           
        
           return new Promise((resolve) => {
               const resultData: D[] = XLSX.utils.sheet_to_json(worksheet, {
                raw: false, // Use raw values (true) or formatted strings (false)
                header: interfaceKeys, // use keys of interface
                range: 1, // if keys are specified under header property, the package does not remove the header so start at 1
                defval: '' // standard value for missing values
                }) as D[];
                this.rawData = resultData;
                resolve(resultData);
        });
    }
}

