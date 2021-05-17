import AbbottParser from '../../src/services/dataParsers/abbottParser';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';

/**
 * Helper function to parse an Abbott file through the AbbottParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
export async function parseAbbott(filePath: string, type: OutputDataType) {
    const abbottEUParser: AbbottParser = new AbbottParser(filePath);
    await abbottEUParser.process();
    return abbottEUParser.getData(type);
}

/**
 * Helper function to parse a Food diary file through the FoodDiaryParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
 export async function parseFoodDiary(filePath: string, type: OutputDataType) {
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(filePath);
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}


export async function parseOneDriveFoodDiary(filePath: string, type: OutputDataType){
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(filePath,
        'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAARCWSo91Ly6n0mHiGc2PxT7aXT+7Ef+uTGceVNYhfiwgePX7NwG14HWh0GXIXs6JiA6ix2/epDJm/TI/SNt2YYy+4ToHQAzLWd8KIcG7KB/kblFC7EGO7fVcn8gtNkC8TuK0QgHrBq1xCJ/eYCfBGQIL6fAsConMwzEGQPw+fschl4KS4H44uHtHN3BRGpVZibjcRVVfj/LxlubX2dyIJrg0CaL4gONu8XdKIIVgrdNWSFFyexaQwC6X3cN8QJQF6g63Dk/AP81bZt/oEBTyTwTbIt5UhNO55cJN8zoLvCTvTVw5qoOmCkGsjUXzYOWQJUABVUO87ypzuWTaaxAsWUADZgAACO8hK+z4DhgUQAL1Rh/wtDQwa0/YxretUy4r7xvP43QV789DzhoZiV24ZdEpBwToAh9RabHlptGj3o98qAG6vW41QolNbkvNdOpx1G5gKvTUdWwsayL00ZXfDnsCe07suUNi5SdNjp6pZNmQwzuR8X9ot7HLVG4C+DST+R1Av8H+GnFpIA2mFJMibg4Dou/LOP47C+dVrR4DUUzU1naYXeKvSj17Peu7H89gpWflvNwZssYxBzblvfkmG0X+mZYcGDtzQci1NVaIChVVEoqkbwaAJDuk+RGwHyzmz7TnCK1RMctAeQccB0P7TZ9qLChrSp7coyCjvnaTxaP9n/Spbukjv1+Gcj+mN5GwAhCBqh3TW9HrN7EuxoWelbZr1mPfVZJwNqyKrVvGOWqukAZ/AxfYlEG+OEGG3cmNHSoeVbPq9filxfXIERsPUv/QPP8VaC81p45Vj/3stTg2Y1IdRqW3hTBailMigDrZyapAxBdGGlNmQfFcRAqzvaWIU2Ji8sddpRW3brEoi5lSX8WqYRAsFtLcH3QLHhnrVt2XfmfMlnuGlI1btSBVgjzbrkH2mJ+GEqkeJ+VCwPEAjdU2jktpyJWwiXB8srihzctRcuZp/31topNjVr+ObLYRcACwibet9NWUnhpO+pG+dDWBNfy+8X3Eo2QWPu26+soFBFFTfsuFa8UDKfuSdeivK9EkxX956fNKCtkogIqwYd7ymxqCKAW25LCmq5PfYP1t6t/iWY3smUjP0L1XWUORwAWsOD3d39mweC0B/iCHAg==');
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}