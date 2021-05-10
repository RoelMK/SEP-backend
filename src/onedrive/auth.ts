import * as msal from "@azure/msal-node";

const config = {
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
export const pca = new msal.PublicClientApplication(config);
export const redirectUri = "http://localhost:8080/onedrive/redirect";