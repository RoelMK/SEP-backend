import {
    ActivityModel,
    ExerciseModel,
    ActivityGETData,
    ActivityPOSTData,
    PropertyInstancePOST,
    Query,
    Headers
} from '../models';
import { startCase, toLower } from 'lodash';
import { GameBusObject, Activity } from '.';
import {
    ExerciseGameDescriptorNames,
    ExercisePropertyKeys,
    Keys,
    QueryOrder
} from './GBObjectTypes';

/**
 * Class for exercise-specific functions
 */
export class Exercise extends GameBusObject {
    async postSingleExerciseActivity(
        model: ExerciseModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        // Convert exercise model to POST data and post it
        const data = this.toPOSTData(model, playerID);
        const response = await this.activity.postActivity(data, headers, query);
        return response;
    }
    /**S
     * Function that creates a SPOSTData from a model and playerID
     * @param model FoodModel object
     * @param playerID player ID of the user
     */
    public toPOSTData(model: ExerciseModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: ExerciseGameDescriptorNames[model.type],
            // We post as Mibida since they have all permissions
            dataProviderName: Keys.gbDataProviderTK,
            image: '', //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in ExercisePropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({
                    propertyTK: `${ExercisePropertyKeys[key]}`,
                    value: model[key]
                });
            }
        }
        // Return as exercise POST data
        return obj;
    }

    /**
     * Function that returns ALL exercise activities
     * @param playerId ID of player
     * @returns All exercise activities as ExerciseModels
     */
    async getAllExerciseActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ExerciseModel[]> {
        return await this.getExerciseActivityFromGd(
            playerId,
            Object.values(ExerciseGameDescriptorNames),
            headers,
            query
        );
    }

    /**
     * Function that returns all exercises from the given exercise type (game descriptors)
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @returns All exercise activities belonging to the given Type(s) as ExerciseModels
     */
    async getExerciseActivityFromGd(
        playerId: number,
        gameDescriptors: ExerciseGameDescriptorNames[],
        headers?: Headers,
        query?: Query
    ): Promise<ExerciseModel[]> {
        const response = await this.activity.getAllActivitiesWithGd(
            playerId,
            gameDescriptors,
            headers,
            query
        );
        // Convert exercise from GD to model
        return Exercise.convertResponseToExerciseModels(response);
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
     * @returns All activities of given types between given dates (excluding end) as ExerciseModels
     */
    async getExerciseActivityFromGdBetweenUnix(
        playerId: number,
        gameDescriptors: ExerciseGameDescriptorNames[],
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 117
        headers?: Headers,
        query?: Query
    ): Promise<ExerciseModel[]> {
        const response = await this.activity.getAllActivitiesBetweenUnixWithGd(
            playerId,
            startDate,
            endDate,
            gameDescriptors,
            order,
            limit,
            page, // Code duplication prevention 126
            headers,
            query
        );
        // Convert exercise from GD between unix dates to model
        return Exercise.convertResponseToExerciseModels(response);
    }

    /**
     * Function that returns ALL exercise activities between given dates
     * @param playerId ID of player
     * @param startDate Starting date (including, unix) of exercise query
     * @param endDate Ending date (excluding, unix) of exercise query
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns ALL exercise activities between given dates as ExerciseModels
     */
    async getAllExerciseActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 152
        headers?: Headers,
        query?: Query
    ): Promise<ExerciseModel[]> {
        return await this.getExerciseActivityFromGdBetweenUnix(
            playerId,
            Object.values(ExerciseGameDescriptorNames),
            startDate,
            endDate,
            order,
            limit,
            page, // Code duplication prevention 160
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
     * @returns All activities of given types on given date as ExerciseModels
     */
    async getExerciseActivityFromGdOnUnixDate(
        playerId: number,
        gameDescriptors: ExerciseGameDescriptorNames[],
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 185
        headers?: Headers,
        query?: Query
    ): Promise<ExerciseModel[]> {
        const response = await this.activity.getActivitiesOnUnixDateWithGd(
            playerId,
            date,
            gameDescriptors,
            order,
            limit,
            page, // Code duplication prevention 192
            headers,
            query
        );
        // Convert exercise from GD on unix date to model
        return Exercise.convertResponseToExerciseModels(response);
    }

    /**
     * Function that returns ALL exercise activities on given date
     * @param playerId ID of player
     * @param date Date as unix
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns ALL activities on given date as ExerciseModels
     */
    async getAllExerciseActivitiesOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 217
        headers?: Headers,
        query?: Query
    ): Promise<ExerciseModel[]> {
        return await this.getExerciseActivityFromGdOnUnixDate(
            playerId,
            Object.values(ExerciseGameDescriptorNames),
            date,
            order,
            limit,
            page, // Code duplication prevention 223
            headers,
            query
        );
    }

    /**
     * Converts a response of ActivityGETData to an ExerciseModel
     * @param response single ActivityGETData to convert
     * @returns ExerciseModel with correct properties filled in
     */
    private static convertExerciseResponseToModel(response: ActivityGETData): ExerciseModel {
        // We have to convert a single activity response to a single model
        // First convert the response to a list of ActivityModels
        const activities = Activity.getActivityInfoFromActivity(response);
        // We already know the date
        const exercise: ExerciseModel = {
            timestamp: response.date,
            // Name is simply the translation key but correctly capitalized and removed underscores
            name: startCase(toLower(activities[0].translationKey)),
            // Since the response is a single activity,
            // the translation key (of the game descriptor) will be the same for all properties
            type: activities[0].translationKey,
            activityId: response.id,
            // For graphing activities it's easier if the missing properties are set to null, so we do that here
            duration: null,
            steps: null,
            distance: null,
            calories: null,
            groupSize: null,
            penalty: null,
            score: null,
            maxSpeed: null,
            avgSpeed: null,
            maxHeartrate: null,
            avgHeartrate: null,
            minHeartrate: null,
            heartrate: null
        };
        // Now we have to map the translationKey to the right key in the ExerciseModel
        activities.forEach((activity: ActivityModel) => {
            // For each of the separate activities (properties), we have to check them against known translation keys
            for (const key in ExercisePropertyKeys) {
                if (ExercisePropertyKeys[key] === activity.property.translationKey) {
                    exercise[key] = activity.value;
                }
            }
        });
        return exercise;
    }

    /**
     * Converts an entire response to ExerciseModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of ExerciseModels
     */
    static convertResponseToExerciseModels(
        response: ActivityGETData[] | undefined
    ): ExerciseModel[] {
        if (!response) {
            return [];
        }
        return (
            response
                // Get all relevant exercise properties
                .filter((response: ActivityGETData) => {
                    return response.propertyInstances.length > 0;
                })
                .map((response: ActivityGETData) => {
                    return this.convertExerciseResponseToModel(response);
                })
        );
    }
}
