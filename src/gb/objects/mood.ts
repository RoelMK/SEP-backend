import { Query } from '../gbClient';
import { ActivityModel } from '../models/activityModel';
import { ActivityGETData } from '../models/gamebusModel';
import { MoodModel } from '../models/moodModel';
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
    static convertResponseToExerciseModels(response: ActivityGETData[]): MoodModel[] {
        return response.map((response: ActivityGETData) => {
            return this.convertExerciseResponseToModel(response);
        });
    }

    /**
     * Converts a response of ActivityGETData to an ExerciseModel
     * @param response single ActivityGETData to convert
     * @returns ExerciseModel with correct properties filled in
     */
    private static convertExerciseResponseToModel(response: ActivityGETData): MoodModel {
        // We have to convert a single activity response to a single model
        // First convert the response to a list of ActivityModels
        const activities = Activity.getActivityInfoFromActivity(response);

        // We already know the date
        const exercise: MoodModel = {
            timestamp: response.date
        };
        
        // Now we have to map the translationKey to the right key in the ExerciseModel
        activities.forEach((activity: ActivityModel) => {
            // For each of the separate activities (properties), we have to check them against known translation keys
            for (const key in MoodPropertyKeys) {
                if (MoodPropertyKeys[key] === activity.property.translationKey) {
                    exercise[key] = activity.value;
                }
            }
        });
        return exercise;
    }
}

/**
 * Data provider names for known exercise data sources
 */
export enum MoodDataProviderNames {
    DAILY_RUN = 'Daily_run'
}

/**
 * Data property names for known exercise data properties
*/
 export enum MoodGameDescriptorNames {
    logMood = 'LOG_MOOD', // Mood descriptor
}

/**
 * Relevant properties to map properties of activities to the mood model
 */
 export enum MoodPropertyKeys {
    moodArousal = 'MOOD_AROUSAL', // number in range [1,3]
    moodValence = 'MOOD_VALENCE', // number in range [1,3]
}