import axios from 'axios';
import { Router } from 'express';
import { GameBusToken } from '../gb/auth/tokenHandler';
import { checkJwt } from '../middlewares/checkJwt';
import { DataEndpoint, EndpointData } from '../services/dataEndpoint';
import { CombinedDataParserOutput, OutputDataType } from '../services/dataParsers/dataParser';
import NightscoutParser from '../services/dataParsers/nightscoutParser';

const nightscoutRouter = Router();
nightscoutRouter.get('/nightscout', checkJwt, async (req: any, res: any) => {
    if (!req.query.host) {
        res.status(400).send('Please specify the nightscout host');
        return;
    }

    // retrieve user information
    const userInfo: GameBusToken = {
        playerId: req.user.playerId,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
    };

    const nsParser: NightscoutParser = new NightscoutParser(req.query.host, userInfo);
    nsParser.parseOnlyNewest(true);
    try {
        await nsParser.process();
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
            res.status(401).send();
            return;
        }
        switch (e.name) {
            case 'InputError':
                res.status(400).send(`An erroneous host was uploaded! Reason: ${e.message}`);
                break;
            default:
                console.log(e.message);
                res.status(503).send('Something went wrong :(');
        }
        return;
    }

    // process has been completed
    const parsedData: CombinedDataParserOutput = nsParser.getData(
        OutputDataType.ALL
    ) as CombinedDataParserOutput;

    res.json(DataEndpoint.unionData(parsedData as EndpointData));
    console.log('Nightscout data was updated successfully');
});

module.exports = nightscoutRouter;
