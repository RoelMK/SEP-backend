import { InsulinModel } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { parseAbbott } from '../testUtils/parseUtils';

test('test robustness of Abbott data parser', async () => {
    expect(async () => {
        (
            (await parseAbbott(
                'test/services/data/foodDiary_standard.xlsx',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[1];
    }).rejects.toThrow('Wrong input data for processing Abbott data!');
});
