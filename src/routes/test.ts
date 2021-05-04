import { runDBTests } from "../../test/db/testDBClient";
import { checkJwt } from "../middlewares/checkJwt";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', (req: any, res: any) => {
    res.send('Test is working!');
});

testRouter.get('/jwt-test', checkJwt, (req: any, res: any) => {
    res.send('Authentication test, your user id: ' + req.user.userId);
});

testRouter.get('/db-test', (req: any, res: any) => {
    runDBTests();
    res.send('Finished database test.');
});

module.exports = testRouter;
