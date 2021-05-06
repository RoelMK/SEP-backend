import FoodModel from '../../gb/models/foodModel';
import { AbbottData } from '../abbottParser';
import { DateFormat } from '../utils/dates';
import FoodMapper from './foodMapper';
import * as EetmeterModels from "../../models/eetmeterModel";

/**
 * Food parser class that takes in json and processes it to foodModels
 */
export default class EeetMeterParser {
    // Food data to be exported
    foodData?: FoodModel[] = [];

    // TODO: change to other inputs if needed
    constructor(
        private readonly foodInput: EetmeterModels.EetmeterData,
    ) {
        // Process incoming foodInput data
        this.process();
    }

    /**
     * Map data from eetmeter to the FoodModel
     */
    private process() {
        for (var i = 0; i < this.foodInput.Consumpties.Consumptie.length; i++) {
            let meal = {
                timestamp: this.foodInput.Consumpties.Consumptie[i].Datum.Jaar,
                calories: this.foodInput.Consumpties.Consumptie[i].Nutrienten.Koolhydraten.Value * 4,
                carbohydrates: this.foodInput.Consumpties.Consumptie[i].Nutrienten.Koolhydraten.Value,
                fat: this.foodInput.Consumpties.Consumptie[i].Nutrienten.Vet.Value,
                saturatedFat: this.foodInput.Consumpties.Consumptie[i].Nutrienten.VerzadigdVet.Value,
                salt: this.foodInput.Consumpties.Consumptie[i].Nutrienten.Zout.Value,
                sugars: this.foodInput.Consumpties.Consumptie[i].Nutrienten.Suikers.Value,
                water: this.foodInput.Consumpties.Consumptie[i].Nutrienten.Water.Value,
                description: this.foodInput.Consumpties.Consumptie[i].Product.Naam,
            } as FoodModel;

            console.log(meal)
            this.foodData?.push(meal)
        }
        console.log(this.foodData)
    }

    /**
     * Posts the imported food data to GameBus
     */
    async post() {
        // TODO: post the foodData (correctly formatted) to GameBus
    }
}
