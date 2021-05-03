import { Headers, Query } from '../GameBusClient';
import { GameBusObject } from './base';
import { ActivityModel } from '../models/activityModel';

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
            `/v2/activities/${activityId}`,
            headers,
            query,
            this.authRequired
        );
        return activity;
    }

    async getAllActivities(playerId: number, headers?: Headers, query?: Query): Promise<any> {
        const activity = await this.gamebus.get(
            `/v2/players/${playerId}/activities`,
            headers,
            query,
            this.authRequired
        );
        return activity;
    }

    //TODO: dateformatting (so rounding to the next day instead for end-date and rouding to the previous day for startDate)?
    //NOTE: date is converted to dd-mm-yyyy format, not UNIX timestamp and any hours, minutes etc. are lost!
    async getAllActivitiesDateFilter(playerId: number, startDate: Date, endDate?: Date, limit?:number, headers?: Headers, query?: Query): Promise<any> {
        if(!query) {
            query = {}
        }
        query.start = startDate.toLocaleDateString().replace(/\//g,"-") //replace / by -
        if(endDate) {
            query.end = endDate.toLocaleDateString().replace(/\//g,"-")
        }
        if(limit) {
            query.limit = String(limit)
        }

        const activity = await this.gamebus.get(
            `/v2/players/${playerId}/activities`,
            headers,
            query,
            this.authRequired
        );
        return activity;
    }
}
