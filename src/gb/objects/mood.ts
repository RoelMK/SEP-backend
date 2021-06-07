/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST
} from '../models/gamebusModel';
import { MoodModel } from '../models/moodModel';
import { GameBusObject } from './base';
import { ActivityModel } from '../models/activityModel';
import { Activity, QueryOrder } from './activity';

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
    static convertResponseToMoodModels(response: ActivityGETData[]): MoodModel[] {
        return response.map((response: ActivityGETData) => {
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
     * @param gameDescriptors List of activity types (see below)
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
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getActivitiesOnUnixDateWithGd(
            playerId,
            date,
            [this.moodTranslationKey],
            order,
            limit,
            page,
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
    async getMoodActivitiesBetweenUnix(
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
            [this.moodTranslationKey],
            order,
            limit,
            page,
            headers,
            query
        );
    }

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleMoodActivity(
        model: MoodModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data = this.toPOSTData(model, playerID);
        const response = await this.activity.postActivity(data, headers, query);
        return response;
    }

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
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
    async putSingleMoodActivity(
        model: MoodModel,
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        if (model.activityId === undefined) {
            throw new Error('Activity ID must be present in order to replace activity');
        }
        const data = this.toIDPOSTData(model, playerId);
        const response = await this.activity.putActivity(data, model.activityId, headers, query);
        return response;
    }

    /**
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: MoodModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: this.moodGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: '', //TODO add image?
            date: model.timestamp,
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
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     */
    public toIDPOSTData(model: MoodModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: this.moodGameDescriptorID,
            dataProvider: this.activity.dataProviderID,
            image: '', //TODO add image?
            date: model.timestamp,
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

/**
 * Relevant properties to map properties of activities to the mood model
 */
export enum MoodPropertyKeys {
    arousal = 'MOOD_AROUSAL', // number in range [1,3]
    valence = 'MOOD_VALENCE' // number in range [1,3]
}

const MoodIDs = Object.freeze({
    arousal: 1186,
    valence: 1187
});

export { MoodIDs };

/**
 * Data provider names for known mood data sources
 */
export enum MoodDataProviderNames {
    DAILY_RUN = 'Daily_run'
}

/**
 * Data property names for known mood data properties
 */
export enum MoodGameDescriptorNames {
    logMood = 'LOG_MOOD' // Mood descriptor
}
