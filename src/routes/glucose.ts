import { parseAbbott } from "../../test/services/parseUtils";
import { OutputDataType } from "../services/dataParsers/dataParser";
import { GlucoseModel } from '../gb/models/glucoseModel';
import AbbottParser from "../services/dataParsers/abbottParser";
import { checkJwt } from "../middlewares/checkJwt";

/* eslint-disable @typescript-eslint/no-var-requires */
const glucoseRouter = require('express').Router();

glucoseRouter.get('/', checkJwt, async (req: any, res: any) => {
    let startTime = Number(req.query.startTime);
    let endTime = Number(req.query.endTime);

    if (startTime && endTime) {
        // TODO: use req.user.* to get GameBus credentials (for now only dummy data)
        // Only for testing, normally we would use the GameBus backend to retrieve glucose data.
        const abbottEUParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
        await abbottEUParser.process();
        let glucoseData = abbottEUParser.getDataForTimeframe(OutputDataType.GLUCOSE, startTime, endTime) as GlucoseModel[];

        if (glucoseData) {
            return res.status(200).json(glucoseData);
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send();
    }
});

module.exports = glucoseRouter;