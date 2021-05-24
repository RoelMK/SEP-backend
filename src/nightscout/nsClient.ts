import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NightScoutEntry } from '../services/dataParsers/nightscoutParser';
import crypto from "crypto";
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
     * @returns the query response
     */
    async postEntry(entry: NightScoutEntry) {

        // probably not needed
        // const requestHeaders = {
        //     "API-SECRET": crypto.createHash("sha1").update(this.secret).digest("hex")
        // };
        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.nightScoutHost}/api/v1/entries?token=${this.token}`,
                data: entry
            };
            const response = await this.client.request(config);
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
    async getEntries(): Promise<NightScoutEntry[]> {

        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/entries/sgv.json`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data as NightScoutEntry[];
        } catch (error) {
            console.log(error);
            throw new Error("Server request failed"); //TODO make clear
        }
    }

    /**
     * Get treatments (containing food and/or insulin data) from the nightscout API
     */
    async getTreatments() {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/treatments?token=${this.token}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    async getGlucoseUnit(): Promise<GlucoseUnit> {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/profile?token=${this.token}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data[0].units == "mg/dl" ? GlucoseUnit.MG_DL : GlucoseUnit.MG_DL; //TODO why 2 profiles
        } catch (error) {
            console.log(error);
            return GlucoseUnit.MMOL_L;
        }
        
    }
}
