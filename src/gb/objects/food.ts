/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityModel } from '../models/activityModel';
import { FoodModel } from '../models/foodModel';
import {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST
} from '../models/gamebusModel';
import { Activity, QueryOrder } from './activity';
import { GameBusObject } from './base';

//const util = require('util')

/**
 * Class for food-specific functions
 */
export class Food extends GameBusObject {
    public foodGameDescriptor = 'Nutrition_Diary';
    public foodGameDescriptorID = 58;

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     * @param headers request headers
     * @param query request query parameters
     */
    async postSingleFoodActivity(
        model: FoodModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data = this.toPOSTData(model, playerID);
        const response = await this.activity.postActivity(data, headers, query);
        return response;
    }

    /**
     * Function that posts multiple food models for a given player
     * @param models models to be POSTed
     * @param playerID playerID of player for who this is posted
     * @param headers request headers
     * @param query request query
     */
    async postMultipleFoodActivities(
        models: FoodModel[],
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data: IDActivityPOSTData[] = [];
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item, playerID));
        });
        console.log(data);
        const response = await this.activity.postActivities(data, headers, query);
        return response;
    }

    /**
     * Function that creates a POSTData from a model and playerID
     * @param model FoodModel object
     * @param playerID player ID of the user
     */
    public toPOSTData(model: FoodModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: this.foodGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: '', //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in FoodPropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({
                    propertyTK: `${FoodPropertyKeys[key]}`,
                    value: model[key]
                });
            }
        }
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     * @param model FoodModel object
     * @param playerID player ID of the user
     */
    public toIDPOSTData(model: FoodModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: this.foodGameDescriptorID,
            dataProvider: this.activity.dataProviderID,
            image: '', //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as IDPropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in FoodIDs) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({ property: FoodIDs[key], value: model[key] });
            }
        }
        return obj;
    }

    /**
     * Function that returns all fooddata
     * @param playerID player ID of the user
     * @param headers request headers
     * @param query request query parameters
     * @returns All food activities
     */
    async getAllFoodActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<FoodModel[]> {
        const result = await this.activity.getAllActivitiesWithGd(
            playerId,
            [this.foodGameDescriptor],
            headers,
            query
        );
        //console.log(util.inspect(result, false, null, true /* enable colors */))
        return Food.convertResponseToFoodModels(result);
    }

    /**
     * Function that returns all activities of given types between given dates (as unix)
     * @param playerId ID of player
     * @param startDate Starting date (including, unix)
     * @param endDate Ending date (excluding, unix)
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All activities of given types between given dates (excluding end)
     */
    async getFoodActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<FoodModel[]> {
        const result = await this.activity.getAllActivitiesBetweenUnixWithGd(
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
        return Food.convertResponseToFoodModels(result);
    }

    /**
     * Function that returns all activities of given types on given date (as unix)
     * @param playerId ID of player
     * @param date Date as unix
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All activities of given types on given date
     */
    async getFoodActivitiesOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<FoodModel[]> {
        const result = await this.activity.getActivitiesOnUnixDateWithGd(
            playerId,
            date,
            [this.foodGameDescriptor],
            order,
            limit,
            page,
            headers,
            query
        );
        return Food.convertResponseToFoodModels(result);
    }

    /**
     * Converts a response of ActivityGETData to a FoodModel
     * @param response single ActivityGETData to convert
     * @returns FoodModel with correct properties filled in
     */
    private static convertResponseToFoodModel(response: ActivityGETData): FoodModel {
        // Get ActivityModels from response
        const activities = Activity.getActivityInfoFromActivity(response);
        //console.log(activities);
        // We already know the date, carbs level will be 0 for now
        const model: FoodModel = {
            timestamp: activities[0].timestamp,
            carbohydrates: 0,
            activityId: response.id
        };
        //console.log(response)
        //console.log(activities)
        activities.forEach((activity: ActivityModel) => {
            const key =
                Object.keys(FoodPropertyKeys).find(
                    (key) => FoodPropertyKeys[key] === activity.property.translationKey
                ) ?? activity.property.translationKey; //used the online key if no translation is found
            model[key] = activity.value;
        });
        return model;
    }

    /**
     * Converts an entire response to GlucoseModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of GlucoseModels
     */
    static convertResponseToFoodModels(response: ActivityGETData[] | undefined): FoodModel[] {
        if (!response) {
            return [];
        }
        return response
            .filter((response: ActivityGETData) => {
                return response.propertyInstances.length > 0;
            })
            .map((response: ActivityGETData) => {
                return this.convertResponseToFoodModel(response);
            });
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
    description = 'DESCRIPTION'
}

const FoodIDs = Object.freeze({
    description: 12,
    calories: 77,
    fibers: 79,
    carbohydrates: 1176,
    meal_type: 1177,
    glycemic_index: 1178,
    fat: 1179,
    saturatedFat: 1180,
    proteins: 1181,
    salt: 1182,
    water: 1183,
    sugars: 1184
});

export { FoodIDs };
