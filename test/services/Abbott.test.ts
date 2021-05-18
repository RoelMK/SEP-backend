import { InsulinModel } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { parseAbbott, parseFoodDiary } from './parseUtils';

test('test robustness of Abbott data parser', async () => {
    try {
        (
            (await parseAbbott(
                'test/services/data/foodDiary_standard.xlsx',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[1];
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
    } catch (e) {
        expect(e.message).toBe('Wrong input data for processing Abbott data!');
    }
});

/** TODO async error, looks like a catch is needed
 * test('test robustness of Abbott data parser', async () => {
     expect(async () => {
        (await parseAbbott('test/services/data/foodDiary_standard.xlsx', OutputDataType.INSULIN) as InsulinModel[])[1]
        }).toThrow('Wrong input data for processing Abbott data!');
});
 */
