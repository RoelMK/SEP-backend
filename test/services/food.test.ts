import FoodModel from '../../src/gb/models/foodModel';
import { parse, getUnixTime } from 'date-fns';
import { DateFormat } from '../../src/services/utils/dates';
import { parseAbbott, parseFoodDiary, parseEetmeter, parseOneDriveFoodDiary } from './parseUtils';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';

test('import Abbott EU food', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 101,
        description: '',
        timestamp: getUnixTime(parse('15/01/2021 13:13', DateFormat.ABBOTT_EU, new Date())) * 1000
    };
    expect(
        await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.FOOD)
    ).toStrictEqual([expectedResult]);
});

test('import Abbott US food', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 120,
        description: '',
        timestamp:
            getUnixTime(parse('11-29-2018 11:29 AM', DateFormat.ABBOTT_US, new Date())) * 1000
    };
    expect(
        await parseAbbott('test/services/data/abbott_us.csv', OutputDataType.FOOD)
    ).toStrictEqual([expectedResult]);
});

test('import standardized food diary full', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 10,
        description: 'Meeting',
        timestamp: getUnixTime(parse('09/05/21 20:43', DateFormat.FOOD_DIARY, new Date())) * 1000
    };
    expect(
        (
            (await parseFoodDiary(
                'test/services/data/foodDiary_standard.xlsx',
                OutputDataType.FOOD
            )) as FoodModel[]
        )[0]
    ).toStrictEqual(expectedResult);
});

test('import standardized food diary with missing values', async () => {
    let expectedResult: FoodModel = {
        carbohydrates: 5,
        description: '',
        timestamp: getUnixTime(parse('08/05/21 23:12', DateFormat.FOOD_DIARY, new Date())) * 1000
    };
    expect(
        (
            (await parseFoodDiary(
                'test/services/data/foodDiary_standard_missing.xlsx',
                OutputDataType.FOOD
            )) as FoodModel[]
        )[2]
    ).toStrictEqual(expectedResult);
});

test('import single Eetmeter entry', async () => {
    let expectedResult = [
        {
            timestamp: parse('5/5/2021 9:00', DateFormat.EETMETER, new Date()).getTime(),
            calories: 27.92,
            carbohydrates: 6.98,
            fat: 4.72,
            saturatedFat: 0.52,
            salt: 1.31,
            sugars: 0.98,
            water: 46.5,
            description: 'Vegetarische balletjes'
        }
    ];

    var result = await parseEetmeter('test/services/data/eetmeter.xml');
    expect(result).toStrictEqual(expectedResult);
});

test('import many Eetmeter entries', async () => {
    let expectedResult = [
        {
            timestamp: parse('5/5/2021 9:00', DateFormat.EETMETER, new Date()).getTime(),
            calories: 27.92,
            carbohydrates: 6.98,
            fat: 4.72,
            saturatedFat: 0.52,
            salt: 1.31,
            sugars: 0.98,
            water: 46.5,
            description: 'Vegetarische balletjes'
        },
        {
            timestamp: parse('5/5/2021 9:00', DateFormat.EETMETER, new Date()).getTime(),
            calories: 46,
            carbohydrates: 11.5,
            fat: 1.75,
            saturatedFat: 0.25,
            salt: 1.42,
            sugars: 2,
            water: 228,
            description: 'Vegetable soup'
        }
    ];

    var result = await parseEetmeter('test/services/data/eetmeterMany.xml');
    expect(result).toStrictEqual(expectedResult);
});
