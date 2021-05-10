const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', (req: any, res: any) => {
    res.send('Hi, this was a success!');
});

module.exports = testRouter;
