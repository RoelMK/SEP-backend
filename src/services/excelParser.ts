import XLSX from 'xlsx';


/**
 * Default class for parsing .xlsx files
 */
export default class ExcelParser {

    constructor(){}

     parse(filePath: string, skipLine: boolean = false):  unknown[]{ //async Promise<unknown[]>
            
            const workbook = XLSX.read(filePath, { type: 'file' });
            const [firstSheetName] = workbook.SheetNames;
            const worksheet = workbook.Sheets[firstSheetName];

             //new Promise((resolve) => {
           return XLSX.utils.sheet_to_json(worksheet, {
                raw: true, // Use raw values (true) or formatted strings (false)
                header: 1, // Generate an array of arrays ("2D Array")
            });
        //});
    }
}