import { convertMG_DLtoMMOL_L, convertMMOL_LtoMG_dL } from '../../../src/services/utils/units';

test('mg/dL to mmol/L', () => {
    expect(convertMG_DLtoMMOL_L(84)).toBe(4.662);
});

test('mmol/L to mg/dL', () => {
    expect(convertMMOL_LtoMG_dL(4.662)).toBe(83.999916);
});
