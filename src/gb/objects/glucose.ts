import { convertMG_DLtoMMOL_L } from '../../services/utils/units';
import { Query, Headers } from '../gbClient';
import {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    IDPropertyInstancePOST,
    PropertyInstancePOST
} from '../models/gamebusModel';
import { GlucoseModel } from '../models/glucoseModel';
import { ActivityModel } from '../models/activityModel';
import { Activity, QueryOrder } from './activity';
import { GameBusObject } from './base';

/**
 * Class for glucose-specific functions
 */
export class Glucose extends GameBusObject {
    // Translation key of GameBus game descriptor for glucose data
    public glucoseTranslationKey = 'BLOOD_GLUCOSE_MSMT';
    public glucoseGameDescriptorID = 61;

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
            [this.glucoseTranslationKey],
            headers,
            query
        );
        return Glucose.convertResponseToGlucoseModels(response);
    }

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleGlucoseActivity(
        model: GlucoseModel,
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
    async postMultipleGlucoseActivities(
        models: GlucoseModel[],
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
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: GlucoseModel, playerID: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: this.glucoseTranslationKey,
            dataProviderName: this.activity.dataProviderName,
            image: '', //TODO add image?
            date: model.timestamp,
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
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     */
    public toIDPOSTData(model: GlucoseModel, playerID: number): IDActivityPOSTData {
        const obj = {
            gameDescriptor: this.glucoseGameDescriptorID,
            dataProvider: this.activity.dataProviderID,
            image: '', //TODO add image?
            date: model.timestamp,
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
        page?: number,
        headers?: Headers,
        query?: Query
    ): Promise<GlucoseModel[]> {
        const response = await this.activity.getAllActivitiesBetweenUnixWithGd(
            playerId,
            startDate,
            endDate,
            [this.glucoseTranslationKey],
            order,
            limit,
            page,
            headers,
            query
        );
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
        //console.log(activities);
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
        // TODO: this might result in models that have a glucose value of 0,
        // we should check that this does not cause issues
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
        return response.map((response: ActivityGETData) => {
            return this.convertGlucoseResponseToModel(response);
        });
    }
}

/**
 * Relevant properties to map properties of activities to the glucoseModel
 * [key in glucoseModel] = [translationKey in GameBus]
 */
export enum GlucosePropertyKeys {
    glucoseLevel = 'eAG_MMOLL', // in mmol/L
    glucoseLevelMgdl = 'eAG_MGDL' // in mg/dL (we won't use this one)
}

const GlucoseIDs = Object.freeze({
    glucoseLevel: 88
});

export { GlucoseIDs };
