import AbbottParser from "../services/abbottParser";
import XMLParser from "../services/xmlParser";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', (req: any, res: any) => {
    res.send('Test is working!');
});

module.exports = testRouter;