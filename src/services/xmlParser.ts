import { readFileSync } from 'fs';
var parseString = require('xml2js').parseString;
/**
 * Generic CSV reader and parser to be used for all CSV files
 */
export default class XMLParser {
    constructor() {}

    /**
     * Async function that parses the given .csv file's path
     * @param filePath Path of .xml file
     * @returns Array of csv entries as objects
     */
    async parse(filePath: string): Promise<Record<string, string>[]> {
        // Open file from given filePath
        const xmlFile = readFileSync(filePath);

        return new Promise((resolve) => {
            // Parse xml file return result as a promise
            parseString(xmlFile, function (err: any, result: any) {
        
                for (var i = 0; i < result.Consumpties.Consumptie.length; i++) {
                    console.log(result.Consumpties.Consumptie[i].Product[0].Naam)
                    console.log(result.Consumpties.Consumptie[i].Datum[0].Jaar)
                    console.log(result.Consumpties.Consumptie[i].Nutrienten[0].Koolhydraten[0]._)
                }
                resolve(result);
            });
        });
    }
}
