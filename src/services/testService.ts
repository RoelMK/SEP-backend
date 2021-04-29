import FoodParser, { FoodSource } from './food/foodParser';

async function D1NAMOFoodTest() {
    // Create food parser from .csv file
    const D1NAMOParser = new FoodParser('src/services/food/food_data.csv', FoodSource.D1NAMO);
    // Wait until file is read (and parsed)
    await D1NAMOParser.Ready;
    console.log(D1NAMOParser.foodData);
}

async function AbbottFoodTest() {
    const AbbottParser = new FoodParser('src/services/glucose/glucose_data_abbott_eu.csv', FoodSource.ABBOTT);
    await AbbottParser.Ready;
    console.log(AbbottParser.foodData);
}

AbbottFoodTest();
