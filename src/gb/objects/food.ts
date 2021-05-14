import { Query, Headers } from '../gbClient';
import { ActivityGETData } from '../models/gamebusModel';
import { GameBusObject } from './base';

/**
 * Class for food-specific functions
 */
export class Food extends GameBusObject {
    private foodId: number = 0; // TODO: assign to GameBus-given activity ID

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All food activities (provided ID is correct)
     */
    async getAllFoodActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        const food = await this.activity.getAllActivitiesWithId(this.foodId, headers, query);
        return (food as unknown) as ActivityGETData[];
    }
}
