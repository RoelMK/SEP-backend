import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NightScoutEntryModel, NightScoutTreatmentModel } from '../services/dataParsers/nightscoutParser';
import { GlucoseUnit } from '../gb/models/glucoseModel';

export class NightScoutClient {
    // Axios client
    private readonly client: AxiosInstance;

    constructor(private nightScoutHost: string, private token?: string) {
        this.client = axios.create();
    }

    /**
     * Posts a night scout entry to the nightscout instance
     * @param entry NightScoutEntry: a nightscout entry
     */
    async postEntry(entry: NightScoutEntryModel) {
        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.nightScoutHost}/api/v1/entries?token=${this.token}`,
                data: entry
            };
            await this.client.request(config); //const response = 
            
        } catch (error) {
            console.log(error);
            throw new Error("Server request failed"); //TODO make clear
        }
    }


    /**
     * Posts a night scout treatment to the nightscout instance
     * @param entry NightScoutTreatment: a nightscout treatment
     */
     async postTreatment(entry: NightScoutTreatmentModel) {
        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.nightScoutHost}/api/v1/treatments?token=${this.token}`,
                data: entry
            };
            await this.client.request(config); //const response = 
            
        } catch (error) {
            console.log(error);
            throw new Error("Server request failed"); //TODO make clear
        }
    }

    /**
     * Get glucose entries via the nightscout API
     * @returns resulting NightScoutEntry objects in an array 
     * @throws error, when request failed
     */
    async getEntries(): Promise<NightScoutEntryModel[]> {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/entries/sgv.json`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data as NightScoutEntryModel[];
        } catch (error) {
            console.log(error);
            throw new Error("Server request for nightscout entries failed: " + error);
        }
    }

    /**
     * Get treatments (containing food and/or insulin data) from the nightscout API
     */
    async getTreatments(): Promise<NightScoutTreatmentModel[]> {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/treatments?token=${this.token}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data as NightScoutTreatmentModel[];
        } catch (error) {3
            console.log(error);
            throw new Error("Server request for nightscout treatments failed: " + error);
        }
    }
    
    async getGlucoseUnit(): Promise<GlucoseUnit> {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/status?token=${this.token}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data.settings.units == "mg/dl" ? GlucoseUnit.MG_DL : GlucoseUnit.MMOL_L;
        } catch (error) {
            console.log(error);
            return GlucoseUnit.MMOL_L;
        }
    }
}
