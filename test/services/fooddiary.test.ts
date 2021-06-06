import { MEAL_TYPE } from '../../src/gb/models/foodModel';
import { InsulinModel } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { parseFoodDiary } from '../testUtils/parseUtils';
import FoodDiaryParser, { FoodDiaryData } from '../../src/services/dataParsers/foodDiaryParser';

test('test robustness of food diary data parser', async () => {
    expect(async () => {
        (
            (await parseFoodDiary(
                'test/services/data/abbott_eu.csv',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[1];
    }).rejects.toThrow('Wrong input data for processing food diary data!');
});

test('test automatic date + total insulin fill', async () => {
    const rawFoodData: FoodDiaryData[] = [
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
            date: '',
            time: '00:00',
            meal_type: MEAL_TYPE.SNACK,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: ''
        }
    ];

    const preprocessedFoodData = [
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
            date: '08/05/21',
            time: '00:00',
            meal_type: MEAL_TYPE.SNACK,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: '3'
        }
    ];
    expect(await FoodDiaryParser.preprocess(rawFoodData)).toStrictEqual(preprocessedFoodData);
});

test('test automatic date + total insulin + time fill', async () => {
    const rawFoodData: FoodDiaryData[] = [
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
            date: '',
            time: '',
            meal_type: MEAL_TYPE.BREAKFAST,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: ''
        },
        {
            date: '08/05/21',
            time: '08:00',
            meal_type: MEAL_TYPE.UNDEFINED,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: '3'
        }
    ];

    const preprocessedFoodData = [
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
            date: '08/05/21',
            time: '08:00',
            meal_type: MEAL_TYPE.BREAKFAST,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: '3'
        },
        {
            date: '08/05/21',
            time: '08:00',
            meal_type: MEAL_TYPE.UNDEFINED,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: '3'
        }
    ];

    const mealTypeMap = new Map<string, string>();
    mealTypeMap.set('Breakfast', '08:00');
    expect(await FoodDiaryParser.preprocess(rawFoodData, mealTypeMap)).toStrictEqual(
        preprocessedFoodData
    );
});

test('test missing first date', async () => {
    const rawFoodData: FoodDiaryData[] = [
        {
            date: '',
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
            date: '',
            time: '00:00',
            meal_type: MEAL_TYPE.SNACK,
            description: '',
            carbohydrates: '5',
            glycemic_index: '3',
            base_insulin: '2',
            high_correction_insulin: '1',
            sports_correction_insulin: '',
            total_insulin: ''
        }
    ];

    expect(async () => {
        await FoodDiaryParser.preprocess(rawFoodData);
    }).rejects.toThrow('First date needs to be filled in!');
});
