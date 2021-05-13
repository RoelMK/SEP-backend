import { parse } from "dotenv";
import { runAuthTests } from "../../test/auth/testAuth";
import { checkJwt } from "../middlewares/checkJwt";
import AbbottParser from "../services/abbottParser";
import EetMeterParser from "../services/eetmeterParser";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});


testRouter.get('/test', (req: any, res: any) => {
    // const parser = new EetMeterParser('src/services/food/eetmeter.xml');
    const eetmeterParser: EetMeterParser = new EetMeterParser('src/services/food/eetmeter.xml');
    eetmeterParser.process();
    res.send(eetmeterParser.getData());
    // return eetmeterParser.getData()
    // var parser2 = new AbbottParser('src/services/food/food_data.csv')
    // await parser.process();
    // await parser.process()
    // res.send('Hi, this was a success!');
});

testRouter.get('/jwt-test', checkJwt, (req: any, res: any) => {
    res.send('Finished JWT test, your token payload: ' + JSON.stringify(req.user));
});

testRouter.get('/auth-test', (req: any, res: any) => {
    runAuthTests();
    res.send('Finished authentication test.');
});

module.exports = testRouter;
