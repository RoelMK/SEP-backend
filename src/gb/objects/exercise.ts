import { Query, Headers } from '../gbClient';
import { ActivityGETData } from '../models/gamebusModel';
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
        return await this.activity.getAllActivities(playerId, headers, {
            gds: gameDescriptors.join(','),
            ...query
        });
    }

    // Not sure if this one is possible
    async getExerciseActivityFromDp(
        dataProvider: ExerciseDataProviderNames,
        headers?: Headers,
        query?: Query
    ): Promise<void> {
        // TODO: we only want to get activities from the given data provider (name)
    }
}

/**
 * Data provider names for known exercise data sources
 * TODO: might be missing some?
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
