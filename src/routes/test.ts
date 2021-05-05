import { runAuthTests } from "../../test/auth/testAuth";
import { runCryptoTests } from "../../test/auth/testCrypto";
import { runDBTests } from "../../test/db/testDBClient";
import { checkJwt } from "../middlewares/checkJwt";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/jwt-test', checkJwt, (req: any, res: any) => {
    res.send('Finished JWT test, your user id: ' + req.user.userId);
});

testRouter.get('/db-test', (req: any, res: any) => {
    runDBTests();
    res.send('Finished database test.');
});

testRouter.get('/crypto-test', (req: any, res: any) => {
    runCryptoTests();
    res.send('Finished database test.');
});

testRouter.get('/auth-test', (req: any, res: any) => {
    runAuthTests();
    res.send('Finished authentication test.');
});

module.exports = testRouter;
