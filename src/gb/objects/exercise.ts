/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityModel } from '../models/activityModel';
import { ExerciseModel } from '../models/exerciseModel';
import { ActivityGETData, PropertyInstanceReference } from '../models/gamebusModel';
import { Activity, QueryOrder } from './activity';
import { GameBusObject } from './base';

/**
 * Class for exercise-specific functions
 */
export class Exercise extends GameBusObject {
    /**
     * Function that returns all exercises from the given exercise type (game descriptors)
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @returns All exercise activities belonging to the given Type(s)
     */
    async getExerciseActivityFromGd(
        playerId: number,
        gameDescriptors: ExerciseGameDescriptorNames[],
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
        gameDescriptors: ExerciseGameDescriptorNames[],
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
        gameDescriptors: ExerciseGameDescriptorNames[],
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
            timestamp: response.date
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
    static convertResponseToExerciseModels(response: ActivityGETData[]): ExerciseModel[] {
        return response.map((response: ActivityGETData) => {
            return this.convertExerciseResponseToModel(response);
        });
    }
}

/**
 * Data provider names for known exercise data sources
 */
export enum ExerciseDataProviderNames {
    GAMEBUS = 'GameBus',
    FITBIT = 'Fitbit',
    RUNKEEPER = 'Runkeeper',
    GOOGLE_FIT = 'Google Fit',
    STRAVA = 'Strava',
    DAILY_RUN = 'Daily_run'
}

/**
 * Data property names for known exercise data properties
 * While these are all 1 to 1 with key : value, it is still good to know what activities there are
 * These activities all have different properties (detailed below)
 */
export enum ExerciseGameDescriptorNames {
    WALK = 'WALK', // Steps, distance, duration, kcal
    RUN = 'RUN', // Steps, distance, duration, kcal
    BIKE = 'BIKE', // Distance, duration, kcal
    SOCCER = 'SOCCER', // Duration, group size
    BASKETBALL = 'BASKETBALL', // Duration, kcal
    VOLLEYBALL = 'VOLLEYBALL', // Duration, kcal
    RUGBY = 'RUGBY', // Duration, kcal
    BASEBALL = 'BASEBALL', // Duration, kcal
    HORSE_RIDING = 'HORSE_RIDING', // Duration, kcal
    ATHLETICS = 'ATHLETICS', // Duration, kcal
    SWIMMING = 'SWIMMING', // Distance, duration, kcal
    WATER_POLO = 'WATER_POLO', // Duration, kcal
    SURFING = 'SURFING', // Duration, kcal
    GOLF = 'GOLF', // Duration, kcal
    LACROSSE = 'LACROSSE', // Duration, kcal
    TENNIS = 'TENNIS', // Duration, group size, kcal
    SQUASH = 'SQUASH', // Duration, kcal
    BADMINTON = 'BADMINTON', // Duration, kcal
    TABLE_TENNIS = 'TABLE_TENNIS', // Duration, kcal
    SKIING = 'SKIING', // Distance, duration, kcal
    ICE_HOCKEY = 'ICE_HOCKEY', // Duration, kcal
    FIELD_HOCKEY = 'FIELD_HOCKEY', // Duration, kcal
    ICE_SKATING = 'ICE_SKATING', // Distance, duration, kcal
    ROLLER_SKATING = 'ROLLER_SKATING', // Distance, duration, kcal
    FITNESS = 'FITNESS', // Duration, group size, kcal
    YOGA = 'YOGA', // Duration, group size, kcal
    AEROBICS = 'AEROBICS', // Duration, kcal
    MARTIAL_ARTS = 'MARTIAL_ARTS', // Duration, kcal
    DANCE = 'DANCE', // Duration, group size, kcal
    POOL = 'POOL', // Duration, group size
    DARTS = 'DARTS', // Duration, group size
    AIR_HOCKEY = 'AIR_HOCKEY', // Duration, penalty, score
    BOWLING = 'BOWLING', // Duration, score
    CHESS = 'CHESS', // Duration
    GYMNASTICS = 'GYMNASTICS', // Duration, kcal, reason?
    HIKE = 'HIKE', // Nothing
    MOUNTAINBIKE = 'MOUNTAINBIKE', // Nothing,
    WALK_DETAIL = 'WALK(DETAIL)', // Steps, distance, duration, speed (max, avg), kcal, heart rate (max, avg, min), accelerometer, ppg
    RUN_DETAIL = 'RUN(DETAIL)', // Steps, distance, duration, speed (max, avg), kcal, heart rate (max, avg, min), accelerometer, ppg
    BIKE_DETAIL = 'BIKE(DETAIL)' // Nothing
}

/**
 * Relevant properties to map properties of activities to the exerciseModel
 * [key in exerciseModel] = [translationKey in GameBus]
 * TODO: add heartbeat data from FitBit
 */
export enum ExercisePropertyKeys {
    duration = 'DURATION', // in seconds as string
    steps = 'STEPS', // in amount as string
    distance = 'DISTANCE', // in meters as string
    calories = 'KCALORIES', // in kcal as string
    groupSize = 'GROUP_SIZE', // in amount as string
    penalty = 'PENALTY', // in amount [0 - 100] as string
    score = 'SCORE' // in amount [-inf, inf] as string
}
