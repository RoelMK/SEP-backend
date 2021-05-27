import { Query, Headers } from '../gbClient';
import { ActivityGETData } from '../models/gamebusModel';
import { GameBusObject } from './base';

/**
 * Class for glucose-specific functions
 */
export class Glucose extends GameBusObject {
    private glucoseId = ""; // TODO: assign to GameBus-given activity ID

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All glucose activities (provided ID is correct)
     */
    async getAllGlucoseActivities(playerId: number,headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        const glucose = await this.activity.getAllActivitiesWithId(this.glucoseId,playerId, headers, query);
        return glucose as unknown as ActivityGETData[];
    }
}
