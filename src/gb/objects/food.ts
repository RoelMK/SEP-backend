/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { FoodModel } from '../models/foodModel';
import { ActivityGETData, ActivityPOSTData, PropertyInstancePOST } from '../models/gamebusModel';
import { GameBusObject } from './base';

/**
 * Class for food-specific functions
 */
export class Food extends GameBusObject {
    private foodId = 0; // TODO: assign to GameBus-given activity ID
    public foodGameDescriptor = "Nutrion_Diary";

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All food activities (provided ID is correct)
     */
    async getAllFoodActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        //const food = await this.activity.getAllActivitiesWithId(this.foodId, headers, query);
        return undefined as unknown as ActivityGETData[];
    }

    async postSingleFoodActivity(model: FoodModel, playerID: number, headers?: Headers, query?:Query) {
        let data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    public toPOSTData(model: FoodModel, playerID: number) : ActivityPOSTData{
        let obj = {
            gameDescriptorTK: this.foodGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: "", //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        }
        for (const key in FoodPropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({propertyTK : `${FoodPropertyKeys[key]}`, value : model[key]})
            }
        }
        return obj;
    }
}

export enum FoodPropertyKeys {
    carbohydrates = 'FOOD_CARBOHYDRATES_GRAMS',
    calories = 'KCAL_CARB',
    meal_type = 'FOOD_MEAL_TYPE',
    glycemic_index = 'FOOD_GLYCEMIC_INDEX',
    fat = 'FOOD_FAT_GRAMS',
    saturatedFat = 'FOOD_SATURATED_FAT_GRAMS',
    proteins = 'FOOD_PROTEINS_GRAMS',
    fibers = 'FIBERS_WEIGHT',
    salt = 'FOOD_SALT_GRAMS',
    water = 'FOOD_WATER_GRAMS',
    sugars = 'FOOD_SUGAR_GRAMS',
    description = 'DESCRIPTION',
}