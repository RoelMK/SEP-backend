/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityModel } from '../models/activityModel';
import {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST
} from '../models/gamebusModel';
import { InsulinModel } from '../models/insulinModel';
import { Activity, QueryOrder } from './activity';
import { GameBusObject } from './base';
import { Keys } from './keys';

/**
 * Class for insulin-specific functions
 */
export class Insulin extends GameBusObject {
    /**
     * Function that returns all insulin activities
     * @param playerId ID of player
     * @param headers Any extra headers
     * @param query Any queries
     * @returns All insulin activities
     */
    async getInsulinActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getAllActivitiesWithGd(
            playerId,
            [Keys.insulinTranslationKey],
            headers,
            query
        );
    }

    /**
     * Function that returns all insulin activities between given dates (as unix)
     * @param playerId ID of player
     * @param startDate Starting date (including, unix)
     * @param endDate Ending date (excluding, unix)
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All insulin activities between given dates (excluding end)
     */
    async getInsulinActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<InsulinModel[]> {
        return Insulin.convertResponseToInsulinModels(
            await this.activity.getAllActivitiesBetweenUnixWithGd(
                playerId,
                startDate,
                endDate,
                [Keys.insulinTranslationKey],
                order,
                limit,
                page,
                headers,
                query
            )
        );
    }

    /**
     * Function that returns all insulin activities on given date (as unix)
     * @param playerId ID of player
     * @param date Date as unix
     * @param order Optional, ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All  insulin activities on given date
     */
    async getInsulinActivitiesOnUnixDate(
        playerId: number,
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
            [Keys.insulinTranslationKey],
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
            timestamp: response.date,
            insulinAmount: 0,
            insulinType: 0,
            activityId: response.id
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
                                insulin.insulinAmount = activity.value;
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
    static convertResponseToInsulinModels(response: ActivityGETData[] | undefined): InsulinModel[] {
        if (!response) {
            return [];
        }
        return response
            .filter((response: ActivityGETData) => {
                return response.propertyInstances.length > 0;
            })
            .map((response: ActivityGETData) => {
                return this.convertInsulinResponseToModel(response);
            });
    }

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleInsulinActivity(
        model: InsulinModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data = this.toPOSTData(model, playerID);
        const response = await this.activity.postActivity(data, headers, query);
        return response;
    }

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postMultipleInsulinActivities(
        models: InsulinModel[],
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data: IDActivityPOSTData[] = [];
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item, playerID));
        });
        const response = await this.activity.postActivities(data, headers, query);
        return response;
    }

    /**
     * Function that replaces the insulin model with a new model
     * @param model New model (with ID of old model), must have activityId
     * @param playerId ID of player
     */
    async putSingleInsulinActivity(
        model: InsulinModel,
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        if (model.activityId === undefined) {
            throw new Error('Activity ID must be present in order to replace activity');
        }
        const data = this.toIDPOSTData(model, playerId);
        const response = await this.activity.putActivity(data, model.activityId, headers, query);
        return response;
    }

    /**
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: InsulinModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: Keys.insulinTranslationKey,
            dataProviderName: this.activity.dataProviderName,
            image: '', //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in InsulinPropertyKeys) {
            if (model[key] !== undefined) {
                if (key === 'insulinType') {
                    obj.propertyInstances.push({
                        propertyTK: `${InsulinPropertyKeys[key]}`,
                        value: model[key] ? 'long' : 'rapid'
                    });
                } else {
                    obj.propertyInstances.push({
                        propertyTK: `${InsulinPropertyKeys[key]}`,
                        value: model[key]
                    });
                }
            }
        }

        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     */
    public toIDPOSTData(model: InsulinModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: Keys.insulinGameDescriptorID,
            dataProvider: this.activity.dataProviderID,
            image: '', //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as IDPropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in InsulinIDs) {
            if (model[key] !== undefined) {
                if (key === 'insulinType') {
                    obj.propertyInstances.push({
                        property: InsulinIDs[key],
                        value: model[key] ? 'long' : 'rapid'
                    });
                } else {
                    obj.propertyInstances.push({ property: InsulinIDs[key], value: model[key] });
                }
            }
        }
        return obj;
    }
}

/**
 * Data provider names for known insulin data sources
 */
export enum InsulinDataProviderNames {
    GameBuS = 'GameBus',
    Daily_run = 'Daily_run'
}

/**
 * Relevant properties to map properties of insulin to the insulinModel
 */
export enum InsulinPropertyKeys {
    insulinAmount = 'INSULIN_DOSE',
    insulinType = 'INSULIN_SPEED'
}

const InsulinIDs = Object.freeze({
    //INSULIN_TYPE : 1143,
    insulinAmount: 1144,
    insulinType: 1185
});

export { InsulinIDs };
