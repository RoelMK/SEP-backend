/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Headers } from '../gbClient';
import { ActivityGETData, ActivityPOSTData, PropertyInstancePOST } from '../models/gamebusModel';
import { MoodModel } from '../models/moodModel';
import { GameBusObject } from './base';

/**
 * Class for glucose-specific functions
 */
export class Mood extends GameBusObject {
    public moodGameDescriptor = "LOG_MOOD";

    async postSingleMoodActivity(model: MoodModel, playerID: number, headers?: Headers, query?:Query) {
        let data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    public toPOSTData(model: MoodModel, playerID: number) : ActivityPOSTData{
        let obj = {
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
}

export enum MoodPropertyKeys {
    arousal = 'MOOD_AROUSAL',
    valence = 'MOOD_VALENCE'
}