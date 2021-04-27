import foodModel from '../../gb/models/foodModel';
import { AbottData } from '../csvParser';
import { D1NAMOFoodData, FoodSource } from './foodParser';
import { parse, getUnixTime } from 'date-fns';

/**
 * Helper class to map the different food sources to 1 foodModel
 */
export default class FoodMapper {
    private constructor() {}

    /**
     * Main function that returns the correct mapping function based on given source
     * @param foodSource Food source given as enum
     * @returns Mapping function that maps an entry from the source to a foodModel
     */
    public static mapFood(foodSource: FoodSource) {
        switch (foodSource) {
            case FoodSource.D1NAMO:
                return this.mapD1NAMO;
            case FoodSource.ABOTT:
                return this.mapAbott;
        }
    }

    /**
     * D1NAMO mapping function
     * @param entry D1NAMO entry
     * @returns foodModel with information
     */
    private static mapD1NAMO(entry: D1NAMOFoodData): foodModel {
        // D1NAMO data has no timestamp, calories are converted to numbers
        return {
            timestamp: -1,
            calories: parseInt(entry.calories),
            description: entry.description
        } as foodModel;
    }

    /**
     * Abott mapping function
     * @param entry Abott entry
     * @returns foodModel with information
     */
    private static mapAbott(entry: AbottData): foodModel {
        // We map the timestamp given in the .csv file to a unix timestamp, calories are converted to numbers
        // 1g carbohydrate = 4 calories
        return {
            timestamp: getUnixTime(parse(entry.device_timestamp, 'MM-dd-yyyy p', new Date())),
            calories: parseInt(entry.carbohydrates__grams_) * 4,
            description: entry.notes
        } as foodModel;
    }
}
