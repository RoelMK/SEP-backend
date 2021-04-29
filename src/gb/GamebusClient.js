"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.requestMethod = exports.GameBusClient = void 0;
var axios_1 = require("axios");
var tokenHandler_1 = require("./auth/tokenHandler");
var activity_1 = require("./objects/activity");
var endpoint = 'https://api3.gamebus.eu'; //'https://www.endpoint.com/'; // TODO: add GameBus endpoint
var GameBusClient = /** @class */ (function () {
    // Create Axios instance, can add options if needed
    function GameBusClient(verbose, token) {
        this.verbose = verbose;
        this.token = token;
        this.client = axios_1["default"].create();
        // Create necessary classes
        this.gamebusActivity = new activity_1.Activity(this, true);
        // If a token is provided, authenticate using the token
        if (token) {
            this.login(token);
        }
    }
    GameBusClient.prototype.activity = function () {
        return this.gamebusActivity;
    };
    /**
     * Creates a token handler for the given token
     * @param token (Valid) API token
     */
    GameBusClient.prototype.login = function (token) {
        // Authenticate via token handler
        this.tokenHandler = new tokenHandler_1.TokenHandler(this, token);
    };
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
    GameBusClient.prototype.put = function (path, body, headers, query, authRequired, fullResponse) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(path, requestMethod.PUT, body, headers, query, authRequired, fullResponse)];
            });
        });
    };
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
    GameBusClient.prototype.post = function (path, body, headers, query, authRequired, fullResponse) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(path, requestMethod.POST, body, headers, query, authRequired, fullResponse)];
            });
        });
    };
    /**
     * GET request
     * @param path Endpoint URL (without base in {endpoint})
     * @param headers Extra headers
     * @param query Any query options
     * @param authRequired Whether authentication is required for the request
     * @param fullResponse Returns response + headers instead of just data
     * @returns Response
     */
    GameBusClient.prototype.get = function (path, headers, query, authRequired, fullResponse) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(path, requestMethod.GET, undefined, headers, query, authRequired, fullResponse)];
            });
        });
    };
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
    GameBusClient.prototype.request = function (path, method, body, headers, query, authRequired, fullResponse) {
        return __awaiter(this, void 0, void 0, function () {
            var requestHeaders, url, response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!authRequired) return [3 /*break*/, 3];
                        if (!!this.tokenHandler) return [3 /*break*/, 1];
                        throw new Error("You must be authorized to access this path: " + (endpoint + path));
                    case 1: 
                    // If the token handler does not have a token (yet), wait for it to be ready
                    return [4 /*yield*/, this.tokenHandler.Ready];
                    case 2:
                        // If the token handler does not have a token (yet), wait for it to be ready
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        requestHeaders = this.createHeader(authRequired, headers);
                        url = this.createURL(path, query);
                        // Print request information if verbose is true
                        if (this.verbose) {
                            console.log(url);
                            console.log(method);
                            console.log(requestHeaders);
                            void (body && console.log(body));
                        }
                        return [4 /*yield*/, this.client.request({
                                method: method,
                                url: url,
                                headers: requestHeaders,
                                data: body
                            })];
                    case 4:
                        response = _a.sent();
                        // If error, throw error
                        if (!response.statusText) {
                            text = response.data;
                            throw new Error(response.statusText + ": " + text);
                        }
                        // If full response is needed, return it
                        if (fullResponse) {
                            return [2 /*return*/, response];
                        }
                        // Return response data
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Creates the request headers based on provided headers
     * @param authRequired Whether authorization is required for the method
     * @param extraHeaders Any extra headers requested by the user
     * @returns All headers combined
     */
    GameBusClient.prototype.createHeader = function (authRequired, extraHeaders) {
        // Set Content-Type and User-Agent by default
        var headers = __assign({ 'Content-Type': 'application/json', 'User-Agent': 'Diabetter Client' }, extraHeaders);
        // Add authentication token to Authorization header if provided (and needed)
        if (authRequired && this.tokenHandler) {
            headers['Authorization'] = "Bearer " + this.tokenHandler.getToken();
        }
        else if (authRequired && !this.tokenHandler) {
            throw new Error('You must be authenticated to use this function');
        }
        // Return new headers
        return headers;
    };
    /**
     * Creates the request URL based on provided path and queries
     * @param path Endpoint path (without base in {endpoint})
     * @param query Any query
     * @returns Complete request URL
     */
    GameBusClient.prototype.createURL = function (path, query) {
        var url;
        // Add query to URL and combine path with endpoint
        if (query) {
            var params = new URLSearchParams(query);
            url = endpoint + path + '?' + params;
        }
        else {
            url = endpoint + path;
        }
        return url;
    };
    return GameBusClient;
}());
exports.GameBusClient = GameBusClient;
/**
 * Simple enum for different request methods
 */
var requestMethod;
(function (requestMethod) {
    requestMethod["GET"] = "GET";
    requestMethod["POST"] = "POST";
    requestMethod["PUT"] = "PUT";
})(requestMethod = exports.requestMethod || (exports.requestMethod = {}));
