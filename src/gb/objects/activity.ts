import { Headers, Query } from '../GameBusClient';
import { fromUnixTime, formatISO, addDays } from 'date-fns';
import { ActivityModel } from '../models/ActivityModel';
import { GameBusObject } from './Base';

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

    async getAllActivities(playerId: number, headers?: Headers, query?: Query): Promise<any> {
        const activity = await this.gamebus.get(`players/${playerId}/activities`, headers, query, this.authRequired);
        return activity;
    }

    //TODO: dateformatting (so rounding to the next day instead for end-date and rouding to the previous day for startDate)?
    //NOTE: date is converted to dd-mm-yyyy format, not UNIX timestamp and any hours, minutes etc. are lost!
    async getAllActivitiesDateFilter(
        playerId: number,
        startDate: Date,
        endDate?: Date,
        limit?: number,
        headers?: Headers,
        query?: Query
    ): Promise<any> {
        if (!query) {
            query = {};
        }
        query.start = startDate.toLocaleDateString().replace(/\//g, '-'); //replace / by -
        if (endDate) {
            query.end = endDate.toLocaleDateString().replace(/\//g, '-');
        }
        if (limit) {
            query.limit = String(limit);
        }

        const activity = await this.gamebus.get(`players/${playerId}/activities`, headers, query, this.authRequired);
        return activity;
    }

    /**
     * Get all activities of given user on a specific date
     * @param playerId Player ID
     * @param date Date on which you want to get all activities (as UNIX timestamp)
     * @param order Order of activity by date (descending is default)
     * @param limit Amount of activities to retrieve (default 30)
     */
    async getActivitiesOnDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityModel[]> {
        const dateAsDate = fromUnixTime(date);
        const dateQuery: Query = {
            // Given date formatted in ISO format
            start: formatISO(dateAsDate, { representation: 'date' }),
            // Date of next day (end is exclusive) formatted in ISO
            end: formatISO(addDays(dateAsDate, 1), { representation: 'date' }),
            // Either use the given limit or use 30 as default
            limit: (limit ? limit : 30).toString(),
            // Use given order as order or use descending as default
            sort: `${order ? order : QueryOrder.DESC}date`,
            // Add rest of query
            ...query
        };
        const activities = await this.gamebus.get(
            `players/${playerId}/activities`,
            headers,
            dateQuery,
            this.authRequired
        );
        return activities;
    }
}

export enum QueryOrder {
    ASC = '+',
    DESC = '-'
}
