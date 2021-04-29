import { checkJwt } from "../middlewares/checkJwt";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', (req: any, res: any) => {
    res.send('Test is working!');
});

testRouter.get('/jwt-test', checkJwt, (req: any, res: any) => {
    res.send('Authenticated test, user id: ' + req.user.userId);
});

module.exports = testRouter;
