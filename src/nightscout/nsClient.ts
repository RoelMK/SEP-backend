import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GlucoseUnit } from '../gb/models/glucoseModel';
import {
    NightScoutEntryModel,
    NightScoutTreatmentModel
} from '../services/dataParsers/dataParserTypes';

export class NightScoutClient {
    // Axios client
    private readonly client: AxiosInstance;

    // maximum amount of nightscout instances returned per request
    private readonly MAX_NIGHTSCOUT = 10000;

    constructor(private nightScoutHost: string, private token?: string) {
        this.client = axios.create();
    }

    /**
     * Posts a night scout entry to the nightscout instance
     * @param entry NightScoutEntry: a nightscout entry
     */
    async postEntry(entry: NightScoutEntryModel): Promise<void> {
        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.nightScoutHost}/api/v1/entries?token=${this.token}`,
                data: entry
            };
            await this.client.request(config); //const response =
        } catch (error) {
            console.log(error);
            switch (error.response.data.status) {
                case 401:
                    throw new Error(
                        'Not authenticated to post entries! Check if the provided Nightscout token is correct.'
                    );
                case 405:
                    throw new Error('Invalid entry input!');

                default:
                    throw new Error('Posting entries has failed.');
            }
        }
    }

    /**
     * Posts a night scout treatment to the nightscout instance
     * @param entry NightScoutTreatment: a nightscout treatment
     */
    async postTreatment(treatment: NightScoutTreatmentModel): Promise<void> {
        try {
            const config: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.nightScoutHost}/api/v1/treatments?token=${this.token}`,
                data: treatment
            };
            await this.client.request(config); //const response =
        } catch (error) {
            console.log(error);
            switch (error.response.data.status) {
                case 401:
                    throw new Error(
                        'Not authenticated to post treatments! Check if the provided token is correct.'
                    );
                case 405:
                    throw new Error('Invalid treatment input!');

                default:
                    throw new Error('Posting treatments has failed.');
            }
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
                url: `${this.nightScoutHost}/api/v1/entries/sgv.json?find[date][$gte]=0&count=${this.MAX_NIGHTSCOUT}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data as NightScoutEntryModel[];
        } catch (error) {
            console.log(error);
            return []; // return empty data array
            // Code duplication prevention 92
        }
    }

    /**
     * Get treatments (containing food and/or insulin data) from the nightscout API
     */
    async getTreatments(): Promise<NightScoutTreatmentModel[]> {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/treatments?find[created_at][$gte]=1970-01-01&count=${this.MAX_NIGHTSCOUT}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data as NightScoutTreatmentModel[];
        } catch (error) {
            console.log(error);
            return []; // return empty data array
            // Code duplication prevention 110
        }
    }

    /**
     * Retrieve the measurement unit for glucose entries on the Nightscout host
     * @returns GlucoseUnit that is set up for the Nightscout system
     */
    async getGlucoseUnit(): Promise<GlucoseUnit> {
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${this.nightScoutHost}/api/v1/status?token=${this.token}`,
                data: {}
            };
            const response = await this.client.request(config);
            return response.data.settings.units == 'mg/dl' ? GlucoseUnit.MG_DL : GlucoseUnit.MMOL_L;
        } catch (error) {
            throw new Error('Could not read glucose unit from the Nightscout website!');
        }
    }

    /**
     * Helper function to retrieve nightscout host
     * @returns the website URL of the nightscout instance
     */
    getNightscoutHost(): string {
        return this.nightScoutHost;
    }

    /**
     * Helper function to retrieve the maximum amount of entries or treatments
     * @returns the maximum amount of entries or treatments that are retrieved
     */
    getMaxRetrieved(): number {
        return this.MAX_NIGHTSCOUT;
    }
}
