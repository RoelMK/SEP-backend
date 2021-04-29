import foodModel from '../../gb/models/foodModel';
import { AbbottData } from '../abbottParser';
import { FoodSource } from './foodParser';
import { DateFormat, parseDate } from '../dateParser';

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
        }
    }

    /**
     * !UNUSED D1NAMO mapping function
     * @param entry D1NAMO entry
     * @returns foodModel with information
     */
    // private static mapD1NAMO(entry: D1NAMOFoodData): foodModel {
    //     // D1NAMO data has no timestamp, calories are converted to numbers
    //     return {
    //         timestamp: -1,
    //         calories: parseInt(entry.calories),
    //         description: entry.description
    //     } as foodModel;
    // }

    /**
     * Abbott mapping function for EU timestamps
     * @param entry Abbott entry
     * @returns foodModel with information
     */
    private static mapAbbottEU(entry: AbbottData): foodModel {
        // We map the timestamp given in the .csv file to a unix timestamp, calories are converted to numbers
        // 1g carbohydrate = 4 calories
        return {
            timestamp: parseDate(entry.device_timestamp, DateFormat.ABBOTT_EU, undefined, true),
            calories: parseInt(entry.carbohydrates__grams_) * 4,
            description: entry.notes
        } as foodModel;
    }

    /**
     * Abbott mapping function for US timestamps
     * @param entry Abbott entry
     * @returns foodModel with information
     */
    private static mapAbbottUS(entry: AbbottData): foodModel {
        // We map the timestamp given in the .csv file to a unix timestamp, calories are converted to numbers
        // 1g carbohydrate = 4 calories
        return {
            timestamp: parseDate(entry.device_timestamp, DateFormat.ABBOTT_US, undefined, true),
            calories: parseInt(entry.carbohydrates__grams_) * 4,
            description: entry.notes
        } as foodModel;
    }
}
