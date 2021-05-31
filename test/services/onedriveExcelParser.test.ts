import { parseOneDriveFoodDiary } from '../testUtils/parseUtils';
import { MEAL_TYPE } from '../../src/gb/models/foodModel';

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
