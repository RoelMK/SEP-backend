import { parseXml } from './parseUtils';

test('importing xml file', async () => {
    const expectedResult = {
        Root1: { 
            Attributes: 
            { 
                key1: 'value1' 
            }, 
            Root2: 
            { 
                Attributes: 
                {
                    key2: "value 2"
                },
            } 
        }
      };
    expect(await parseXml('test/services/data/test.xml')).toStrictEqual(expectedResult);
});
