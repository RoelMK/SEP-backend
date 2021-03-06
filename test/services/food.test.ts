import { FoodModel, MEAL_TYPE } from '../../src/gb/models/foodModel';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import {
    parseAbbott,
    parseFoodDiary,
    parseEetmeter,
    parseNightScout,
    postFoodData
} from '../testUtils/parseUtils';
import {
    FoodDiaryData,
    NightScoutTreatmentModel,
    OutputDataType
} from '../../src/services/dataParsers/dataParserTypes';
import { FoodSource } from '../../src/services/food/foodTypes';
import FoodMapper from '../../src/services/food/foodMapper';

describe('Abbott food', () => {
    /**
     * UTP: FOOD - 1
     */
    test('import Abbott EU food', async () => {
        const expectedResult: FoodModel = {
            carbohydrates: 101,
            description: '',
            timestamp: parseDate(
                '15/01/2021 13:13',
                DateFormat.ABBOTT_EU,
                new Date(),
                true
            ) as number
        };
        expect(
            await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.FOOD)
        ).toStrictEqual([expectedResult]);
    });

    /**
     * UTP: FOOD - 2
     */
    test('import Abbott US food', async () => {
        const expectedResult: FoodModel = {
            carbohydrates: 120,
            description: '',
            timestamp: parseDate(
                '11-29-2018 11:29 AM',
                DateFormat.ABBOTT_US,
                new Date(),
                true
            ) as number
        };
        expect(
            await parseAbbott('test/services/data/abbott_us.csv', OutputDataType.FOOD)
        ).toStrictEqual([expectedResult]);
    });
});

describe('Food Diary food', () => {
    /**
     * UTP: FOOD - 5
     */
    test('import standardized food diary full', async () => {
        const expectedResult: FoodModel = {
            carbohydrates: 10,
            description: 'Chicken',
            meal_type: MEAL_TYPE.BREAKFAST,
            glycemic_index: 30,
            timestamp: parseDate(
                '09/05/21 20:43',
                DateFormat.FOOD_DIARY,
                new Date(),
                true
            ) as number
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

    /**
     * UTP: FOOD - 6
     */
    test('import standardized food diary with missing values', async () => {
        const expectedResult: FoodModel = {
            carbohydrates: 3,
            description: 'Pizza',
            meal_type: MEAL_TYPE.UNDEFINED,
            glycemic_index: 2,
            timestamp: parseDate(
                '08/05/21 13:12',
                DateFormat.FOOD_DIARY,
                new Date(),
                true
            ) as number
        };
        expect(
            (
                (await parseFoodDiary(
                    'test/services/data/foodDiary_standard_missing_table.xlsx',
                    OutputDataType.FOOD
                )) as FoodModel[]
            )[1]
        ).toStrictEqual(expectedResult);
    });
});

describe('Eetmeter', () => {
    /**
     * UTP: FOOD - 3
     */
    test('import single Eetmeter entry', async () => {
        const expectedResult = [
            {
                timestamp: parseDate(
                    '5/5/2021 9:00',
                    DateFormat.EETMETER,
                    new Date(),
                    true
                ) as number,
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

        const result = await parseEetmeter('test/services/data/eetmeter.xml');
        expect(result).toStrictEqual(expectedResult);
    });

    /**
     * UTP: FOOD - 4
     */
    test('import many Eetmeter entries', async () => {
        const expectedResult = [
            {
                timestamp: parseDate(
                    '5/5/2021 9:00',
                    DateFormat.EETMETER,
                    new Date(),
                    true
                ) as number,
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
                timestamp: parseDate(
                    '5/5/2021 13:00',
                    DateFormat.EETMETER,
                    new Date(),
                    true
                ) as number,
                calories: 46,
                carbohydrates: 11.5,
                fat: 1.75,
                saturatedFat: 0.25,
                salt: 1.42,
                sugars: 2,
                water: 228,
                description: 'Vegetable soup'
            },
            {
                timestamp: parseDate(
                    '5/5/2021 19:00',
                    DateFormat.EETMETER,
                    new Date(),
                    true
                ) as number,
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

        const result = await parseEetmeter('test/services/data/eetmeterMany.xml');
        expect(result).toStrictEqual(expectedResult);
    });
});

describe('POST food', () => {
    /**
     * UTP: FEX - 1
     */
    // Covering the remaining FoodMapper functions (mapXXX) seems to be impossible
    test('POSTing foodmodels', async () => {
        const food: FoodDiaryData[] = [
            {
                date: '01/01/2020',
                time: '00:00',
                description: '',
                meal_type: MEAL_TYPE.UNDEFINED,
                carbohydrates: '',
                glycemic_index: '',
                base_insulin: '',
                high_correction_insulin: '',
                sports_correction_insulin: '',
                total_insulin: ''
            }
        ];
        const response = await postFoodData(
            food,
            FoodSource.FOOD_DIARY_EXCEL,
            DateFormat.FOOD_DIARY
        );
        expect(response).toBe(undefined);
    });
});

describe('Nightscout food', () => {
    /**
     * UTP: FOOD - 7
     */
    test('import mocked Nightscout response data with carbs', async () => {
        const testNSFood: NightScoutTreatmentModel = {
            _id: '60b2727f6e65983173940135',
            eventType: 'Carb correction',
            created_at: '2021-05-29T00:00:00.000Z',
            carbs: 20,
            notes: 'BlablaTestFood',
            enteredBy: 'Jan',
            utcOffset: 0
        };

        const expectedResult: FoodModel[] = [
            {
                timestamp: new Date('2021-05-29T00:00:00.000Z').getTime(),
                carbohydrates: 20,
                description: 'BlablaTestFood'
            }
        ];
        expect(await parseNightScout([], [testNSFood], OutputDataType.FOOD)).toStrictEqual(
            expectedResult
        );
    });

    /**
     * UTP: FOOD - 8
     */
    test('import mocked Nightscout response data with several food properties', async () => {
        const testNSFood: NightScoutTreatmentModel = {
            _id: '60b2727f6e65983173940135',
            eventType: 'Carb correction',
            created_at: '2021-05-29T00:00:00.000Z',
            carbs: 20,
            protein: 20,
            fat: 20,
            notes: 'BlablaTestFood',
            enteredBy: 'Jan',
            utcOffset: 0
        };

        const expectedResult: FoodModel[] = [
            {
                timestamp: new Date('2021-05-29T00:00:00.000Z').getTime(),
                carbohydrates: 20,
                proteins: 20,
                fat: 20,
                description: 'BlablaTestFood'
            }
        ];
        expect(await parseNightScout([], [testNSFood], OutputDataType.FOOD)).toStrictEqual(
            expectedResult
        );
    });
});

describe('Food mapper', () => {
    /**
     * UTP: FOOD - 9
     */
    test('unsupported food source', () => {
        new FoodMapper(); // test if class is error-free and can be created
        expect(() => {
            FoodMapper.mapFood('nonsense' as unknown as FoodSource, DateFormat.FOOD_DIARY);
        }).toThrow('Food source not supported');
    });
});
