import { DBClient } from '../../src/db/dbClient';
import { FoodModel, MEAL_TYPE } from '../../src/gb/models/foodModel';
import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { AbbottData } from '../../src/services/dataParsers/abbottParser';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { FoodDiaryData } from '../../src/services/dataParsers/foodDiaryParser';
import FoodParser, { FoodSource } from '../../src/services/food/foodParser';
import GlucoseParser, { GlucoseSource } from '../../src/services/glucose/glucoseParser';
import InsulinParser, { InsulinSource } from '../../src/services/insulin/insulinParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import { parseAbbott, parseEetmeter, parseFoodDiary } from '../testUtils/parseUtils';
import fs from 'fs';
import { GameBusToken } from '../../src/gb/auth/tokenHandler';

// database init
beforeAll(() => {
    // Proper cleaning is required after each task
    process.env.DATABASE = 'db.test.db';
    const dbClient = new DBClient();
    dbClient.reset();
    dbClient.close();
});

// database destroy
afterAll(() => {
    try {
        fs.unlinkSync(process.env.DATABASE!); // Remove db file
    } catch (error) {
        return;
    }
});

// Before each test, clear the file parse events so old entries are not used
beforeEach(() => new DBClient().cleanFileParseEvents());

/**
 * Checks whether updating only new data within files works as intended
 */
describe('Parsing files twice without updates returns nothing', () => {
    /**
     * Abbott Libreview
     */
    test('only update new abbott export entries, parsing same file should return nothing', async () => {
        const expectedResultGlucose: GlucoseModel[] = [
            {
                glucoseLevel: 6.4,
                timestamp: parseDate(
                    '25/01/2020 14:53',
                    DateFormat.ABBOTT_EU,
                    new Date(),
                    true
                ) as number
            },
            {
                glucoseLevel: 5.8,
                timestamp: parseDate(
                    '25/01/2020 14:58',
                    DateFormat.ABBOTT_EU,
                    undefined,
                    true
                ) as number
            },
            {
                glucoseLevel: 4,
                timestamp: parseDate(
                    '25/01/2020 15:03',
                    DateFormat.ABBOTT_EU,
                    undefined,
                    true
                ) as number
            }
        ];

        expect(
            await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.GLUCOSE, true)
        ).toStrictEqual(expectedResultGlucose);

        // then it is old, so it should not be retrieved
        expect(
            await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.GLUCOSE, true)
        ).toStrictEqual([]);
    });

    /**
     * Food diary
     */
    test('only update new fooddiary entries, parsing same file should return nothing', async () => {
        // expected results
        const expectedResultFood: FoodModel = {
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
        // first time, the data is retrieved
        // food
        expect(
            (
                (await parseFoodDiary(
                    'test/services/data/foodDiary_standard_missing_table.xlsx',
                    OutputDataType.FOOD,
                    true
                )) as FoodModel[]
            )[1]
        ).toStrictEqual(expectedResultFood);

        // then it should not be parsed
        // food
        expect(
            (await parseFoodDiary(
                'test/services/data/foodDiary_standard_missing_table.xlsx',
                OutputDataType.FOOD,
                true
            )) as FoodModel[]
        ).toStrictEqual([]);
    });

    /**
     * Eetmeter
     */
    test('only update new Eetmeter entries, parsing same file should return nothing', async () => {
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

        // first all data is retrieved
        const result = await parseEetmeter('test/services/data/eetmeterMany.xml', true);
        expect(result).toStrictEqual(expectedResult);

        // then nothing is parsed, because nothing has been added
        const resultOnlyNewest = await parseEetmeter('test/services/data/eetmeterMany.xml', true);
        expect(resultOnlyNewest).toStrictEqual([]);
    });
});

