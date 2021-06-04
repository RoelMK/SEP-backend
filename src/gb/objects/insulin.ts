/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityModel } from '../models/activityModel';
import { ActivityGETData } from '../models/gamebusModel';
import { InsulinModel } from '../models/insulinModel';
import { Activity, QueryOrder } from './activity';
import { GameBusObject } from './base';


/**
 * Class for insulin-specific functions
 */
export class Insulin extends GameBusObject {

    /**
     * Function that returns all insulin activities from a given game descriptors
     * @param playerId ID of player
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @param headers Any extra headers
     * @param query Any queries
     * @returns All insulin activities belonging to the given descriptor(s)
     */
     async getInsulinActivityFromGd(
        playerId: number,
        gameDescriptors: InsulinGameDescriptorNames[],
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getAllActivitiesWithGd(
            playerId,
            gameDescriptors,
            headers,
            query
        );
    }

    /**
     * Function that returns all insulin activities between given dates (as unix)
     * @param playerId ID of player
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @param startDate Starting date (including, unix)
     * @param endDate Ending date (excluding, unix)
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All insulin activities between given dates (excluding end)
     */
     async getInsulinActivityFromGdBetweenUnix(
        playerId: number,
        gameDescriptors: InsulinGameDescriptorNames[],
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getAllActivitiesBetweenUnixWithGd(
            playerId,
            startDate,
            endDate,
            gameDescriptors,
            order,
            limit,
            page,
            headers,
            query
        );
    }


     /**
     * Function that returns all insulin activities on given date (as unix)
     * @param playerId ID of player
     * @param gameDescriptors Game descriptor(s) you want to get activities from
     * @param date Date as unix
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All  insulin activities on given date
     */
      async getInsulinActivityFromGdOnUnixDate(
        playerId: number,
        gameDescriptors: InsulinGameDescriptorNames[],
        date: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getActivitiesOnUnixDateWithGd(
            playerId,
            date,
            gameDescriptors,
            order,
            limit,
            page,
            headers,
            query
        );
    }

    /**
     * Converts a response of ActivityGETData to an InsulinModel
     * @param response single ActivityGETData to convert
     * @returns InsulinModel with correct properties filled in
     */
     private static convertInsulinResponseToModel(response: ActivityGETData): InsulinModel {
            // We have to convert a single activity response to a single model
            // First convert the response to a list of ActivityModels
            const activities = Activity.getActivityInfoFromActivity(response);
            // We already know the date
            const insulin: InsulinModel = {
                timestamp: response.date
            };
            // Now we have to map the translationKey to the right key in the InsulinModel
            activities.forEach((activity: ActivityModel) => {
                // For each of the separate activities (properties), we have to check them against known translation keys
                for (const key in InsulinPropertyKeys) {
                    if (InsulinPropertyKeys[key] === activity.property.translationKey) {

                        switch (InsulinPropertyKeys[key]) {
                        case InsulinPropertyKeys.insulinAmount:
                            //No need of conversion
                            if (typeof activity.value !== 'string') {
                                insulin.insulinAmount =  activity.value;
                            }
                            break;
                        case InsulinPropertyKeys.insulinType:
                            if (typeof activity.value === 'string') {
                                if (activity.value === 'rapid') {
                                    insulin.insulinType = 0;
                                } else {
                                   insulin.insulinType = 1;
                                 }
                            break;
                            }
                    }
                }
            }
            });
            return insulin;
        }

    /**
     * Converts an entire response to InsulinModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of InsulinModels
     */
    static convertResponseToExerciseModels(response: ActivityGETData[]): InsulinModel[] {
        return response.map((response: ActivityGETData) => {
            return this.convertInsulinResponseToModel(response);
        });
    }
}

/**
 * Data provider names for known insulin data sources
 */
 export enum InsulinDataProviderNames {
    GameBuS = 'GameBus',
    Daily_run='Daily_run'
}

/**
 * Data property names for known insulin data properties
 */
export enum InsulinGameDescriptorNames{
    LOG_INSULIN='LOG_INSULIN'   
}

/**
 * Relevant properties to map properties of insulin to the insulinModel
 */
 export enum InsulinPropertyKeys {
    insulinAmount = 'INSULIN_DOSE',
    insulinType = 'INSULIN_SPEED'
}
