import { parseOneDriveFoodDiary } from '../testUtils/parseUtils';
import { MEAL_TYPE } from '../../src/gb/models/foodModel';
import { getKeys } from '../../src/services/utils/interfaceKeys';
import OneDriveExcelParser from '../../src/services/fileParsers/oneDriveExcelParser';
import { DataSource } from '../../src/services/dataParsers/dataParserTypes';

jest.mock('axios');
/**
 * UTP: ONED - 10
 */
test('import standardized food diary with missing values from a onedrive', async () => {
    const sampleODInput = [['', 0.966666666666667, 'Breakfast', 'Cheese', 5, 40, 2, 1, '', '']];
    const expectedResult: Record<string, any> = {
        date: '',
        time: '23:12',
        meal_type: MEAL_TYPE.BREAKFAST,
        description: 'Cheese',
        glycemic_index: 40,
        carbohydrates: 5,
        base_insulin: 2,
        high_correction_insulin: 1,
        sports_correction_insulin: '',
        total_insulin: ''
    };
    expect(
        (await parseOneDriveFoodDiary('Documents/DeepFolder/diary.xlsx', sampleODInput))[0]
    ).toStrictEqual(expectedResult);
});

/**
 * UTP: ONED - 11
 */
test('assign keys to raw onedrive data', async () => {
    const sampleODInput = [['', 0.8, 'Breakfast', 'Cheese', 5, 40, 2, 1, '', '']];
    const keys = getKeys(DataSource.FOOD_DIARY);
    const expectedResult: Record<string, any> = [
        {
            date: '',
            time: 0.8,
            meal_type: MEAL_TYPE.BREAKFAST,
            description: 'Cheese',
            glycemic_index: 40,
            carbohydrates: 5,
            base_insulin: 2,
            high_correction_insulin: 1,
            sports_correction_insulin: '',
            total_insulin: ''
        }
    ];
    expect(new OneDriveExcelParser().assignKeys(sampleODInput, keys)).toStrictEqual(expectedResult);
});

/**
 * UTP: ONED - 12
 */
test('assign wrong keys to raw onedrive data', async () => {
    const sampleODInput = [['', 0.8, 'Breakfast', 'Cheese', 5, 40, 2, 1, '', '']];
    const keys = getKeys(DataSource.ABBOTT);
    expect(() => {
        new OneDriveExcelParser().assignKeys(sampleODInput, keys);
    }).toThrow('Length mismatch: 2D array cannot be converted to an object with given keys!');
});

/**
 * UTP: ONED - 13
 */
test('try to assign no keys to raw onedrive data', async () => {
    const sampleODInput = [['', 0.8, 'Breakfast', 'Cheese', 5, 40, 2, 1, '', '']];
    expect(() => {
        new OneDriveExcelParser().assignKeys(sampleODInput);
    }).toThrow('Keys are undefined, no data source was provided!');
});
