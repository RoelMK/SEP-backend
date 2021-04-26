import { Headers, Query } from '../GamebusClient';
import { GameBusObject } from './base';

// TODO: add ActivityModel to models/activityModel
/**
 * Class that is used to GET/POST to GameBus activities
 */
export class Activity extends GameBusObject {
    /**
     * Gets activity from activity ID
     * @param activityId Activity ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns Activity associated to given ID
     */
    async getActivityById(activityId: number, headers?: Headers, query?: Query): Promise<ActivityModel> {
        // TODO: change url if needed (see endpoint constant in GameBusClient.ts)
        const activity: ActivityModel = await this.gamebus.get(
            `activities/${activityId}`,
            headers,
            query,
            this.authRequired
        );
        return activity;
    }
}
