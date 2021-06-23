import ExcelParser, { ExcelConfig } from '../../src/services/fileParsers/excelParser';

/**
 * UTP: XLSX - ?? TODO
 */
test('parse Excel file', async () => {
    const expectedOutput = [
        {
            A: 'test',
            B: '1',
            C: '',
            D: '3',
            Date: '1/1/21'
        }
    ];
    const config: ExcelConfig = {
        raw: false,
        range: 0,
        defval: '', // standard value for missing values
        blankrows: false
    };
    expect(await new ExcelParser(config).parse('test/services/data/testExcel.xlsx')).toStrictEqual(
        expectedOutput
    );
});

/**
 * UTP: XLSX - ?? TODO
 */
test('parse Excel file raw data', async () => {
    const expectedOutput = [
        {
            A: 'test',
            B: 1,
            C: '',
            D: 3,
            Date: 44197
        }
    ];
    const config: ExcelConfig = {
        raw: true,
        range: 0, // no header keys specified, so start from one and make package use header in file
        defval: '', // standard value for missing values
        blankrows: false
    };
    expect(await new ExcelParser(config).parse('test/services/data/testExcel.xlsx')).toStrictEqual(
        expectedOutput
    );
});
