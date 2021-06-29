import { GameBusToken } from '../../src/gb/auth/tokenHandler';
import AbbottParser from '../../src/services/dataParsers/abbottParser';
import {
    CombinedDataParserOutput,
    OutputDataType
} from '../../src/services/dataParsers/dataParserTypes';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';

/**
 * UTP: DAP - 1
 */
test('test robustness of data parser', async () => {
    expect(async () => {
        const abbottParser = new AbbottParser('', {} as GameBusToken);
        await abbottParser.process();
    }).rejects.toThrow('File path is not set!');
});

/**
 * UTP: DAP - 2
 */
test('test robustness of OneDriveExcel parsing', async () => {
    expect(async () => {
        const parser = new FoodDiaryParser('test.xlsx', {} as GameBusToken, '');
        await parser.process();
    }).rejects.toThrowError();
});

/**
 * UTP: DAP - 3
 */
test('changing file path', () => {
    const abbottParser = new AbbottParser('test.csv', {} as GameBusToken);
    expect(abbottParser.getFilePath()).toBe('test.csv');
    abbottParser.setFilePath('test2.csv');
    expect(abbottParser.getFilePath()).toBe('test2.csv');
});

/**
 * UTP: DAP - 4
 */
test('get all data', () => {
    const abbottParser = new AbbottParser('test.csv', {} as GameBusToken);
    const expectedResult: CombinedDataParserOutput = {
        food: null,
        glucose: null,
        insulin: null,
        mood: null
    };
    expect(abbottParser.getData(OutputDataType.ALL)).toStrictEqual(expectedResult);
});

/**
 * UTP: DAP - 4
 */
test('get mood data', () => {
    const abbottParser = new AbbottParser('test.csv', {} as GameBusToken);
    const expectedResult = undefined;
    expect(abbottParser.getData(OutputDataType.MOOD)).toStrictEqual(expectedResult);
});
