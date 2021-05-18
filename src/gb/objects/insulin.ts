import { Query, Headers } from '../gbClient';
import { ActivityGETData } from '../models/gamebusModel';
import { GameBusObject } from './base';

/**
 * Class for insulin-specific functions
 */
export class Insulin extends GameBusObject {
    private insulinId: number = 0; // TODO: assign to GameBus-given activity ID

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All insulin activities (provided ID is correct)
     */
    async getAllInsulinActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        const insulin = await this.activity.getAllActivitiesWithId(this.insulinId, headers, query);
        return insulin as unknown as ActivityGETData[];
    }
}
