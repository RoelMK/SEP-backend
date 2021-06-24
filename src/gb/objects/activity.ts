import { GameBusClient, queryDateFormat } from '../gbClient';
import { format, addDays, addYears } from 'date-fns';
import {
    ActivityProperty,
    ActivityModel,
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    PropertyInstanceReference,
    Headers,
    Query
} from '../models';
import { fromUnixMsTime } from '../../services/utils/dates';
import FormData from 'form-data';
import { ExerciseGameDescriptorNames, Keys, QueryOrder } from './GBObjectTypes';

/**
 * Class that is used to GET/POST to GameBus activities
 * This is a general class that can be used for all activity types
 * This class should contain the basic GET/POST methods that are valid for all activities
 */
export class Activity {
    constructor(private readonly gamebus: GameBusClient, private readonly authRequired: boolean) {}
    public dataProviderName = 'Daily_run';
    public dataProviderID = 18;

    /**
     * PUTs an activity using given data on given activity ID
     * @param data Activity data to replace current activity with
     * @param activityId Activity ID to replace
     */
    async putActivity(
        data: IDActivityPOSTData,
        activityId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        // PUT uses form-data, so we convert data to string and send as form data
        const activityBody = new FormData();
        activityBody.append('activity', JSON.stringify(data));
        const formHeaders = activityBody.getHeaders();

        // We have to create the headers here because FormData has some extra headers
        let activityHeaders = this.gamebus.createHeader(true, headers);
        activityHeaders = {
            ...activityHeaders,
            ...formHeaders
        };

        // URL can be created here as well
        const gamebusUrl = this.gamebus.createURL(`activities/${activityId}`, {
            dryrun: 'false',
            ...query
        });

        // Then send the request
        const response = await this.gamebus.client.request({
            method: 'PUT',
            url: gamebusUrl,
            headers: activityHeaders,
            data: activityBody
        });
        return response.data as ActivityGETData[];
    }

    /**
     * Posts an activity using the given data
     */
    async postActivity(
        data: ActivityPOSTData,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        const response = (await this.gamebus.post(
            'me/activities',
            data,
            headers,
            { dryrun: 'false', ...query },
            true,
            false
        )) as ActivityGETData[];
        return response;
    }

