import FoodModel from '../../gb/models/foodModel';
import { AbbottData } from '../abbottParser';
import { DateFormat, parseDate } from '../utils/dates';
import { FoodSource } from './foodParser';
import * as EetmeterModels from '../../models/eetmeterModel';

/**
 * Helper class to map the different food sources to 1 foodModel
 */
export default class FoodMapper {
    private constructor() {}

    /**
     * Main function that returns the correct mapping function based on given source
     * @param foodSource Food source given as enum
     * @param dateFormat DateFormat of data source
     * @returns Mapping function that maps an entry from the source to a foodModel
     */
    public static mapFood(foodSource: FoodSource, dateFormat: DateFormat) {
        switch (foodSource) {
            // TODO: improve this code duplication
            case FoodSource.ABBOTT:
                // Abbott depends on date format (US/EU)
                switch (dateFormat) {
                    case DateFormat.ABBOTT_EU:
                        return this.mapAbbottEU;
                    case DateFormat.ABBOTT_US:
                        return this.mapAbbottUS;
                    // Default (unused) case otherwise Typescript will complain
                    default:
                        return this.mapAbbottEU;
                }

            case FoodSource.EETMETER:
                return this.mapEetmeter;

            default:
                return this.mapEetmeter;
        }
    }

    /**
     * Abbott mapping function for EU timestamps
     * @param entry Abbott entry
     * @returns foodModel with information
     */
    private static mapAbbottEU(entry: any): FoodModel {
        // We map the timestamp given in the .csv file to a unix timestamp, calories are converted to numbers
        // 1g carbohydrate = 4 calories
        return {
            timestamp: parseDate(entry.device_timestamp, DateFormat.ABBOTT_EU, undefined, true),
            calories: parseInt(entry.carbohydrates__grams_) * 4,
            description: entry.notes
        } as FoodModel;
    }

    /**
     * Abbott mapping function for US timestamps
     * @param entry Abbott entry
     * @returns foodModel with information
     */
    private static mapAbbottUS(entry: AbbottData): FoodModel {
        // We map the timestamp given in the .csv file to a unix timestamp, calories are converted to numbers
        // 1g carbohydrate = 4 calories
        return {
            timestamp: parseDate(entry.device_timestamp, DateFormat.ABBOTT_US, undefined, true),
            calories: parseInt(entry.carbohydrates__grams_) * 4,
            description: entry.notes
        } as FoodModel;
    }

    /**
     * Maps eetmeter consumtions
     * @param entry Consumptie entry
     * @returns foodModel with information
     */
    private static mapEetmeter(entry: EetmeterModels.Consumptie): FoodModel {
        var consumption = entry;

        var date = FoodMapper.dateParser(
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

        return meal;
    }

    private static dateParser(year: number, month: number, day: number, period: string) {
        var hour = 0;
        if (period == 'Ontbijt') {
            hour = 9;
        } else if (period == 'Lunch') {
            hour = 13;
        } else if (period == 'Avondeten') {
            hour = 19;
        }

        return parseDate(`${day}/${month}/${year} ${hour}:0`, DateFormat.EETMETER, undefined, true);
    }
}
