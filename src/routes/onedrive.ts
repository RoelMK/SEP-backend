import { getAccessToken, getAccessTokenSilent, getAuthorizationUrl } from '../onedrive/auth';
import { OneDriveTokenModel } from '../onedrive/models/onedriveTokenModel';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const onedriveRouter = require('express').Router();

onedriveRouter.get('/login', async (req: any, res: any) => {
    // Try to login using given account id if possible
    if (req.query.homeAccountId) {
        const account = await getAccessTokenSilent(req.query.homeAccountId);
        if (account) {
            return res.redirect(generateRedirectUrl(account));
        }
    }

    // If no id is given or no credentials are in cache, start login procedure
    const authUrl = await getAuthorizationUrl();
    if (authUrl) {
        return res.redirect(authUrl);
    } else {
        return res.status(403).send();
    }
});

onedriveRouter.get('/redirect', async (req: any, res: any) => {
    if (req.query.code) {
        const account = await getAccessToken(req.query.code);
        if (account) {
            return res.redirect(generateRedirectUrl(account));
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send();
    }
});

onedriveRouter.get('/displayTokens', async (req: any, res: any) => { // Dummy endpoint for testing purposes
    if (req.query.homeAccountId && req.query.accessToken && req.query.expiresOn ) {
        const account: OneDriveTokenModel = req.query as OneDriveTokenModel;
        return res.status(200).json(account);
    } else {
        return res.status(400).send();
    }
});

/**
 * Generates a redirect URL where account details are passed as query parameters.
 * @param account Account details to generate URL for
 * @returns URL to redirect to
 */
function generateRedirectUrl(account: OneDriveTokenModel): string {
    return process.env.ONEDRIVE_FRONTEND_REDIRECT + '?homeAccountId=' + encodeURIComponent(account.homeAccountId) + '&accessToken=' + 
        encodeURIComponent(account.accessToken) + '&expiresOn=' + account.expiresOn.toString();
}

module.exports = onedriveRouter;
