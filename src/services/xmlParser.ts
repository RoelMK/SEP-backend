import { readFileSync } from 'fs';
import { parseString } from 'xml2js';
/**
 * Generic XML reader and parser to be used for all XML files
 */
export default class XMLParser {
    constructor() {}

    /**
     * Async function that parses the given .xml file's path
     * @param filePath Path of .xml file
     * @returns xml converted to json
     */
    async parse(filePath: string): Promise<any> {
        // Open file from given filePath
        const xmlFile = readFileSync(filePath);

        return new Promise((resolve) => {
            // Parse xml file return result as a promise
            // TODO: error handling (try catch)
            parseString(xmlFile, function (err: any, result: any) {
                resolve(result);
            });
        });
    }
}
