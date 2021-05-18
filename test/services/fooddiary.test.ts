import { InsulinModel } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { parseFoodDiary } from './parseUtils';

test('test robustness of Food diary data parser', async () => {
    expect(async () => {
        (
            (await parseFoodDiary(
                'test/services/data/abbott_eu.csv',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[1];
    }).rejects.toThrow('Wrong input data for processing food diary data!');
});
