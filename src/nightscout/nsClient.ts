import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NightScoutEntry } from '../services/dataParsers/nightscoutParser';
import crypto from "crypto";
import { GlucoseUnit } from '../gb/models/glucoseModel';

export class NightScoutClient {
    // Axios client
    private readonly client: AxiosInstance;

    constructor(private secret: string, private nightScoutHost: string, private token?: string) {
        this.client = axios.create();
    }


    /**
     * Posts a night scout entry to the nightscout instance
     * @param entry NightScoutEntry: a nightscout entry
     * @returns the query response
     */
    async postEntry(entry: NightScoutEntry) {
        const requestHeaders = {
            "API-SECRET": crypto.createHash("sha1").update(this.secret).digest("hex")
        };
        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.nightScoutHost}/api/v1/entries?token=${this.token}`,
                headers: requestHeaders,
                data: entry
            };
            const response = await this.client.request(config);
            console.log(response);
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
        const requestHeaders = {
            "API-SECRET": crypto.createHash("sha1").update(this.secret).digest("hex")
        };
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/entries/sgv.json`,
                headers: requestHeaders,
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
        const requestHeaders = {
            "API-SECRET": crypto.createHash("sha1").update(this.secret).digest("hex")
        };
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/treatments/`,
                headers: requestHeaders,
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
        const requestHeaders = {
            "API-SECRET": crypto.createHash("sha1").update(this.secret).digest("hex")
        };
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/profile`,
                headers: requestHeaders,
                data: {}
            };
            const response = await this.client.request(config);
            return GlucoseUnit.MMOL_L;
        } catch (error) {
            console.log(error);
            return GlucoseUnit.MMOL_L;
        }
        
    }
}
