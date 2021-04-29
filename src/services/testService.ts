import GlucoseParser from './glucose/glucoseParser';
import FoodParser, { GlucoseSource } from './glucose/glucoseParser';

/**
async function D1NAMOFoodTest() {
    // Create food parser from .csv file
    const D1NAMOParser = new FoodParser('src/services/food/food_data.csv', FoodSource.D1NAMO);
    // Wait until file is read
    await D1NAMOParser.Ready;
    // Parse the .csv file and process it
    await D1NAMOParser.parse();
    console.log(D1NAMOParser.foodData);
}

async function AbottFoodTest() {
    const AbottParser = new FoodParser('src/services/glucose/glucose_data_abott.csv', FoodSource.ABOTT);
    await AbottParser.Ready;
    await AbottParser.parse();
    console.log(AbottParser.foodData);
}

AbottFoodTest();**/

async function AbottGlucoseTest() {
    const AbottParser = new GlucoseParser('src/services/glucose/Abott_glucose.csv', GlucoseSource.ABOTT);
    await AbottParser.Ready;
    await AbottParser.parse();
    console.log(AbottParser.glucoseData);
}

AbbottFoodTest();
