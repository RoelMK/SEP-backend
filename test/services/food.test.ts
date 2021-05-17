import FoodModel from '../../src/gb/models/foodModel';
import { parse, getUnixTime } from 'date-fns';
import { DateFormat } from '../../src/services/utils/dates';
import { parseAbbott, parseFoodDiary, parseOneDriveFoodDiary } from './parseUtils';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';

test('import Abbott EU food', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 101,
        description: '',
        timestamp: getUnixTime(parse('15/01/2021 13:13', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.FOOD)).toStrictEqual([expectedResult]);
});

test('import Abbott US food', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 120,
        description: '',
        timestamp: getUnixTime(parse('11-29-2018 11:29 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_us.csv', OutputDataType.FOOD)).toStrictEqual([expectedResult]);
});


test('import standardized food diary full', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 10,
        description: 'Meeting',
        timestamp: getUnixTime(parse('09/05/21 20:43', DateFormat.FOOD_DIARY_3, new Date()))
    };
    expect((await parseFoodDiary('test/services/data/foodDiary_standard.xlsx', OutputDataType.FOOD) as FoodModel[])[0]).toStrictEqual(expectedResult);
});

test('import standardized food diary with missing values', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 5,
        description: '',
        timestamp: getUnixTime(parse('05/08/21 23:12', DateFormat.FOOD_DIARY_3, new Date()))
    };
    expect((await parseFoodDiary('test/services/data/foodDiary_standard_missing.xlsx', OutputDataType.FOOD) as FoodModel[])[2]).toStrictEqual(expectedResult);
});


test('import standardized food diary with missing values from a onedrive', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 5,
        description: '',
        timestamp: getUnixTime(parse('05/08/21 23:12', DateFormat.FOOD_DIARY_3, new Date()))
    };
    expect((await parseOneDriveFoodDiary('Documents/DeepFolder/diary.xlsx', OutputDataType.FOOD) as FoodModel[])[2]).toStrictEqual(expectedResult);
});