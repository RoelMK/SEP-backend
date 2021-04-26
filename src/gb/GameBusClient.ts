import axios, { AxiosInstance } from 'axios';
import { Activity } from './objects/activity';
const endpoint = 'https://www.endpoint.com/'; // TODO: add GameBus endpoint

export class GameBusClient {
    // Axios client
    private readonly client: AxiosInstance;

    gamebusActivity: Activity;

    // Create Axios instance, can add options if needed
    constructor() {
        this.client = axios.create();

        // Create necessary classes
        this.gamebusActivity = new Activity(this, true);
    }

    activity() {
        return this.gamebusActivity;
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
        // Authentication can be added at a later stage (possibly via OAuth)
        if (authRequired) {
            // TODO: add authentication
        }

        // Request headers are created, Content-Type and User-Agent are set by default
        let requestHeaders: Headers = this.createHeader(authRequired, headers);

        // URL is created based on endpoint and path
        let url: string = this.createURL(path, query);

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

    createHeader(authRequired?: boolean, extraHeaders?: Headers): Headers {
        // Set Content-Type and User-Agent by default
        let headers: Headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Diabetter Client',
            ...extraHeaders
        };

        if (authRequired) {
            // TODO: add authentication to header if needed
        }

        // Return new headers
        return headers;
    }

    createURL(path: string, query?: Query): string {
        let url: string;

        // Add query to URL
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
