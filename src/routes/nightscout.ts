import { Router } from 'express';
import NightscoutParser from '../services/dataParsers/nightscoutParser';

const nightscoutRouter = Router();
nightscoutRouter.get('/nightscout', async (req: any, res: any) => {
    if (!req.query.host) {
        res.status(400).send('Please specify the nightscout host');
    }
    await new NightscoutParser(req.query.host).process();
    res.status(200).send('Nightscout data was updated correctly');
    console.log('Nightscout data was updated correctly');
});

module.exports = nightscoutRouter;
