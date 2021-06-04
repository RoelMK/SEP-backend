/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityGETData, ActivityPOSTData, PropertyInstancePOST } from '../models/gamebusModel';
import { InsulinModel } from '../models/insulinModel';
import { GameBusObject } from './base';

/**
 * Class for insulin-specific functions
 */
export class Insulin extends GameBusObject {
    public insulinGameDescriptor = "LOG_INSULIN";
    private insulinId = 0; // TODO: assign to GameBus-given activity ID

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All insulin activities (provided ID is correct)
     */
    async getAllInsulinActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        //const insulin = await this.activity.getAllActivitiesWithId(this.insulinId, headers, query);
        return undefined as unknown as ActivityGETData[];
    }

    async postSingleInsulinActivity(model: InsulinModel, playerID: number, headers?: Headers, query?:Query) {
        let data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    public toPOSTData(model: InsulinModel, playerID: number) : ActivityPOSTData{
        let obj = {
            gameDescriptorTK: this.insulinGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: "", //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        }
        for (const key in InsulinPropertyKeys) {
            if (model[key] !== undefined) {
                if(key === 'insulinType') {
                    obj.propertyInstances.push({propertyTK : `${InsulinPropertyKeys[key]}`, value : model[key] ? "long" : "rapid"})
                } else {
                    obj.propertyInstances.push({propertyTK : `${InsulinPropertyKeys[key]}`, value : model[key]})
                }
                
            }
        }
        
        return obj;
    }
}

export enum InsulinPropertyKeys {
    insulinType = 'INSULIN_TYPE',
    insulinAmount = 'INSULIN_DOSE',
    //TODO: add this? It is in the descriptors.md 'INSULIN_SPEED' 
}