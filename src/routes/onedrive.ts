import { pca, redirectUri } from "../onedrive/auth";

const onedriveRouter = require('express').Router();

// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code

onedriveRouter.get('/login', (req: any, res: any) => {
    pca.getAuthCodeUrl({
        scopes: ['user.read'],
        redirectUri: redirectUri,
    }).then((authCodeUrl) => {
        res.redirect(authCodeUrl);
    }).catch((error) => console.log(JSON.stringify(error)));
});

onedriveRouter.get('/redirect', (req: any, res: any) => {
    const tokenRequest = {
        // The URL from the redirect will contain the Auth Code in the query parameters
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: redirectUri,
    };

    pca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

module.exports = onedriveRouter;
