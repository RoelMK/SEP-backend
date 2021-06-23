import {
    ActivityGETData,
    ActivityPOSTData,
    PropertyInstancePOST,
    BMIModel,
    ActivityModel,
    Query,
    Headers
} from '../models';
import { Activity, GameBusObject, Keys } from '.';

export class BMI extends GameBusObject {
    /**
     * Function that returns all BMI activities (date descending)
     * @param playerId ID of player
     * @returns All BMI activities as BMIModels
     */
    async getBMIActivities(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<BMIModel[]> {
        const response = await this.activity.getAllActivitiesWithGd(
            playerId,
            [Keys.bmiTranslationKey],
            headers,
            {
                sort: '-date',
                ...query
            }
        );
        return BMI.convertResponseToBMIModels(response);
    }

    // We don't really care about BMI activities between dates, only the latest one is relevant

    /**
     * Get the latest (most recent) BMI activity as model
     * @param playerId ID of player
     * @returns Most recent BMI activity
     */
    async getLatestBMIActivity(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<BMIModel> {
        const response = await this.getBMIActivities(playerId, headers, query);
        if (response.length === 0) {
            return {
                timestamp: -1,
                activityId: -1,
                weight: null,
                length: null,
                age: null
            } as BMIModel;
        }
        return response[0];
    }

    /**
     * Function that posts a single model for a given player
     * @param model Model to be POSTed
     * @param playerId ID of player
     */
    async postSingleBMIActivity(
        model: BMIModel,
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const data = this.toPOSTData(model, playerId);
        const response = await this.activity.postActivity(data, headers, query);
        return response;
    }

    /**
     * Function that created POSTData from a model and playerID
     * Since we'll only be POSTing single models, we don't need to post with IDs
     */
    public toPOSTData(model: BMIModel, playerId: number): ActivityPOSTData {
        const obj = {
            gameDescriptorTK: Keys.bmiTranslationKey,
            dataProviderName: this.activity.dataProviderName,
            image: '',
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerId]
        };
        for (const key in BMIPropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({
                    propertyTK: `${BMIPropertyKeys[key]}`,
                    value: model[key]
                });
            }
        }
        return obj;
    }

    /**
     * Converts a single response of ActivityGETData to a BMIModel
     * @param response single ActivityGETData to convert
     * @returns BMIModel with correct properties filled in
     */
    private static convertBMIResponseToModel(response: ActivityGETData): BMIModel {
        // Get response as list of ActivityModels
        const activities = Activity.getActivityInfoFromActivity(response);
        // Default model has timestamp and activityId, rest is null
        const bmi: BMIModel = {
            timestamp: response.date,
            activityId: response.id,
            weight: null,
            length: null,
            age: null,
            gender: null,
            waistCircumference: null,
            bmi: null
        };
        // Map translation key to right property in final model
        activities.forEach((activity: ActivityModel) => {
            for (const key in BMIPropertyKeys) {
                if (BMIPropertyKeys[key] === activity.property.translationKey) {
                    bmi[key] = activity.value;
                }
            }
        });
        return bmi;
    }

    /**
     * Converts an entire response to BMIModels
     * @param response Array of ActivityGETData (response)
     * @returns Array of BMIModels
     */
    static convertResponseToBMIModels(response: ActivityGETData[] | undefined): BMIModel[] {
        if (!response) {
            return [];
        }
        return response
            .filter((response: ActivityGETData) => {
                return response.propertyInstances.length > 0;
            })
            .map((response: ActivityGETData) => {
                return this.convertBMIResponseToModel(response);
            });
    }
}

export enum BMIPropertyKeys {
    weight = 'WEIGHT',
    length = 'LENGTH',
    age = 'AGE',
    gender = 'GENDER',
    waistCircumference = 'WAIST_CIRCUMFERENCE',
    bmi = 'BODY_MASS_INDEX'
}
