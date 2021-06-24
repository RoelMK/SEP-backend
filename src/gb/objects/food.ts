import { GameBusObject, Activity } from '.';
import {
    ActivityModel,
    FoodModel,
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST,
    Headers,
    Query
} from '../models';

import { FoodIDs, FoodPropertyKeys, Keys, QueryOrder } from './GBObjectTypes';

//const util = require('util')

/**
 * Class for food-specific functions
 */
export class Food extends GameBusObject {
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
        // Convert food model to POST data and post it
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
        // For each food model, convert it to POST data
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item, playerID));
        });
        // Post the food model data
        const response = await this.activity.postActivities(data, headers, query);
        // Return food response
        return response;
    }

    /**
     * Function that creates a POSTData from a model and playerID
     * @param model FoodModel object
     * @param playerID player ID of the user
     */
    public toPOSTData(model: FoodModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: Keys.foodTranslationKey, // Food game descriptor
            dataProviderName: this.activity.dataProviderName,
            image: '',
            date: model.timestamp, // Food timestamp
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
        // Return as food post data
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     * @param model FoodModel object
     * @param playerID player ID of the user
     */
    public toIDPOSTData(model: FoodModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: Keys.foodGameDescriptorID,
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
            [Keys.foodTranslationKey],
            headers,
            query
        );
        //console.log(util.inspect(result, false, null, true /* enable colors */))
        return Food.convertResponseToFoodModels(result);
    }

    /**
     * Function that returns all food activities between given dates (as unix)
     * @param playerId ID of player
     * @param startDate Starting date (including, unix) of food query
     * @param endDate Ending date (excluding, unix) of food query
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
        page?: number, // Code duplication prevention 146
        headers?: Headers,
        query?: Query
    ): Promise<FoodModel[]> {
        const result = await this.activity.getAllActivitiesBetweenUnixWithGd(
            playerId,
            startDate,
            endDate,
            [Keys.foodTranslationKey],
            order,
            limit,
            page, // Code duplication prevention 157
            headers,
            query
        );
        // Convert response between dates to models
        return Food.convertResponseToFoodModels(result);
    }

    /**
     * Function that returns all food activities on given date (as unix)
     * @param playerId ID of player
     * @param date Date as unix for food query
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All food activities on given date
     */
    async getFoodActivitiesOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 178
        headers?: Headers,
        query?: Query
    ): Promise<FoodModel[]> {
        const result = await this.activity.getActivitiesOnUnixDateWithGd(
            playerId,
            date,
            [Keys.foodTranslationKey],
            order,
            limit,
            page, // Code duplication prevention 188
            headers,
            query
        );
        // Convert response on date to models
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
            activityId: response.id,
            // For graphing activities it's easier if the missing properties are set to null, so we do that here
            calories: null,
            meal_type: null,
            glycemic_index: null,
            fat: null,
            saturatedFat: null,
            proteins: null,
            fibers: null,
            salt: null,
            water: null,
            sugars: null,
            description: null
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
     * Converts an entire response to FoodModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of FoodModels
     */
    static convertResponseToFoodModels(response: ActivityGETData[] | undefined): FoodModel[] {
        if (!response) {
            return [];
        }
        return (
            response
                // Get all relevant food properties
                .filter((response: ActivityGETData) => {
                    return response.propertyInstances.length > 0;
                })
                .map((response: ActivityGETData) => {
                    return this.convertResponseToFoodModel(response);
                })
        );
    }
}
