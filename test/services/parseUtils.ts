import AbbottParser, { AbbottDataType } from '../../src/services/abbottParser';
import EetMeterParser from '../../src/services/eetmeterParser';
import CSVParser from '../../src/services/csvParser';
import XMLParser from '../../src/services/xmlParser';

/**
 * Helper function to parse an Abbott file through the AbbottParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
export async function parseAbbott(filePath: string, type: AbbottDataType) {
    const abbottEUParser: AbbottParser = new AbbottParser(filePath);
    await abbottEUParser.process();
    return abbottEUParser.getData(type);
}

export async function parseEetmeter(filePath: string) {
    const eetmeterParser: EetMeterParser = new EetMeterParser(filePath);
    await eetmeterParser.process();
    return eetmeterParser.getData()
}

export async function parseCsv(filePath: string): Promise<any[]> {
    const csvParser: CSVParser = new CSVParser();
    return await csvParser.parse(filePath);
}

export async function parseXml(filePath: string) {
    const xmlParser: XMLParser = new XMLParser();
    return await xmlParser.parse(filePath);
}
