import { Headers, Query } from '../gbClient';
import { fromUnixTime, formatISO, addDays, getUnixTime } from 'date-fns';
import { ActivityModel } from '../models/activityModel';
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
        const activity: ActivityModel = await this.gamebus.get(
            `activities/${activityId}`,
            headers,
            query,
            this.authRequired
        );
        return activity;
    }

    /**
     * Gets all activities for given player
     * @param playerId Player ID
     * @returns All activities of player
     */
    async getAllActivities(playerId: number, headers?: Headers, query?: Query): Promise<any> {
        const activity = await this.gamebus.get(`players/${playerId}/activities`, headers, query, this.authRequired);
        return activity;
    }

    /**
     * Get all activities on a specified date range (UNIX timestamps)
     * @param playerId Player ID
     * @param startDate Start date (inclusive) as UNIX
     * @param endDate End date (exclusive) as UNIX
     * @param limit Amount of activities (default 30)
     * @returns List of activities
     */
    async getAllActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        headers?: Headers,
        query?: Query
    ): Promise<any> {
        const startDateAsDate = fromUnixTime(startDate);
        const endDateAsDate = fromUnixTime(endDate);
        return await this.getAllAcitivitiesBetweenDate(
            playerId,
            startDateAsDate,
            endDateAsDate,
            order,
            limit,
            headers,
            query
        );
    }
    /**
     * Get all activities on a specified date range
     * @param playerId Player ID
     * @param startDate Start date (inclusive)
     * @param endDate End date (exclusive)
     * @param limit Amount of activities (default 30)
     * @returns List of activities
     */
    async getAllAcitivitiesBetweenDate(
        playerId: number,
        startDate: Date,
        endDate: Date,
        order?: QueryOrder,
        limit?: number,
        headers?: Headers,
        query?: Query
    ): Promise<any> {
        const dateQuery: Query = {
            // Given date formatted in ISO format
            start: formatISO(startDate, { representation: 'date' }),
            // Date of next day (end is exclusive) formatted in ISO
            end: formatISO(endDate, { representation: 'date' }),
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

    /**
     * Shortcut function to get all activities of given user on a specific date
     * @param playerId Player ID
     * @param date Date on which you want to get all activities (as UNIX)
     * @param order Order of activity by date (descending is default)
     * @param limit Amount of activities to retrieve (default 30)
     */
    async getActivitiesOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityModel[]> {
        const dateAsDate = fromUnixTime(date);
        const tomorrowAsDate = addDays(dateAsDate, 1);
        const tomorrowUnix = getUnixTime(tomorrowAsDate);
        const activities = await this.getAllActivitiesBetweenUnix(
            playerId,
            date,
            tomorrowUnix,
            order,
            limit,
            headers,
            query
        );
        return activities;
    }

    /**
     * Shortcut function to get all activities of given user on a specific date
     * @param playerId Player ID
     * @param date Date on which you want to get all activities
     * @param order Order of activity by date (descending is default)
     * @param limit Amount of activities to retrieve (default 30)
     */
    async getActivitiesOnDate(
        playerId: number,
        date: Date,
        order?: QueryOrder,
        limit?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityModel[]> {
        const tomorrowAsDate = addDays(date, 1);
        const activities = await this.getAllAcitivitiesBetweenDate(
            playerId,
            date,
            tomorrowAsDate,
            order,
            limit,
            headers,
            query
        );
        return activities;
    }

    // TODO: query for specific timestamp on a given date to start filtering time periods
}

export enum QueryOrder {
    ASC = '+',
    DESC = '-'
}
