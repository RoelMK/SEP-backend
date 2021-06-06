/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityGETData, ActivityPOSTData, IDActivityPOSTData, IDPropertyInstancePOST, PropertyInstancePOST } from '../models/gamebusModel';
import { MoodModel } from '../models/moodModel';
import { GameBusObject } from './base';

/**
 * Class for glucose-specific functions
 */
export class Mood extends GameBusObject {
    public moodGameDescriptor = "LOG_MOOD";
    public moodGameDescriptorID = 1062;

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
    async postSingleMoodActivity(model: MoodModel, playerID: number, headers?: Headers, query?:Query) {
        const data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    /**
     * Function that post a single model for a given player
     * @param model model to be POSTed
     * @param playerID playerID of player for who this is posted
     */
     async postMultipleMoodActivities(models: MoodModel[], playerID: number, headers?: Headers, query?:Query) {
        const data : IDActivityPOSTData[]= [];
        models.forEach((item) => {
            data.push(this.toIDPOSTData(item,playerID))
        })
        this.activity.postActivities(data,headers,query)
    }

    /**
     * Function that creates a POSTData from a model and playerID
     */
    public toPOSTData(model: MoodModel, playerID: number) : ActivityPOSTData{
        const obj = {
            gameDescriptorTK: this.moodGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: "", //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as PropertyInstancePOST[],
            players: [playerID]
        }
        for (const key in MoodPropertyKeys) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({propertyTK : `${MoodPropertyKeys[key]}`, value : model[key]})
            }
        }
        return obj;
    }

    /**
     * Function that creates a POSTData from a model and playerID with ID's instead of TK's
     */
     public toIDPOSTData(model: MoodModel, playerID: number) : IDActivityPOSTData{
        const obj = {
            gameDescriptor: this.moodGameDescriptorID,
            dataProvider: this.activity.dataProviderID,
            image: "", //TODO add image?
            date: model.timestamp,
            propertyInstances: [] as IDPropertyInstancePOST[],
            players: [playerID]
        }
        for (const key in MoodIDs) {
            if (model[key] !== undefined) {
                obj.propertyInstances.push({property : MoodIDs[key], value : model[key]})
            }
        }
        return obj;
    }
}

export enum MoodPropertyKeys {
    arousal = 'MOOD_AROUSAL',
    valence = 'MOOD_VALENCE'
}

let MoodIDs =  Object.freeze( {
    arousal : 1186,
    valence : 1187
})

export {MoodIDs}