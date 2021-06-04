/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityGETData, ActivityPOSTData } from '../models/gamebusModel';
import { GlucoseModel } from '../models/glucoseModel';
import { GameBusObject } from './base';

/**
 * Class for glucose-specific functions
 */
export class Glucose extends GameBusObject {
    private glucoseId = 0; // TODO: assign to GameBus-given activity ID
    private glucoseGameDescriptor = "BLOOD_GLUCOSE_MSMT";

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All glucose activities (provided ID is correct)
     */
    async getAllGlucoseActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        //const glucose = await this.activity.getAllActivitiesWithId(this.glucoseId, headers, query);
        return undefined as unknown as ActivityGETData[];
    }

    async postSingleInsulinActivity(model: GlucoseModel, playerID: number, headers?: Headers, query?:Query) {
        let data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    private toPOSTData(model: GlucoseModel, playerID: number) : ActivityPOSTData{
        return {
            gameDescriptorTK: this.glucoseGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: "", //TODO add image?
            date: model.timestamp,
            propertyInstances: [{
                propertyTK : "eAG_MMOLL",
                value : model.glucoseLevel
            }],
            players: [playerID]
        };
    }
}
