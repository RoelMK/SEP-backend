import { parse } from "dotenv";
import { runAuthTests } from "../../test/auth/testAuth";
import { checkJwt } from "../middlewares/checkJwt";

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

testRouter.get('/auth-test', (req: any, res: any) => {
    runAuthTests();
    res.send('Finished authentication test.');
});

module.exports = testRouter;
