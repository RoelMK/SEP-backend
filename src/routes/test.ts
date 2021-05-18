import { DBClient } from "../db/dbClient";
import { checkJwt } from "../middlewares/checkJwt";
import { startLoginAttempt } from "../utils/authUtils";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', (req: any, res: any) => {
    res.send('Hi, this was a success!');
});

testRouter.get('/jwt-test', checkJwt, (req: any, res: any) => {
    res.send('Finished JWT test, your token payload: ' + JSON.stringify(req.user));
});

testRouter.get('/auth-test', async (req: any, res: any) => {
    console.log('x: ' + await startLoginAttempt('r.m.koopman@student.tue.nl'));
    res.status(200).send()
});

testRouter.get('/clean', async (req: any, res: any) => {
    let dbClient: DBClient = new DBClient(true);
    let result = dbClient.cleanLoginAttempts();
    dbClient.close();
    res.send(result);
});



module.exports = testRouter;
