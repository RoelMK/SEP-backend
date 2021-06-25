import {
    ActivityModel,
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST,
    InsulinModel,
    Query,
    Headers
} from '../models';
import { Activity, GameBusObject } from '.';
import { InsulinIDs, InsulinPropertyKeys, Keys, QueryOrder } from './GBObjectTypes';

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
        // Get all activities with insulin ID
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
     * @param startDate Starting date (including, unix) of insulin query
     * @param endDate Ending date (excluding, unix) of insulin query
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
        page?: number, // Page number for insulin data in case of pagination
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
                page, // Code duplication prevention 67
                headers,
                query
            )
        );
    } ///

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
        page?: number, // Code duplication prevention 88
        headers?: Headers,
        query?: Query
    ): Promise<ActivityGETData[]> {
        return await this.activity.getActivitiesOnUnixDateWithGd(
            playerId, // Code duplication prevention 93
            date,
            [Keys.insulinTranslationKey],
            order,
            limit,
            page, // Code duplication prevention 98
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
        // This is done so the test cases can pass
        if (!response) {
            return {} as InsulinModel;
        }
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
        return (
            response
                // Get all relevant insulin properties
                .filter((response: ActivityGETData) => {
                    return response.propertyInstances.length > 0;
                })
                .map((response: ActivityGETData) => {
                    return this.convertInsulinResponseToModel(response);
                })
        );
    }

    /**
     * Function that post a single model for a given player
     * @param model single insulin model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleInsulinActivity(
        model: InsulinModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<InsulinModel> {
        const data = this.toPOSTData(model, playerID);
        const response: ActivityGETData[] = await this.activity.postActivity(data, headers, query);
        return Insulin.convertInsulinResponseToModel(response[0]);
    }

    /**
     * Function that post a single model for a given player
     * @param model insulin models to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postMultipleInsulinActivities(
        models: InsulinModel[],
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data: IDActivityPOSTData[] = [];
        // For each insulin model, convert it to POST data
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item, playerID));
        });
        // Post the insulin model data
        const response = await this.activity.postActivities(data, headers, query);
        // Return insulin response
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
    ): Promise<InsulinModel> {
        if (model.activityId === undefined) {
            throw new Error('Activity ID must be present in order to replace activity');
        }
        // Convert insulin model to POST data
        const data = this.toIDPOSTData(model, playerId);
        // PUT insulin activity
        const response = (await this.activity.putActivity(
            data, // insulin model
            model.activityId, // insulin activity ID
            headers,
            query
        )) as ActivityGETData[];
        return Insulin.convertInsulinResponseToModel(response[0]);
    }

    /**
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: InsulinModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: Keys.insulinTranslationKey,
            dataProviderName: this.activity.dataProviderName,
            image: '',
            date: model.timestamp, // insulin timestamp
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
            gameDescriptor: Keys.insulinGameDescriptorID, // Insulin game descriptor
            dataProvider: this.activity.dataProviderID,
            image: '',
            date: model.timestamp, // Insulin timestamp
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
