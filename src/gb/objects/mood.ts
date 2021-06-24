import {
    ActivityPOSTData,
    ActivityGETData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST,
    MoodModel,
    ActivityModel,
    Query,
    Headers
} from '../models';
import { Activity, GameBusObject } from '.';
import { MoodIDs, MoodPropertyKeys, QueryOrder } from './GBObjectTypes';

/**
 * Class for glucose-specific functions
 */
export class Mood extends GameBusObject {
    public moodGameDescriptor = 'LOG_MOOD';
    public moodGameDescriptorID = 1062;

    private moodTranslationKey = 'LOG_MOOD';

    /**
     * Converts an entire response to MoodModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of MoodModels
     */
    static convertResponseToMoodModels(response: ActivityGETData[] | undefined): MoodModel[] {
        if (!response) {
            return [];
        }
        return response
            .filter((response: ActivityGETData) => {
                return response.propertyInstances.length > 0;
            })
            .map((response: ActivityGETData) => {
                return this.convertMoodResponseToModel(response);
            });
    }

    /**
     * Function that returns all moods from the given mood type (game descriptors)
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @returns All mood activities belonging to the given Type(s)
     */
    async getAllMoodActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        // Get all activities with mood ID
        return await this.activity.getAllActivitiesWithGd(
            playerId,
            [this.moodTranslationKey],
            headers,
            query
        );
    }

    /**
     * Converts a response of ActivityGETData to an MoodModel
     * @param response single ActivityGETData to convert
     * @returns MoodModel with correct properties filled in
     */
    private static convertMoodResponseToModel(response: ActivityGETData): MoodModel {
        // This is done so the test cases can pass
        if (!response) {
            return {} as MoodModel;
        }
        // We have to convert a single activity response to a single model
        // First convert the response to a list of ActivityModels
        const activities = Activity.getActivityInfoFromActivity(response);

        // We already know the date and assume arousal and valance
        const mood: MoodModel = {
            timestamp: response.date,
            arousal: 0,
            valence: 0,
            activityId: response.id
        };

        // Now we have to map the translationKey to the right key in the MoodModels
        activities.forEach((activity: ActivityModel) => {
            // For each of the separate activities (properties), we have to check them against known translation keys
            for (const key in MoodPropertyKeys) {
                if (MoodPropertyKeys[key] === activity.property.translationKey) {
                    mood[key] = activity.value;
                }
            }
        });
        return mood;
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
    async getMoodActivitiesOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 108
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getActivitiesOnUnixDateWithGd(
            playerId, // Code duplication prevention 113
            date,
            [this.moodTranslationKey],
            order,
            limit,
            page, // Code duplication prevention 118
            headers,
            query
        );
    }

    /**
     * Function that returns all mood activities between given dates (as unix)
     * @param playerId ID of player
     * @param startDate Starting date (including, unix) of mood query
     * @param endDate Ending date (excluding, unix) of mood query
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All activities of given types between given dates (excluding end)
     */
    async getMoodActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<MoodModel[]> {
        return Mood.convertResponseToMoodModels(
            await this.activity.getAllActivitiesBetweenUnixWithGd(
                playerId,
                startDate,
                endDate,
                [this.moodTranslationKey],
                order,
                limit,
                page, // Code duplication prevention 152
                headers,
                query
            )
        );
    } //

    /**
     * Function that post a single model for a given player
     * @param model single mood model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleMoodActivity(
        model: MoodModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<MoodModel> {
        const data = this.toPOSTData(model, playerID);
        const response: ActivityGETData[] = await this.activity.postActivity(data, headers, query);
        return Mood.convertMoodResponseToModel(response[0]);
    }

    /**
     * Function that post a single model for a given player
     * @param model mood models to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postMultipleMoodActivities(
        models: MoodModel[],
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data: IDActivityPOSTData[] = [];
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item, playerID));
        });
        const response = await this.activity.postActivities(data, headers, query);
        return response;
    }

    /**
     * Function that replaces the mood model with a new model
     * @param model New model (with ID of old model), must have activityId
     * @param playerId ID of player
     */
    public async putSingleMoodActivity(
        model: MoodModel,
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<MoodModel> {
        if (model.activityId === undefined) {
            throw new Error('Activity ID must be present in order to replace activity');
        }
        const data = this.toIDPOSTData(model, playerId);
        const response = (await this.activity.putActivity(
            data,
            model.activityId,
            headers,
            query
        )) as ActivityGETData[];
        return Mood.convertMoodResponseToModel(response[0]);
    }

    /**
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: MoodModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: this.moodGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: '',
            date: model.timestamp, // mood timestamp
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in MoodPropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({
                    propertyTK: `${MoodPropertyKeys[key]}`,
                    value: model[key]
                });
            }
        }
        // Return as mood post data
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     */
    public toIDPOSTData(model: MoodModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: this.moodGameDescriptorID, // Mood game descriptor
            dataProvider: this.activity.dataProviderID,
            image: '',
            date: model.timestamp, // Mood timestamp
            propertyInstances: [] as IDPropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in MoodIDs) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({ property: MoodIDs[key], value: model[key] });
            }
        }
        return obj;
    }
}
