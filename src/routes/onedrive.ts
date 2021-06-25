import axios from 'axios';
import { GameBusToken } from '../gb/auth/tokenHandler';
import { checkJwt } from '../middlewares/checkJwt';
import { getAccessToken, getAccessTokenSilent, getAuthorizationUrl } from '../onedrive/auth';
import { OneDriveTokenModel } from '../onedrive/models/onedriveTokenModel';
import { DataEndpoint, EndpointData } from '../services/dataEndpoint';
import { CombinedDataParserOutput, OutputDataType } from '../services/dataParsers/dataParserTypes';
import FoodDiaryParser from '../services/dataParsers/foodDiaryParser';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const onedriveRouter = require('express').Router();

/**
 * Get endpoint for retrieving data from a onedrive account
 * Query parameters:
 * oneDriveToken: Access token with which the file on the onedrive can be retrieved
 * filePath: path to the file on the oneDrive from the root (e.g. Documents/food.xlsx or food.xlsx)
 */
onedriveRouter.get('/onedrive', checkJwt, async (req: any, res: any) => {
    if (!req.query.oneDriveToken || !req.query.filePath) {
        res.status(400).send('No token');
        return;
    }

    // retrieve user information from onedrive endpoint
    const userInfo: GameBusToken = {
        playerId: req.user.playerId,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
    };

    // create food diary parser (for now the only supported data format from the onedrive)
    const fdParser = new FoodDiaryParser(req.query.filePath, userInfo, req.query.oneDriveToken);
    // only updated newest data from the onedrive
    fdParser.parseOnlyNewest(true);
    try {
        await fdParser.process();
    } catch (e) {
        // handle errors and send back appropriate response
        if (axios.isAxiosError(e) && e.response?.status === 401) {
            // In the case of an error with OneDrive, send 401
            res.status(401).send();
            return;
        }
        switch (e.name) {
            case 'InputError':
                res.status(400).send(
                    `An erroneous data file was specified, cannot parse this as a food diary! Reason: ${e.message}`
                );
                break;
            default:
                console.log(e);
                res.status(503).send('Something went wrong :(');
        }
        return;
    }

    // process has been completed
    const parsedData: CombinedDataParserOutput = fdParser.getData(
        OutputDataType.ALL
    ) as CombinedDataParserOutput;

    // send back processed data to the frontend
    res.json(DataEndpoint.unionData(parsedData as EndpointData));
    console.log('OneDrive food diary was successfuly imported');
});

/**
 * Get endpoint for logging into a OneDrive account
 * Query parameters:
 * homeAccountId
 */
onedriveRouter.get('/login', async (req: any, res: any) => {
    // Try to login using given account id if possible
    if (req.query.homeAccountId) {
        const account = await getAccessTokenSilent(req.query.homeAccountId);
        if (account) {
            return res.status(200).json(account);
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

/**
 * Get endpoint for handling redirects from the login page
 * Query parameters:
 * code
 */
onedriveRouter.get('/redirect', async (req: any, res: any) => {
    if (req.query.code) {
        const account = await getAccessToken(req.query.code);
        if (account) {
            return res.redirect(generateRedirectUrl(account));
        } else {
            return res.status(403).send();
        }
    } else {
        // If OneDrive fails -> 400
        return res.status(400).send();
    }
});

/**
 * Dummy Get endpoint that displays the tokens of a OneDrive login
 */
onedriveRouter.get('/displayTokens', async (req: any, res: any) => {
    // Dummy endpoint for testing purposes
    if (req.query.homeAccountId && req.query.accessToken && req.query.expiresOn) {
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
    let redirectUri = process.env.ONEDRIVE_FRONTEND_REDIRECT;
    if (!redirectUri) {
        redirectUri = '/onedrive/displayTokens'; // Set a default uri if none is specified in env
    }

    return (
        redirectUri +
        '?homeAccountId=' +
        encodeURIComponent(account.homeAccountId) +
        '&accessToken=' +
        encodeURIComponent(account.accessToken) +
        '&expiresOn=' +
        account.expiresOn.toString()
    );
}

module.exports = onedriveRouter;
