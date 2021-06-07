import * as msal from '@azure/msal-node';
import path from 'path';
import { OneDriveTokenModel } from './models/onedriveTokenModel';
import fs from 'fs';

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-node-samples/silent-flow/index.js
// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

// Cache
const baseDirectoryPath = path.resolve('./');
const cacheDirectoryPath = path.join(baseDirectoryPath, '/data');
const cacheFilePath = path.join(cacheDirectoryPath, 'msalCache.json');
if (!fs.existsSync(cacheDirectoryPath)) {
    fs.mkdirSync(cacheDirectoryPath);
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cachePlugin = require('./cachePlugin')(cacheFilePath);

// MSAL config
const config: msal.Configuration = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID as string,
        authority: 'https://login.microsoftonline.com/common',
        clientSecret: process.env.AZURE_CLIENT_SECRET as string
    },
    system: {
        loggerOptions: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Info
        }
    },
    cache: {
        cachePlugin
    }
};
const cca = new msal.ConfidentialClientApplication(config);
const msalTokenCache = cca.getTokenCache();
const redirectUri = 'http://localhost:8080/onedrive/redirect'; // TODO: this should not be hardcoded here...
const scopes = ['user.read', 'Files.Read'];

/**
 * Gets a url where the user can login with his OneDrive-account.
 * @returns A url or undefined if an error occurred
 */
export async function getAuthorizationUrl(): Promise<string | undefined> {
    try {
        return await cca.getAuthCodeUrl({
            scopes: scopes,
            redirectUri: redirectUri
        });
    } catch (e) {
        console.log(JSON.stringify(e));
        return undefined;
    }
}

/**
 * Gets an access token for an authorization code.
 * @param authorizationCode Authorization code
 * @returns Account info containing an access token or undefined if an error occurred
 */
export async function getAccessToken(
    authorizationCode: string
): Promise<OneDriveTokenModel | undefined> {
    const tokenRequest = {
        code: authorizationCode,
        scopes: scopes,
        redirectUri: redirectUri
    };

    try {
        // Make the request
        const response = await cca.acquireTokenByCode(tokenRequest);
        if (response && response.account) {
            return {
                homeAccountId: response.account.homeAccountId,
                accessToken: response.accessToken,
                expiresOn: response.expiresOn?.getTime() ?? new Date().getTime()
            };
        } else {
            return undefined;
        }
    } catch (e) {
        console.warn(JSON.stringify(e));
        return undefined;
    }
}

/**
 * Tries to get an access token without logging in.
 * @param homeAccountId Account to get access token for
 * @returns A token or undefined if not available / an error occurred
 */
export async function getAccessTokenSilent(
    homeAccountId: string
): Promise<OneDriveTokenModel | undefined> {
    try {
        const account = await msalTokenCache.getAccountByHomeId(homeAccountId);
        if (account) {
            const silentRequest: msal.SilentFlowRequest = {
                scopes: scopes,
                account: account
            };

            // Make the request
            const response = await cca.acquireTokenSilent(silentRequest);
            if (response) {
                return {
                    homeAccountId: homeAccountId,
                    accessToken: response.accessToken,
                    expiresOn: response.expiresOn?.getTime() ?? new Date().getTime()
                };
            }
        }
        return undefined;
    } catch (e) {
        console.warn(JSON.stringify(e));
        return undefined;
    }
}
