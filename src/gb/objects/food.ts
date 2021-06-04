/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { FoodModel } from '../models/foodModel';
import { ActivityGETData, ActivityPOSTData, PropertyInstancePOST } from '../models/gamebusModel';
import { QueryOrder } from './activity';
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
        const data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    public toPOSTData(model: FoodModel, playerID: number) : ActivityPOSTData{
        const obj = {
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

    /**
     * Function that returns all exercises from the given exercise type (game descriptors)
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @returns All exercise activities belonging to the given Type(s)
     */
     async getExerciseActivityFromGd(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getAllActivitiesWithGd(
            playerId,
            [this.foodGameDescriptor],
            headers,
            query
        );
    }

    /**
     * Function that returns all activities of given types between given dates (as unix)
     * @param playerId ID of player
     * @param gameDescriptors List of activity types (see below)
     * @param startDate Starting date (including, unix)
     * @param endDate Ending date (excluding, unix)
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All activities of given types between given dates (excluding end)
     */
    async getExerciseActivityFromGdBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getAllActivitiesBetweenUnixWithGd(
            playerId,
            startDate,
            endDate,
            [this.foodGameDescriptor],
            order,
            limit,
            page,
            headers,
            query
        );
    }

    /**
     * Function that returns all activities of given types on given date (as unix)
     * @param playerId ID of player
     * @param gameDescriptors List of activity types (see below)
     * @param date Date as unix
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All activities of given types on given date
     */
    async getExerciseActivityFromGdOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getActivitiesOnUnixDateWithGd(
            playerId,
            date,
            [this.foodGameDescriptor],
            order,
            limit,
            page,
            headers,
            query
        );
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