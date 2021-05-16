import FoodModel from '../../gb/models/foodModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { FoodDiaryData } from '../dataParsers/foodDiaryParser';
import { DateFormat, parseDate } from '../utils/dates';
import { FoodSource } from './foodParser';
import { getUnixTime } from 'date-fns';
import { parse } from 'date-fns';

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
            case FoodSource.ABBOTT:
                // Abbott depends on date format (US/EU)
                // returns a mapper function to the parser with a predefined dateFormat argument and variable entry argument
                return function (entry: any): FoodModel {
                    return FoodMapper.mapAbbott(entry, dateFormat);
                };

            case FoodSource.FOOD_DIARY_EXCEL:
                return this.mapFoodDiary;

            default:
                return this.mapFoodDiary;
        }
    }

    /**
     * Abbott mapping function for different timestamps
     * @param entry Abbott entry
     * @param dateFormat the dateFormat in which the date entries are encoded
     * @returns FoodModel with information
     */
    private static mapAbbott(entry: any, dateFormat: DateFormat): FoodModel {
        // We map the timestamp given in the .csv file to a unix timestamp, calories are converted to numbers
        return {
            carbohydrates: parseFloat(entry.carbohydrates__grams_),
            timestamp: parseDate(entry.device_timestamp, dateFormat, undefined, true),
            description: entry.notes
        } as FoodModel;
    }

    /**
     * Excel food diary mapping function
     * @param entry FoodDiary row
     * @returns FoodModel filled with information
     */
    private static mapFoodDiary(entry: any): FoodModel{
        return {
            timestamp: parseDate(entry.date.replace(/-/g, "/") + " " + entry.time, DateFormat.FOOD_DIARY_3, new Date(),true),
            carbohydrates: parseFloat(entry.carbohydrates),
            description: entry.description
        } as FoodModel;
    }
}
