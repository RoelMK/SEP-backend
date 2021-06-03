import { Query } from '../gbClient';
import { ActivityGETData } from '../models/gamebusModel';
import { Activity } from './activity';
import { GameBusObject } from './base';

export class Mood extends GameBusObject {
    private insulinId = 0; // TODO: assign to GameBus-given activity ID

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All insulin activities (provided ID is correct)
     */
    async getAllInsulinActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        //const insulin = await this.activity.getAllActivitiesWithId(this.insulinId, headers, query);
        return undefined as unknown as ActivityGETData[];
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
 export enum MoodPropertyKeys {
    moodArousal = 'MOOD_AROUSAL', // number in range [1,3]
    moodValence = 'MOOD_VALENCE', // number in range [1,3]
}