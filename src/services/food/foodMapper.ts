import FoodModel from '../../gb/models/foodModel';
import { Consumptie } from '../dataParsers/eetmeterParser';
import { NightScoutTreatmentModel } from '../dataParsers/nightscoutParser';
import { DateFormat, parseDate } from '../utils/dates';
import { FoodSource } from './foodParser';

/**
 * Helper class to map the different food sources to 1 foodModel
 */
export default class FoodMapper {
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
            case FoodSource.EETMETER:
                return this.mapEetmeter;
            case FoodSource.NIGHTSCOUT:
                return this.mapNightScout;
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
    private static mapFoodDiary(entry: any): FoodModel {
        return {
            timestamp: parseDate(
                entry.date.replace(/-/g, '/') + ' ' + entry.time,
                DateFormat.FOOD_DIARY,
                new Date(),
                true
            ),
            carbohydrates: parseFloat(entry.carbohydrates),
            description: entry.description
        } as FoodModel;
    }

    /**
     * Maps eetmeter consumtions
     * @param entry Consumptie entry
     * @returns foodModel with information
     */
    private static mapEetmeter(entry: Consumptie): FoodModel {
        const consumption = entry;

        const date = FoodMapper.dateParser(
            consumption.Datum.Jaar,
            consumption.Datum.Maand,
            consumption.Datum.Dag,
            consumption.Attributes.Periode
        );

        const meal = {
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

    /**
     * Abbott mapping function for different timestamps
     * @param entry NightScoutEntryModel entry
     * @returns FoodModel with information
     */
    private static mapNightScout(entry: NightScoutTreatmentModel): FoodModel {
        const meal = {
            timestamp: new Date(entry.created_at).getTime(),
            carbohydrates: entry.carbs,
            description: entry.notes ? entry.notes: '',
            ...(entry.fat && { fat: entry.fat}),
            ...(entry.protein && {proteins: entry.protein})
        } as FoodModel;
        
        return meal;
    }

    private static dateParser(year: number, month: number, day: number, period: string) {
        let hour = 0;
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
