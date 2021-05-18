import { InsulinModel } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { parseFoodDiary } from './parseUtils';

test('test robustness of Food diary data parser', async () => {
    try {
        (
            (await parseFoodDiary(
                'test/services/data/abbott_eu.csv',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[1];
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
    } catch (e) {
        console.log(e.message);
        expect(e.message).toBe('Wrong input data for processing food diary data!');
    }
});

/** TODO async error, looks like a catch is needed
test('test robustness of Food diary data parser', async () => {
        expect(async () => {
        (await parseFoodDiary('test/services/data/abbott_eu.csv', OutputDataType.INSULIN) as InsulinModel[])[1]
        }).toThrow('Wrong input data for processing food diary data!');
});*/
