import { convertMG_DLtoMMOL_L } from '../../services/utils/units';
import {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST,
    GlucoseModel,
    ActivityModel,
    Query,
    Headers
} from '../models';
import { Activity, GameBusObject } from '.';
import { GlucoseIDs, GlucosePropertyKeys, Keys, QueryOrder } from './GBObjectTypes';

/**
 * Class for glucose-specific functions
 */
export class Glucose extends GameBusObject {
    /**
     * Function that returns all glucose activities
     * @param playerId ID of player
     * @returns All glucose activities as GlucoseModels
     */
    async getGlucoseActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<GlucoseModel[]> {
        const response = await this.activity.getAllActivitiesWithGd(
            playerId,
            [Keys.glucoseTranslationKey],
            headers,
            query
        );
        // Convert response to model
        return Glucose.convertResponseToGlucoseModels(response);
    }

    /**
     * Function that post a single model for a given player
     * @param model single glucose model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleGlucoseActivity(
        model: GlucoseModel,
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        // Convert glucose model to POST data and post it
        const data = this.toPOSTData(model, playerID);
        const response = await this.activity.postActivity(data, headers, query);
        return response;
    }

    /**
     * Function that post a single model for a given player
     * @param model glucose models to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postMultipleGlucoseActivities(
        models: GlucoseModel[],
        playerID: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data: IDActivityPOSTData[] = [];
        // For each glucose model, convert it to POST data
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item, playerID));
        });
        // Post the glucose model data
        const response = await this.activity.postActivities(data, headers, query);
        // Return glucose response
        return response;
    }

    /**
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: GlucoseModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: Keys.glucoseTranslationKey,
            dataProviderName: this.activity.dataProviderName,
            image: '',
            date: model.timestamp, // glucose timestamp
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in GlucosePropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({
                    propertyTK: `${GlucosePropertyKeys[key]}`,
                    value: model[key]
                });
            }
        }
        // Return as glucose post data
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     */
    public toIDPOSTData(model: GlucoseModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: Keys.glucoseGameDescriptorID, // Glucose game descriptor
            dataProvider: this.activity.dataProviderID,
            image: '',
            date: model.timestamp, // Glucose timestamp
            propertyInstances: [] as IDPropertyInstancePOST[],
            players: [playerID]
        };
        for (const key in GlucoseIDs) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({ property: GlucoseIDs[key], value: model[key] });
            }
        }
        return obj;
    }

    /**
     * Function that returns all glucose activities between given dates (as unix)
     * @param playerId ID of player
     * @param startDate Starting date (including, unix)
     * @param endDate Ending date (excluding, unix)
     * @param order (Optional) ascending (+) or descending (-)
     * @param limit (Optional) amount of activities to retrieve, if not specified it retrieves all of them
     * @param page (Optional) page number of activities to retrieve, only useful when limit is specified
     * @returns All glucose actvties between given dates as GlucoseModels
     */
    async getGlucoseActivitiesBetweenUnix(
        playerId: number,
        startDate: number,
        endDate: number,
        order?: QueryOrder,
        limit?: number,
        page?: number, // Page number for glucose data in case of pagination
        headers?: Headers,
        query?: Query
    ): Promise<GlucoseModel[]> {
        const response = await this.activity.getAllActivitiesBetweenUnixWithGd(
            playerId,
            startDate,
            endDate,
            [Keys.glucoseTranslationKey],
            order,
            limit,
            page, // Code duplication prevention 144
            headers,
            query
        );
        // Convert response between unix dates to model
        return Glucose.convertResponseToGlucoseModels(response);
    }

    /**
     * Converts a response of ActivityGETData to a GlucoseModel
     * @param response single ActivityGETData to convert
     * @returns GlucoseModel with correct properties filled in
     */
    private static convertGlucoseResponseToModel(response: ActivityGETData): GlucoseModel {
        // Get ActivityModels from response
        const activities = Activity.getActivityInfoFromActivity(response);
        // We already know the date, glucose level will be 0 for now
        const glucose: GlucoseModel = {
            timestamp: response.date,
            glucoseLevel: 0,
            activityId: response.id
        };
        // The GameBus game descriptor has 2 fields that are relevant, eAG_MMOLL and eAG_MGDL
        // We can use the eAG_MMOLL directly but can also convert the eAG_MGDL field to MMOL/L
        activities.forEach((activity: ActivityModel) => {
            // Check for 2 properties
            for (const key in GlucosePropertyKeys) {
                // If we have one of the 2 properties
                if (GlucosePropertyKeys[key] === activity.property.translationKey) {
                    switch (GlucosePropertyKeys[key]) {
                        case GlucosePropertyKeys.glucoseLevel:
                            // Already in MMOL/L so just use that
                            if (typeof activity.value !== 'string') {
                                glucose.glucoseLevel = activity.value;
                            }

                            break;
                        case GlucosePropertyKeys.glucoseLevelMgdl:
                            // First convert to MMOL/L and then use it
                            if (typeof activity.value !== 'string') {
                                glucose.glucoseLevel = convertMG_DLtoMMOL_L(activity.value);
                            }
                            break;
                    }
                }
            }
        });
        return glucose;
    }

    /**
     * Converts an entire response to GlucoseModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of GlucoseModels
     */
    static convertResponseToGlucoseModels(response: ActivityGETData[] | undefined): GlucoseModel[] {
        if (!response) {
            return [];
        }
        return (
            response
                // Get all relevant glucose properties
                .filter((response: ActivityGETData) => {
                    return response.propertyInstances.length > 0;
                })
                .map((response: ActivityGETData) => {
                    return this.convertGlucoseResponseToModel(response);
                })
        );
    }
}
