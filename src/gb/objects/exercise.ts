import { Query, Headers } from '../gbClient';
import { ActivityGETData } from '../models/gamebusModel';
import { GameBusObject } from './base';

/**
 * Class for exercise-specific functions
 */
export class Exercise extends GameBusObject {
    /**
     * Example function that retrieves an activity based on a set ID
     * TODO: find the query string to only get activities with a certain ID
     * @param activityType ID (Type) of activity to get (see below)
     * @returns All exercise activities belonging to the given Type
     */
    async getExerciseActivity(
        playerId: number,
        activityType: string,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        const exercise = await this.activity.getAllActivitiesWithId(activityType,playerId, headers, query);
        // TODO: fix the return type, this is just a hack to get TypeScript to not complain
        return exercise as unknown as ActivityGETData[];
    }
}

/**
 * Different IDs defined by GameBus for the different activity types we are interested in
 * TODO: add these IDs
 */
export enum ExerciseActivity {
    STEPS = 0,
    HEART_BEAT = 1,
    CALORIES_BURNT = 2
}
