import AbbottParser from '../../src/services/dataParsers/abbottParser';
import { DataSource, OutputDataType } from '../../src/services/dataParsers/dataParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import CSVParser from '../../src/services/fileParsers/csvParser';
import XMLParser from '../../src/services/fileParsers/xmlParser';
import OneDriveExcelParser from '../../src/services/fileParsers/oneDriveExcelParser';
import { EetMeterParser } from '../../src/services/dataParsers/eetmeterParser';
import FoodModel from '../../src/gb/models/foodModel';
import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { InsulinModel } from '../../src/gb/models/insulinModel';
import FoodParser, { FoodInput, FoodSource } from '../../src/services/food/foodParser';
import GlucoseParser, {
    GlucoseInput,
    GlucoseSource
} from '../../src/services/glucose/glucoseParser';
import InsulinParser, {
    InsulinInput,
    InsulinSource
} from '../../src/services/insulin/insulinParser';
import { DateFormat } from '../../src/services/utils/dates';

/**
 * Helper function to parse an Abbott file through the AbbottParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
export async function parseAbbott(
    filePath: string,
    type: OutputDataType
): Promise<InsulinModel[] | FoodModel[] | GlucoseModel[] | undefined> {
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
export async function parseFoodDiary(
    filePath: string,
    type: OutputDataType
): Promise<InsulinModel[] | FoodModel[] | GlucoseModel[] | undefined> {
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(filePath);
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}

/**
 * Helper function to parse a OneDrive Excel file
 * @param filePath File to parse
 * @param sampleInput ?
 * @returns Array of Excel entry objects
 */
export async function parseOneDriveFoodDiary(
    filePath: string,
    sampleInput?: any[]
): Promise<Record<string, string>[]> {
    const odParser: OneDriveExcelParser = new OneDriveExcelParser();
    return await odParser.parse(filePath, DataSource.FOOD_DIARY, '', '', sampleInput);
}

/**
 * Helper function to parse an Eetmeter file through the EetmeterParser and get the resulting data
 * @param filePath File to parse
 * @returns FoodModel[] data of Eetmeter file
 */
export async function parseEetmeter(filePath: string): Promise<FoodModel[] | undefined> {
    const eetmeterParser: EetMeterParser = new EetMeterParser(filePath);
    await eetmeterParser.process();
    return eetmeterParser.getData();
}

/**
 * Helper function to parse a .csv file through a CSVParser
 * @param filePath File to parse
 * @returns Array of csv entries as objects
 */
export async function parseCsv(filePath: string): Promise<Record<string, string>[]> {
    const csvParser: CSVParser = new CSVParser();
    return await csvParser.parse(filePath);
}

/**
 * Helper function to parse a .xml file through a XMLParser
 * @param filePath File to parse
 * @returns xml converted to json
 */
export async function parseXml(filePath: string): Promise<any> {
    const xmlParser: XMLParser = new XMLParser();
    return await xmlParser.parse(filePath);
}

/**
 * Helper function that creates a FoodParser from the input and POSTs the data
 * @param foodInput Food data
 * @param foodSource Source of food data
 * @param dateFormat Date format used in food data
 * @returns Response of POST
 */
export async function postFoodData(
    foodInput: FoodInput,
    foodSource: FoodSource,
    dateFormat: DateFormat
): Promise<void> {
    const foodParser = new FoodParser(foodInput, foodSource, dateFormat);
    return await foodParser.post();
}

/**
 * Helper function that creates a GlucoseParser from the input and POSTs the data
 * @param foodInput Glucose data
 * @param foodSource Source of glucose data
 * @param dateFormat Date format used in glucose data
 * @returns Response of POST
 */
export async function postGlucoseData(
    glucoseInput: GlucoseInput,
    glucoseSource: GlucoseSource,
    dateFormat: DateFormat
): Promise<void> {
    const glucoseParser = new GlucoseParser(glucoseInput, glucoseSource, dateFormat);
    return await glucoseParser.post();
}

/**
 * Helper function that creates an InsulinParser from the input and POSTs the data
 * @param foodInput Insulin data
 * @param foodSource Source of insulin data
 * @param dateFormat Date format used in insulin data
 * @returns Response of POST
 */
export async function postInsulinData(
    insulinInput: InsulinInput,
    insulinSource: InsulinSource,
    dateFormat: DateFormat
): Promise<void> {
    const insulinParser = new InsulinParser(insulinInput, insulinSource, dateFormat);
    return await insulinParser.post();
}
