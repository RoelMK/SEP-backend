import { DBClient } from '../db/dbClient';
import { checkJwt } from '../middlewares/checkJwt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', async (req: any, res: any) => {
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