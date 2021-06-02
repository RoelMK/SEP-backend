import AbbottParser from '../../src/services/dataParsers/abbottParser';
import { DataSource, OutputDataType } from '../../src/services/dataParsers/dataParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import CSVParser from '../../src/services/fileParsers/csvParser';
import XMLParser from '../../src/services/fileParsers/xmlParser';
import OneDriveExcelParser from '../../src/services/fileParsers/oneDriveExcelParser';
import { EetMeterParser } from '../../src/services/dataParsers/eetmeterParser';
import NightscoutParser, {
    NightScoutEntryModel,
    NightScoutTreatmentModel
} from '../../src/services/dataParsers/nightscoutParser';

/**
 * Helper function to parse an Abbott file through the AbbottParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
export async function parseAbbott(filePath: string, type: OutputDataType) {
    const abbottEUParser: AbbottParser = new AbbottParser(filePath);
    await abbottEUParser.process();
    return abbottEUParser.getData(type);
}

/**
 * Helper function to parse a Food diary file through the FoodDiaryParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
export async function parseFoodDiary(filePath: string, type: OutputDataType) {
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(filePath);
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}

export async function parseOneDriveFoodDiary(filePath: string, sampleInput?) {
    const odParser: OneDriveExcelParser = new OneDriveExcelParser();
    return await odParser.parse(filePath, DataSource.FOOD_DIARY, '', '', sampleInput);
}

export async function parseEetmeter(filePath: string) {
    const eetmeterParser: EetMeterParser = new EetMeterParser(filePath);
    await eetmeterParser.process();
    return eetmeterParser.getData();
}

export async function parseCsv(filePath: string): Promise<any[]> {
    const csvParser: CSVParser = new CSVParser();
    return await csvParser.parse(filePath);
}

export async function parseXml(filePath: string) {
    const xmlParser: XMLParser = new XMLParser();
    return await xmlParser.parse(filePath);
}

export async function parseNightScout(
    testEntries: NightScoutEntryModel[],
    testTreatments: NightScoutTreatmentModel[],
    outputDataType: OutputDataType
) {
    const nsParser: NightscoutParser = new NightscoutParser(
        'https://nightscout-sep.herokuapp.com',
        'rink-27f591f2e4730a68',
        testEntries,
        testTreatments
    );
    await nsParser.process();
    return nsParser.getData(outputDataType);
}