// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError, AxiosInstance } from 'axios';
import { TokenHandler } from './auth/tokenHandler';
import { Activity } from './objects/activity';
import { Exercise } from './objects/exercise';
import { Food } from './objects/food';
import { Glucose } from './objects/glucose';
import { Insulin } from './objects/insulin';
import { Mood } from './objects/mood';
import FormData from 'form-data';
const endpoint = 'https://api3.gamebus.eu/v2/';

export class GameBusClient {
    // Axios client
    readonly client: AxiosInstance;

    private gamebusActivity: Activity;
    private gamebusExercise: Exercise;
    private gamebusFood: Food;
    private gamebusGlucose: Glucose;
    private gamebusInsulin: Insulin;
    private gamebusMood: Mood;

    // Create Axios instance, can add options if needed
    constructor(private readonly tokenHandler?: TokenHandler, private readonly verbose?: boolean) {
        this.client = axios.create();

        // Create necessary classes
        this.gamebusActivity = new Activity(this, true);
        this.gamebusExercise = new Exercise(this.gamebusActivity, true);
        this.gamebusFood = new Food(this.gamebusActivity, true);
        this.gamebusGlucose = new Glucose(this.gamebusActivity, true);
        this.gamebusInsulin = new Insulin(this.gamebusActivity, true);
        this.gamebusMood = new Mood(this.gamebusActivity, true);
    }

    // TODO: should probably be removed at some point, since other objects are preferred (and use Activity anyway)
    activity(): Activity {
        return this.gamebusActivity;
    }

    exercise(): Exercise {
        return this.gamebusExercise;
    }

    food(): Food {
        return this.gamebusFood;
    }

    glucose(): Glucose {
        return this.gamebusGlucose;
    }

    insulin(): Insulin {
        return this.gamebusInsulin;
    }

    mood(): Mood {
        return this.gamebusMood;
    }

    /**
     * PUT request
     * @param path Endpoint URL (without base in {endpoint})
     * @param body Body of PUT
     * @param headers Extra headers
     * @param query Any query options
     * @param authRequired Whether authentication is required for the request
     * @param fullResponse Returns response + headers instead of just data
     * @returns Reponse
     */
    async put(
        path: string,
        body?: FormData,
        headers?: Headers,
        query?: Query,
        authRequired?: boolean,
        fullResponse?: boolean
    ): Promise<any> {
        return this.request(
            path,
            RequestMethod.PUT,
            body,
            headers,
            query,
            authRequired,
            fullResponse
        );
    }

    /**
     * POST request
     * @param path Endpoint URL (without base in {endpoint})
     * @param body Body of POST
     * @param headers Extra headers
     * @param query Any query options
     * @param authRequired Whether authentication is required for the request
     * @param fullResponse Returns response + headers instead of just data
     * @returns Response
     */
    async post(
        path: string,
        body: any,
        headers?: Headers,
        query?: Query,
        authRequired?: boolean,
        fullResponse?: boolean
    ): Promise<any> {
        return this.request(
            path,
            RequestMethod.POST,
            body,
            headers,
            query,
            authRequired,
            fullResponse
        );
    }

    /**
     * GET request
     * @param path Endpoint URL (without base in {endpoint})
     * @param headers Extra headers
     * @param query Any query options
     * @param authRequired Whether authentication is required for the request
     * @param fullResponse Returns response + headers instead of just data
     * @returns Response
     */
    async get(
        path: string,
        headers?: Headers,
        query?: Query,
        authRequired?: boolean,
        fullResponse?: boolean
    ): Promise<any> {
        return this.request(
            path,
            RequestMethod.GET,
            undefined,
            headers,
            query,
            authRequired,
            fullResponse
        );
    }

    /**
     * Generic request method
     * @param path Endpoint URL (without base in {endpoint})
     * @param method Request method (GET, POST, PUT, DELETE)
     * @param body Body in case of POST and PUT
     * @param headers Any extra headers (Content-Type and User-Agent are already included)
     * @param query Query in case of GET
     * @param authRequired Whether authentication is required for the method
     * @param fullResponse Returns response + headers instead of just data
     * @returns Response
     */
    async request(
        path: string,
        method: RequestMethod,
        body?: FormData | unknown,
        headers?: Headers,
        query?: Query,
        authRequired?: boolean,
        fullResponse?: boolean
    ): Promise<any> {
        // Current authentication is done via a pre-defined token
        if (authRequired) {
            // We have to check both if the handler exists and if there's at least something there as a token
            if (!this.tokenHandler || !this.tokenHandler.getToken().accessToken) {
                throw new Error(`You must be authorized to access this path: ${endpoint + path}`);
            }
        }

        // Request headers are created, Content-Type and User-Agent are set by default
        const requestHeaders: Headers = this.createHeader(authRequired, headers);

        // URL is created based on endpoint and path
        const url: string = this.createURL(path, query);

        // Print request information if verbose is true
        if (this.verbose) {
            console.log(url);
            console.log(method);
            console.log(requestHeaders);
            void (body && console.log(body));
        }

        try {
            // Make request with method, url, headers and body
            //const t1 = new Date().getTime();
            const response = await this.client.request({
                method: method,
                url: url,
                headers: requestHeaders,
                data: body
            });
            //console.log(url + ' took ms: ' + (new Date().getTime() - t1));
            // If full response is needed, return it
            if (fullResponse) {
                return response;
            }

            // Return response data
            return response.data;
        } catch (err: unknown | AxiosError) {
            if (axios.isAxiosError(err)) {
                // If the error is from Axios, throw it (as AxiosError)
                throw err as AxiosError;
            } else {
                // If not, show it
                console.error(err);
            }
        }
    }

    /**
     * Creates the request headers based on provided headers
     * @param authRequired Whether authorization is required for the method
     * @param extraHeaders Any extra headers requested by the user
     * @returns All headers combined
     */
    createHeader(authRequired?: boolean, extraHeaders?: Headers): Headers {
        // Set Content-Type and User-Agent by default
        const headers: Headers = {
            'content-type': 'application/json',
            'User-Agent': 'Diabetter Client',
            Accept: 'application/json',
            ...extraHeaders
        };

        // Add authentication token to Authorization header if provided (and needed)
        if (authRequired && this.tokenHandler) {
            const token = this.tokenHandler.getToken();
            // TODO: should we handle this differently?
            //this.playerId = token.playerId;
            // Only add the access token part of the token
            headers['Authorization'] = `Bearer ${token.accessToken}`;
        } else if (authRequired && !this.tokenHandler) {
            throw new Error('You must be authenticated to use this function');
        }

        // Return new headers
        return headers;
    }

    /**
     * Creates the request URL based on provided path and queries
     * @param path Endpoint path (without base in {endpoint})
     * @param query Any query
     * @returns Complete request URL
     */
    createURL(path: string, query?: Query): string {
        let url: string;

        // Add query to URL and combine path with endpoint
        if (query) {
            const params = new URLSearchParams(query);
            url = endpoint + path + '?' + params;
        } else {
            url = endpoint + path;
        }

        return url;
    }
}

/**
 * Simple enum for different request methods
 */
export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT'
}

/**
 * Query interface that is converted to {@URLSearchParams}
 */
export interface Query {
    [key: string]: string;
}

/**
 * Headers interface
 */
export interface Headers {
    [key: string]: string;
}

// Date format that is to be used in GameBus queries
export const queryDateFormat = 'dd-MM-yyyy';
