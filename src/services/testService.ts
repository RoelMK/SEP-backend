import GlucoseParser from './glucose/glucoseParser';
import FoodParser, { GlucoseSource } from './glucose/glucoseParser';

async function AbbottGlucoseTest() {
    const AbottParser = new GlucoseParser('src/services/glucose/glucose_data_abbott_eu.csv', GlucoseSource.ABOTT);
    await AbottParser.Ready;
    console.log(AbottParser.glucoseData);
}

AbbottGlucoseTest();
