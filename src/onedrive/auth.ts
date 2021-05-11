import * as msal from "@azure/msal-node";


// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
const config: msal.Configuration = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID as string,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: process.env.AZURE_CLIENT_SECRET as string  
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};
const cca = new msal.ConfidentialClientApplication(config);
const redirectUri = "http://localhost:8080/onedrive/redirect";      // TODO: this should not be hardcoded here...

/**
 * Gets a url where the user can login with his OneDrive-account.
 * @returns A url or undefined if an error occurred
 */
export async function getAuthorizationUrl(): Promise<string | undefined> {
    try {
        return await cca.getAuthCodeUrl({
            scopes: ['user.read', "Files.Read"],
            redirectUri: redirectUri,
        });
    } catch (e) {
        console.log(JSON.stringify(e));
        return undefined;
    }
}

/**
 * Gets an access token for an authorization code.
 * @param authorizationCode Authorization code
 * @returns Access token or undefined if an error occurred
 */
export async function getAccessToken(authorizationCode: string): Promise<string | undefined> {
    const tokenRequest = {
        code: authorizationCode,
        scopes: ["user.read", "Files.Read"],
        redirectUri: redirectUri,
    };

    try {
        let response = await cca.acquireTokenByCode(tokenRequest);
        if (response) {
            return response.accessToken;
        } else {
            return undefined;
        }
    } catch (e) {
        console.log(JSON.stringify(e));
        return undefined;
    }
}
