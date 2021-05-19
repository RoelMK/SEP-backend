import { parseOneDriveFoodDiary } from './parseUtils';

test('import standardized food diary with missing values from a onedrive', async () => {
    const sampleODInput = [['', 0.966666666666667, '', 5, 2, 1, '', '']];
    const expectedResult: Record<string, any> = {
        date: '',
        time: '23:12',
        description: '',
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
