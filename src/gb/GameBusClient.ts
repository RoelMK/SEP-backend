import axios, { AxiosInstance } from 'axios';
import { TokenHandler } from './auth/tokenHandler';
import { Activity } from './objects/activity';
const endpoint = 'https://www.endpoint.com/'; // TODO: add GameBus endpoint

export class GameBusClient {
    // Axios client
    private readonly client: AxiosInstance;

    gamebusActivity: Activity;
    tokenHandler?: TokenHandler;

    // Create Axios instance, can add options if needed
    constructor(private readonly verbose?: boolean, private readonly token?: string) {
        this.client = axios.create();

        // Create necessary classes
        this.gamebusActivity = new Activity(this, true);

        // If a token is provided, authenticate using the token
        if (token) {
            this.login(token);
        }
    }

    activity() {
        return this.gamebusActivity;
    }

    /**
     * Creates a token handler for the given token
     * @param token (Valid) API token
     */
    login(token: string) {
        // Authenticate via token handler
        this.tokenHandler = new TokenHandler(this, token);
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
        body?: any,
        headers?: Headers,
        query?: Query,
        authRequired?: boolean,
        fullResponse?: boolean
    ) {
        return this.request(path, requestMethod.PUT, body, headers, query, authRequired, fullResponse);
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
    ) {
        return this.request(path, requestMethod.POST, body, headers, query, authRequired, fullResponse);
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
    async get(path: string, headers?: Headers, query?: Query, authRequired?: boolean, fullResponse?: boolean) {
        return this.request(path, requestMethod.GET, undefined, headers, query, authRequired, fullResponse);
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
        method: requestMethod,
        body?: any,
        headers?: Headers,
        query?: Query,
        authRequired?: boolean,
        fullResponse?: boolean
    ) {
        // Current authentication is done via a pre-defined token
        // TODO: improve
        if (authRequired) {
            if (!this.tokenHandler) {
                throw new Error(`You must be authorized to access this path: ${endpoint + path}`);
            } else {
                // If the token handler does not have a token (yet), wait for it to be ready
                await this.tokenHandler.Ready;
            }
        }

        // Request headers are created, Content-Type and User-Agent are set by default
        let requestHeaders: Headers = this.createHeader(authRequired, headers);

        // URL is created based on endpoint and path
        let url: string = this.createURL(path, query);

        // Print request information if verbose is true
        if (this.verbose) {
            console.log(url);
            console.log(method);
            console.log(requestHeaders);
            void (body && console.log(body));
        }

        // Make request with method, url, headers and body
        let response = await this.client.request({
            method: method,
            url: url,
            headers: requestHeaders,
            data: body
        });

        // If error, throw error
        if (!response.statusText) {
            const text = response.data;

            throw new Error(`${response.statusText}: ${text}`);
        }

        // If full response is needed, return it
        if (fullResponse) {
            return response;
        }

        // Return response data
        return response.data;
    }

    /**
     * Creates the request headers based on provided headers
     * @param authRequired Whether authorization is required for the method
     * @param extraHeaders Any extra headers requested by the user
     * @returns All headers combined
     */
    createHeader(authRequired?: boolean, extraHeaders?: Headers): Headers {
        // Set Content-Type and User-Agent by default
        let headers: Headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Diabetter Client',
            ...extraHeaders
        };

        // Add authentication token to Authorization header if provided (and needed)
        if (authRequired && this.tokenHandler) {
            headers['Authorization'] = `Bearer ${this.tokenHandler.getToken()}`;
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
export enum requestMethod {
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
