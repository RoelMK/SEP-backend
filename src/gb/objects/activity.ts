import { GameBusClient, Headers, Query, queryDateFormat } from '../gbClient';
import { fromUnixTime, format, addDays, getUnixTime } from 'date-fns';
import { ActivityProperty, ActivityModel } from '../models/activityModel';
import { ActivityGETData, PropertyInstanceReference } from '../models/gamebusModel';
import { fromUnixMsTime } from '../../services/utils/dates';

/**
 * Class that is used to GET/POST to GameBus activities
 * This is a general class that can be used for all activity types
 * This class should contain the basic GET/POST methods that are valid for all activities
 */
export class Activity {
    constructor(private readonly gamebus: GameBusClient, private readonly authRequired: boolean) {}

    /**
     * Gets activity from activity ID
     * @param activityId Activity ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns Activity associated to given ID
     */
    async getActivityById(
        activityId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData> {
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
     * @returns All activities of player
     */
    async getAllActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        const activity: ActivityGETData[] = await this.gamebus.get(
            `players/${playerId}/activities`,
            headers,
            query,
            this.authRequired
        );
        return activity;
    }

    /**
     * Should get all activities (with possible queries) of the given activity ID/type
     * @param activityId ID (Type) of activity (i.e. ID of "step" activity)
     * @returns All activities of given type
     */
    async getAllActivitiesWithId(activityId: number, headers?: Headers, query?: Query) {
        // TODO: get all activities that belong to the same "activity" (i.e.) all "step" activities
        // TODO: expand with date queries
        return;
    }

    /**
     * Get all activities on a specified date range
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
        // Make a query for the given start and end date
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
        const activities: ActivityGETData[] = await this.getAllActivities(
            playerId,
            headers,
            dateQuery
        );
        return activities;
    }

    /**
     * Get all activities on a specified date range (UNIX timestamps)
     * @param playerId Player ID
     * @param startDate Start date (inclusive) as millisecond UNIX (13-digit)
     * @param endDate End date (exclusive) as millisecond UNIX (13-digit)
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
        const startDateAsDate = fromUnixMsTime(startDate);
        const endDateAsDate = fromUnixMsTime(endDate);
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
        // Simply set the endDate to tomorrow (from date)
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

    /**
     * Shortcut function to get all activities of given user on a specific date
     * @param playerId Player ID
     * @param date Date on which you want to get all activities (as millisecond UNIX (13-digit))
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
        // Create Date from unix timestamp
        const dateAsDate = fromUnixMsTime(date);
        // Get tomorrow from given date
        const tomorrowAsDate = addDays(dateAsDate, 1);
        // Convert tomorrow back to unix timestamp (13-digit)
        const tomorrowUnix = tomorrowAsDate.getTime();
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

    // TODO: query for specific timestamp on a given date to start filtering time periods
    // TODO: perhaps transform the ActivityGETData[] from the current requests into ActivityModel[] (see below)

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