describe('Tests if ModelParsers only process to newest data', () => {
    /**
     * Tests the update newest function on the food and insulin parsers
     */
    test('Update newest on the food and insulin parser', async () => {
        const rawDiaryData: FoodDiaryData[] = [
            {
                date: '08/05/21',
                time: '13:12',
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Pizza',
                carbohydrates: '3',
                glycemic_index: '2',
                base_insulin: '4',
                high_correction_insulin: '',
                sports_correction_insulin: '',
                total_insulin: '4'
            },
            {
                date: '01/05/21',
                time: '13:12',
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Old stuff',
                carbohydrates: '3',
                glycemic_index: '2',
                base_insulin: '4',
                high_correction_insulin: '',
                sports_correction_insulin: '',
                total_insulin: '4'
            }
        ];

        // pick a timestamp between the two entries in the food diary
        const inbetweenTimestamp = parseDate(
            '04/05/21 00:00',
            DateFormat.FOOD_DIARY,
            new Date(),
            true
        ) as number;

        // define expected outcomes
        const expectedFood: FoodModel[] = [
            {
                timestamp: parseDate(
                    '08/05/21 13:12',
                    DateFormat.FOOD_DIARY,
                    new Date(),
                    true
                ) as number,
                carbohydrates: 3,
                glycemic_index: 2,
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Pizza'
            }
        ];

        const expectedInsulin: InsulinModel[] = [
            {
                timestamp: parseDate(
                    '08/05/21 13:12',
                    DateFormat.FOOD_DIARY,
                    new Date(),
                    true
                ) as number,
                insulinType: InsulinType.RAPID,
                insulinAmount: 4
            }
        ];

        const dummyUserInfo: GameBusToken = {
            playerId: '1',
            accessToken: '12345',
            refreshToken: '67890'
        };

        // create parsers
        const foodParser: FoodParser = new FoodParser(
            rawDiaryData,
            FoodSource.FOOD_DIARY_EXCEL,
            DateFormat.FOOD_DIARY,
            dummyUserInfo,
            true,
            inbetweenTimestamp
        );
        const insulinParser: InsulinParser = new InsulinParser(
            rawDiaryData,
            InsulinSource.FOOD_DIARY_EXCEL,
            DateFormat.FOOD_DIARY,
            dummyUserInfo,
            true,
            inbetweenTimestamp
        );

        expect(foodParser.foodData).toBeDefined();
        expect(foodParser.foodData).toStrictEqual(expectedFood);
        expect(insulinParser.insulinData).toBeDefined();
        expect(insulinParser.insulinData).toStrictEqual(expectedInsulin);
    });

    /**
     * Tests the update newest function on the flucose parsers
     */
    test('Update newest on the glucose parser', async () => {
        const abbott: AbbottData[] = [
            {
                device: '',
                serial_number: '',
                device_timestamp: '01/01/2020 00:00',
                record_type: '0',
                historic_glucose_mg_dl: '',
                historic_glucose_mmol_l: '6',
                scan_glucose_mg_dl: '',
                scan_glucose_mmol_l: '',
                non_numeric_rapid_acting_insulin: '',
                rapid_acting_insulin__units_: '',
                non_numeric_food: '',
                carbohydrates__grams_: '',
                carbohydrates__servings_: '',
                non_numeric_long_acting_insulin: '',
                long_acting_insulin__units_: '',
                long_acting_insulin_value__units_: '',
                notes: '',
                strip_glucose_mg_dl: '',
                strip_glucose_mmol_l: '',
                ketone_mmol_l: '',
                meal_insulin__units_: '',
                correction_insulin__units_: '',
                user_change_insulin__units_: ''
            },
            {
                device: '',
                serial_number: '',
                device_timestamp: '01/01/2018 00:00',
                record_type: '0',
                historic_glucose_mg_dl: '',
                historic_glucose_mmol_l: '6',
                scan_glucose_mg_dl: '',
                scan_glucose_mmol_l: '',
                non_numeric_rapid_acting_insulin: '',
                rapid_acting_insulin__units_: '',
                non_numeric_food: '',
                carbohydrates__grams_: '',
                carbohydrates__servings_: '',
                non_numeric_long_acting_insulin: '',
                long_acting_insulin__units_: '',
                long_acting_insulin_value__units_: '',
                notes: '',
                strip_glucose_mg_dl: '',
                strip_glucose_mmol_l: '',
                ketone_mmol_l: '',
                meal_insulin__units_: '',
                correction_insulin__units_: '',
                user_change_insulin__units_: ''
            }
        ];

        // define a timestamp between the two entries
        const inbetweenTimestamp = parseDate(
            '01/01/2019 00:00',
            DateFormat.ABBOTT_EU,
            new Date(),
            true
        ) as number;

        // define expected outcome
        const expectedGlucose: GlucoseModel[] = [
            {
                timestamp: parseDate(
                    '01/01/2020 00:00',
                    DateFormat.ABBOTT_EU,
                    new Date(),
                    true
                ) as number,
                glucoseLevel: 6
            }
        ];

        const dummyUserInfo: GameBusToken = {
            playerId: '1',
            accessToken: '12345',
            refreshToken: '67890'
        };

        // create parser
        const glucoseParser: GlucoseParser = new GlucoseParser(
            abbott,
            GlucoseSource.ABBOTT,
            DateFormat.ABBOTT_EU,
            dummyUserInfo,
            true,
            inbetweenTimestamp
        );

        expect(glucoseParser.glucoseData).toBeDefined();
        expect(glucoseParser.glucoseData).toStrictEqual(expectedGlucose);
    });


    test('Update newest on a ModelParser but no last update timestamp has been set', async () => {
        const rawDiaryData: FoodDiaryData[] = [
            {
                date: '08/05/21',
                time: '13:12',
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Pizza',
                carbohydrates: '3',
                glycemic_index: '2',
                base_insulin: '4',
                high_correction_insulin: '',
                sports_correction_insulin: '',
                total_insulin: '4'
            }
        ];
        // define expected outcomes
        const expectedFood: FoodModel[] = [
            {
                timestamp: parseDate(
                    '08/05/21 13:12',
                    DateFormat.FOOD_DIARY,
                    new Date(),
                    true
                ) as number,
                carbohydrates: 3,
                glycemic_index: 2,
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Pizza'
            }
        ];
        const dummyUserInfo: GameBusToken = {
            playerId: '1',
            accessToken: '12345',
            refreshToken: '67890'
        };

        // create parser without timestamp but with updating newest on
        const foodParser: FoodParser = new FoodParser(
            rawDiaryData,
            FoodSource.FOOD_DIARY_EXCEL,
            DateFormat.FOOD_DIARY,
            dummyUserInfo,
            true
        );
        expect(foodParser.foodData).toBeDefined();
        expect(foodParser.foodData).toStrictEqual(expectedFood);
    });

    test('Update newest on a ModelParser but last update timestamp has been set to 0', async () => {
        const rawDiaryData: FoodDiaryData[] = [
            {
                date: '08/05/21',
                time: '13:12',
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Pizza',
                carbohydrates: '3',
                glycemic_index: '2',
                base_insulin: '4',
                high_correction_insulin: '',
                sports_correction_insulin: '',
                total_insulin: '4'
            }
        ];
        // define expected outcomes
        const expectedFood: FoodModel[] = [
            {
                timestamp: parseDate(
                    '08/05/21 13:12',
                    DateFormat.FOOD_DIARY,
                    new Date(),
                    true
                ) as number,
                carbohydrates: 3,
                glycemic_index: 2,
                meal_type: MEAL_TYPE.UNDEFINED,
                description: 'Pizza'
            }
        ];
        const dummyUserInfo: GameBusToken = {
            playerId: '1',
            accessToken: '12345',
            refreshToken: '67890'
        };

        // create parser without timestamp but with updating newest on
        const foodParser: FoodParser = new FoodParser(
            rawDiaryData,
            FoodSource.FOOD_DIARY_EXCEL,
            DateFormat.FOOD_DIARY,
            dummyUserInfo,
            true,
            0
        );
        expect(foodParser.foodData).toBeDefined();
        expect(foodParser.foodData).toStrictEqual(expectedFood);
    });
});
