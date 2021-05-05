import { getUnixTime, parse } from 'date-fns';
import { insulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import AbbottParser, { AbbottDataType } from '../../src/services/abbottParser';
import { DateFormat } from '../../src/services/dateParser';

test('import Abbott EU insulin', async () => {
    const abbottEUParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv');
    await abbottEUParser.process();
    let expectedResult: insulinModel = {
        insulinAmount: 9,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('01/03/2021 14:36', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(abbottEUParser.getData(AbbottDataType.INSULIN)).toStrictEqual([expectedResult]);
});

test('import Abbott US insulin', async () => {
    const abbottUSParser: AbbottParser = new AbbottParser('test/services/data/abbott_us.csv');
    await abbottUSParser.process();
    let expectedResult: insulinModel = {
        insulinAmount: 14,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('11-29-2018 11:34 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(abbottUSParser.getData(AbbottDataType.INSULIN)).toStrictEqual([expectedResult]);
});
