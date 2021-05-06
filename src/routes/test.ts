import XMLParser from "../services/xmlParser";
import * as EetmeterModels from "../models/eetmeterModel";
import EeetMeterParser from "../services/food/eetmeterParser";

const testRouter = require('express').Router();

testRouter.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

testRouter.get('/test', (req: any, res: any) => {

    var parser = new XMLParser()
    var k = parser.parse("./src/services/food/eetmeter.xml")
    // console.log(k)
    k.then((result) => {
        // console.log("in closure")
        var parsed = result as EetmeterModels.EetmeterData
        console.log(parsed)
        // for (var i = 0; i < parsed.Consumpties.Consumptie.length; i++) {
        //     console.log(parsed.Consumpties.Consumptie[i].Attributes.Periode)
        //     console.log(parsed.Consumpties.Consumptie[i].Product.Naam)
        //     console.log(parsed.Consumpties.Consumptie[i].Datum.Jaar)
        //     console.log(parsed.Consumpties.Consumptie[i].Nutrienten.Koolhydraten.Value)
        // }
        var o = new EeetMeterParser(parsed)
        res.send(parsed);
    })
});

module.exports = testRouter;