    /**
     * Posts all activities using the given data in a single POST
     */
    async postActivities(
        data: IDActivityPOSTData[],
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const response = await this.gamebus.post(
            'me/activities',
            data,
            headers,
            { dryrun: 'false', bulk: 'true', ...query },
            true,
            false
        );
        return response;
    }

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
     * @param playerId ID of player
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
            // We want to get ALL activities, but the DETAIL activities have to be explicitly mentioned,
            // so we add ALL game descriptor keys
            {
                gds: [
                    Object.values(ExerciseGameDescriptorNames),
                    Keys.foodTranslationKey,
                    Keys.insulinTranslationKey,
                    Keys.glucoseTranslationKey,
                    Keys.moodTranslationKey,
                    Keys.bmiTranslationKey
                ].join(','),
                // This is done because of an issue in GameBus where the default /activities endpoint
                // does not return all activities
                end: format(addYears(new Date(), 10), queryDateFormat),
                ...query
            },
            this.authRequired
        );
        return activity;
    }

    /**
     * Gets the activities from given game descriptor translation keys
     * @param playerId ID of player
     * @param gameDescriptors List of game descriptor translation keys of activities to return
     * @returns List of activities that match the given game descriptor translation keys
     */
    async getAllActivitiesWithGd(
        playerId: number,
        gameDescriptors: string[],
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        const activities = await this.gamebus.get(
            `players/${playerId}/activities`,
            headers,
            {
                gds: gameDescriptors.join(','),
                ...query
            },
            this.authRequired
        );
        return activities;
    }

    /**
     * Get all activities on a specified date range
     * @param playerId ID of player
     * @param startDate Start date (inclusive)
     * @param endDate End date (exclusive)
     * @param order Order of activities (date ascending/descending)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns List of activities
     */
    async getAllAcitivitiesBetweenDate(
        playerId: number,
        startDate: Date,
        endDate: Date,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 199
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        // Make a query for the given start and end date
        let dateQuery: Query = {
            // Given date formatted in ISO format
            start: format(startDate, queryDateFormat),
            // Date of next day (end is exclusive) formatted in ISO
            end: format(endDate, queryDateFormat),
            // Use given order as order or use descending as default
            sort: `${order ? order : QueryOrder.DESC}date`,
            // Add rest of query
            ...query
        };
        if (limit !== undefined) {
            dateQuery = {
                ...dateQuery,
                // Use the given limit only if specified
                limit: limit.toString()
            };
        }
        if (page !== undefined) {
            dateQuery = {
                ...dateQuery,
                // Use page number only if specified
                page: page.toString()
            };
        }
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
     * @param order Order of activities (date ascending/descending)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns List of activities
     */
    async getAllActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 252
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
            page, // Code duplication prevention 264
            headers,
            query
        );
    }

    /**
     * Combination of getting certain activities between given unix dates
     * @param playerId ID of player
     * @param startDate Starting date (including, unix)
     * @param endDate Ending date (excluding, unix)
     * @param gameDescriptors List of game descriptor translation keys
     * @param order Order of date, ascending or descending
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns Activities of given types between given dates
     */
    async getAllActivitiesBetweenUnixWithGd(
        playerId: number,
        startDate: number,
        endDate: number,
        gameDescriptors: string[],
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 288
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.getAllActivitiesBetweenUnix(
            playerId,
            startDate,
            endDate,
            order,
            limit,
            page,
            headers,
            {
                gds: gameDescriptors.join(','),
                ...query
            }
        );
    }

    /**
     * Shortcut function to get all activities of given user on a specific date
     * @param playerId Player ID
     * @param date Date on which you want to get all activities
     * @param order Order of activity by date (descending is default)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     */
    async getActivitiesOnDate(
        playerId: number,
        date: Date,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 320
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
            page, // Code duplication prevention 332
            headers,
            query
        );
        // Return all activities on given date
        return activities;
    }

    /**
     * Shortcut function to get all activities of given user on a specific date
     * @param playerId Player ID
     * @param date Date on which you want to get all activities (as millisecond UNIX (13-digit))
     * @param order Order of activity by date (descending is default)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     */
    async getActivitiesOnUnixDate(
        playerId: number,
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 352
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
            page, // Code duplication prevention 368
            headers,
            query
        );
        // Return all activities between given dates
        return activities;
    }

    /**
     * Shortcut function to get all activities of given user on a specific date with given game descriptors
     * @param playerId Player ID
     * @param date Date on which you want to get all activities (as millisecond UNIX (13-digit))
     * @param gameDescriptors List of game descriptor translation keys
     * @param order Order of activity by date (descending is default)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     */
    async getActivitiesOnUnixDateWithGd(
        playerId: number,
        date: number,
        gameDescriptors: string[],
        order?: QueryOrder,
        limit?: number,
        page?: number, // Code duplication prevention 390
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.getActivitiesOnUnixDate(playerId, date, order, limit, page, headers, {
            gds: gameDescriptors.join(','),
            ...query
        });
    }

    /**
     * Deletes an activity with activity ID
     * @param activityId Activity ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns The response
     */
    async deleteActivityById(
        activityId: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const resp = await this.gamebus.delete(
            `activities/${activityId}`,
            headers,
            query,
            this.authRequired
        );
        return resp;
    }

    /**
     * Deletes all activities
     * @param playerID playerID
     */
    async deleteAllActivities(playerID: number): Promise<void> {
        const activities: ActivityGETData[] = await this.getAllActivities(playerID);
        if (activities.length === 0) {
            return;
        }
        for (const act of activities) {
            await this.deleteActivityById(act.id);
        }
        await this.deleteAllActivities(playerID);
    }

    /**
     * Function to check whether the specified activity is of the correct type (correct game descriptor)
     * @param activityId ID of activity to check
     * @param expectedTranslationKey Expected translation key of activity's game descriptor
     * @returns true if the activity's game descriptor matches the expected game descriptor
     */
    async checkActivityType(
        activityId: number,
        expectedTranslationKey: string,
        headers?: Headers,
        query?: Query
    ): Promise<boolean> {
        const activity: ActivityGETData = await this.getActivityById(activityId, headers, query);
        return activity.gameDescriptor.translationKey === expectedTranslationKey;
    }

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
                activityId: activity.id,
                timestamp: activity.date,
                id: value.id,
                translationKey: activity.gameDescriptor.translationKey,
                // Make sure value is always a number
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                value: isNaN(value.value * 1) ? value.value : value.value * 1,
                property: valueProperty
            };
            // Add model to array
            activityModels.push(activityModel);
        });
        return activityModels;
    }
}
