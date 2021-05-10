import FoodModel from '../../gb/models/foodModel';
import * as EetmeterModels from '../../models/eetmeterModel';

/**
 * Food parser class that takes in json and processes it to foodModels
 */
export default class EetMeterParser {
    // Food data to be exported
    foodData?: FoodModel[] = [];

    // TODO: change to other inputs if needed
    constructor(private readonly foodInput: EetmeterModels.EetmeterData) {
        // Process incoming foodInput data
        this.process();
    }

    /**
     * Map data from eetmeter to the FoodModel
     */
    private process() {
        for (var i = 0; i < this.foodInput.Consumpties.Consumptie.length; i++) {
            var consumption = this.foodInput.Consumpties.Consumptie[i];
            var date = this.dateParser(
                consumption.Datum.Jaar,
                consumption.Datum.Maand,
                consumption.Datum.Dag,
                consumption.Attributes.Periode
            );
            let meal = {
                timestamp: date,
                calories: consumption.Nutrienten.Koolhydraten.Value * 4,
                carbohydrates: consumption.Nutrienten.Koolhydraten.Value,
                fat: consumption.Nutrienten.Vet.Value,
                saturatedFat: consumption.Nutrienten.VerzadigdVet.Value,
                salt: consumption.Nutrienten.Zout.Value,
                sugars: consumption.Nutrienten.Suikers.Value,
                water: consumption.Nutrienten.Water.Value,
                description: consumption.Product.Naam
            } as FoodModel;
            this.foodData?.push(meal);
        }
    }

    /**
     * Posts the imported food data to GameBus
     */
    async post() {
        // TODO: post the foodData (correctly formatted) to GameBus
    }

    private dateParser(year: number, month: number, day: number, period: string) {
        var hour = 0;
        if (period == 'Ontbijt') {
            hour = 9;
        } else if (period == 'Lunch') {
            hour = 13;
        } else if (period == 'Avondeten') {
            hour = 19;
        }

        let date: Date = new Date(year, month, day, hour);
        return date.getTime();
    }
}
