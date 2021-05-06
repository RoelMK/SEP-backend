import { Headers, Query, queryDateFormat } from '../gbClient';
import { fromUnixTime, format, addDays, getUnixTime } from 'date-fns';
import { ActivityModel, ActivityProperty } from '../models/activityModel';
import { GameBusObject } from './base';
import { ActivityGETData, PropertyInstanceReference } from '../models/gamebusModel';

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
    async getActivityById(activityId: number, headers?: Headers, query?: Query): Promise<ActivityGETData> {
        const activity: ActivityGETData = await this.gamebus.get(
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
    async getAllActivities(playerId: number, headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        const activity: ActivityGETData[] = await this.gamebus.get(
            `players/${playerId}/activities`,
            headers,
            query,
            this.authRequired
        );
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
    ): Promise<ActivityGETData[]> {
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
    ): Promise<ActivityGETData[]> {
        const dateQuery: Query = {
            // Given date formatted in ISO format
            start: format(startDate, queryDateFormat),
            // Date of next day (end is exclusive) formatted in ISO
            end: format(endDate, queryDateFormat),
            // Either use the given limit or use 30 as default
            limit: (limit ? limit : 30).toString(),
            // Use given order as order or use descending as default
            sort: `${order ? order : QueryOrder.DESC}date`,
            // Add rest of query
            ...query
        };
        const activities: ActivityGETData[] = await this.gamebus.get(
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
    ): Promise<ActivityGETData[]> {
        const dateAsDate = fromUnixTime(date);
        const tomorrowAsDate = addDays(dateAsDate, 1);
        const tomorrowUnix = getUnixTime(tomorrowAsDate);
        const activities: ActivityGETData[] = await this.getAllActivitiesBetweenUnix(
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
    ): Promise<ActivityGETData[]> {
        const tomorrowAsDate = addDays(date, 1);
        const activities: ActivityGETData[] = await this.getAllAcitivitiesBetweenDate(
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
    // TODO: perhaps transform the ActivityGETData[] from the current requests into ActivityModel[]

    /**
     * Example method that converts the ActivityGETData to (multiple) ActivityModels
     * @param activity Response from GET activity request
     * @returns List of ActivityModels corresponding to the response from the GET
     */
    static getActivityInfoFromActivity(activity: ActivityGETData): ActivityModel[] {
        // Get property instances
        const properties: PropertyInstanceReference[] = activity.propertyInstances;
        // Prepare output array
        const activityModels: ActivityModel[] = [];
        // For each property instance, correctly transform the property and all relevant information to ActivityModel
        properties.forEach((value: PropertyInstanceReference) => {
            const valueProperty: ActivityProperty = {
                id: value.property.id,
                translationKey: value.property.translationKey,
                baseUnit: value.property.baseUnit,
                inputType: value.property.inputType
            };
            const activityModel: ActivityModel = {
                timestamp: activity.date,
                id: value.id,
                value: value.value,
                property: valueProperty
            };
            // Add model to array
            activityModels.push(activityModel);
        });
        return activityModels;
    }
}

export enum QueryOrder {
    ASC = '+',
    DESC = '-'
}
