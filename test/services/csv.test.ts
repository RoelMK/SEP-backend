import { parseCsv } from './parseUtils';

test('importing csv file', async () => {
    const expectedResult = [
        {
            column1: 'value11',
            column_2: 'value12',
            column_3: 'value13'
        },
        {
            column1: '21',
            column_2: '22',
            column_3: '23'
        }
    ];
    expect(await parseCsv('test/services/data/test.csv')).toStrictEqual(expectedResult);
});
