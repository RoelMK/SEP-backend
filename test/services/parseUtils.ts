import AbbottParser from '../../src/services/dataParsers/abbottParser';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';

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
 export async function parseFoodDiary(filePath: string, type: OutputDataType, autoFill: boolean) {
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(autoFill, filePath);
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}

