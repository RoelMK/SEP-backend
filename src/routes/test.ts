import { DBClient } from '../db/dbClient';
import { checkJwt } from '../middlewares/checkJwt';
import { NightScoutClient } from '../nightscout/nsClient';
import NightscoutParser, { NightScoutEntryModel } from '../services/dataParsers/nightscoutParser';
import { DateFormat, parseDate } from '../services/utils/dates';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', async (req: any, res: any) => {

    console.log(new Date('2021-05-28T06:21:31.366Z').getTime())
    let birthday = new Date('1995-12-17T03:24:00').getTime
    console.log(birthday)
    console.log(parseDate("2021/05/28T06:21:31.366Z".replace(/-/g, '/'), DateFormat.EETMETER))
    console.log(parseDate("2021/05/28T06:21:31.366Z".replace(/-/g, '/'), DateFormat.FOOD_DIARY))
    console.log(parseDate("2021/05/28T06:21:31.366Z".replace(/-/g, '/'), DateFormat.ABBOTT_EU))
    console.log(parseDate("2021/05/28T06:21:31.366Z".replace(/-/g, '/'), DateFormat.ABBOTT_US))
    console.log(parseDate("2021/05/28T06:21:31.366Z".replace(/-/g, '/'), DateFormat.NONE))

    const nsClient = new NightScoutClient('https://nightscout-sep.herokuapp.com', 'rink-27f591f2e4730a68');
    var a = await nsClient.getEntries()

   
    const nsParser: NightscoutParser = new NightscoutParser(
        'https://nightscout-sep.herokuapp.com',
        '' // TODO why don't you need a token to get entry data??
    );
    await nsParser.process();
    var treatments = await nsClient.getTreatments()

    console.log(a)
    console.log(treatments)

    console.log(await nsParser.getData())
    console.log(await nsParser.getInsulinData())

    res.send('Hi, this was a success!');
});

testRouter.get('/jwt-test', checkJwt, (req: any, res: any) => {
    res.send('Finished JWT test, your token payload: ' + JSON.stringify(req.user));
});

testRouter.get('/clean', async (req: any, res: any) => {
    const dbClient: DBClient = new DBClient(true);
    const result = dbClient.cleanLoginAttempts();
    dbClient.close();
    res.send(result);
});

module.exports = testRouter;