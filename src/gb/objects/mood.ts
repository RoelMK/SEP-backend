import { values } from 'lodash';
import { Query, Headers } from '../gbClient';
import { ActivityModel } from '../models/activityModel';
import { ActivityGETData } from '../models/gamebusModel';
import { MoodModel } from '../models/moodModel';
import { Activity, QueryOrder } from './activity';
import { GameBusObject } from './base';

export class Mood extends GameBusObject {
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
        gameDescriptors: MoodGameDescriptorNames[],
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getAllActivitiesWithGd(
            playerId,
            gameDescriptors,
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
            valence: 0
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
    async getMoodActivityFromGdOnUnixDate(
        playerId: number,
        gameDescriptors: MoodGameDescriptorNames[],
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
            gameDescriptors,
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
    async getMoodFromGdBetweenUnix(
        playerId: number,
        gameDescriptors: MoodGameDescriptorNames[],
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
            gameDescriptors,
            order,
            limit,
            page,
            headers,
            query
        );
    }
}

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

/**
 * Relevant properties to map properties of activities to the mood model
 */
export enum MoodPropertyKeys {
    moodArousal = 'MOOD_AROUSAL', // number in range [1,3]
    moodValence = 'MOOD_VALENCE' // number in range [1,3]
}
