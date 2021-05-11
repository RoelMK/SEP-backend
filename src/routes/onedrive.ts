import { getAccessToken, getAuthorizationUrl } from "../onedrive/auth";

const onedriveRouter = require('express').Router();


onedriveRouter.get('/login', async(req: any, res: any) => {
    let authUrl = await getAuthorizationUrl();
    if (authUrl) {
        return res.redirect(authUrl);
    } else {
        return res.status(403).send();
    }
});

onedriveRouter.get('/redirect', async(req: any, res: any) => {
    if (req.query.code) {
        let accessToken = await getAccessToken(req.query.code);
        if (accessToken) {
            return res.status(200).json({
                accessToken: accessToken
            });
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send();
    }
});

module.exports = onedriveRouter;
