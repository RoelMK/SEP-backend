import { getAccessToken, getAccessTokenSilent, getAuthorizationUrl } from '../onedrive/auth';

const onedriveRouter = require('express').Router();

onedriveRouter.get('/login', async (req: any, res: any) => {
    // Try to login using given account id if possible
    if (req.query.homeAccountId) {
        let account = await getAccessTokenSilent(req.query.homeAccountId);
        if (account) {
            return res.status(200).json(account);
        }
    }

    // If no id is given or no credentials are in cache, start login procedure
    let authUrl = await getAuthorizationUrl();
    if (authUrl) {
        return res.redirect(authUrl);
    } else {
        return res.status(403).send();
    }
});

onedriveRouter.get('/redirect', async (req: any, res: any) => {
    if (req.query.code) {
        let account = await getAccessToken(req.query.code);
        if (account) {
            return res.status(200).json(account);
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send();
    }
});

module.exports = onedriveRouter;
