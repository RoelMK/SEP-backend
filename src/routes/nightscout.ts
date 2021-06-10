import axios from 'axios';
import { Router } from 'express';
import NightscoutParser from '../services/dataParsers/nightscoutParser';

const nightscoutRouter = Router();
nightscoutRouter.get('/nightscout', async (req: any, res: any) => {
    if (!req.query.host) {
        res.status(400).send('Please specify the nightscout host');
        return;
    }
    const nsParser: NightscoutParser = new NightscoutParser(req.query.host);
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

    res.status(200).send('Nightscout data was updated correctly');
    console.log('Nightscout data was updated correctly');
});

module.exports = nightscoutRouter;
