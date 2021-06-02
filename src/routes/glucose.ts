import { OutputDataType } from "../services/dataParsers/dataParser";
import { GlucoseModel } from '../gb/models/glucoseModel';
import AbbottParser from "../services/dataParsers/abbottParser";
//import { checkJwt } from "../middlewares/checkJwt";

/* eslint-disable @typescript-eslint/no-var-requires */
const glucoseRouter = require('express').Router();

glucoseRouter.get('/', async (req: any, res: any) => { // checkJwt middleware should be included
    const startTime = Number(req.query.startTime);
    const endTime = Number(req.query.endTime);

    if (startTime && endTime) {
        // TODO: use req.user.* to get GameBus credentials (for now only dummy data)
        // Only for testing, normally we would use the GameBus backend to retrieve glucose data.
        const abbottEUParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
        await abbottEUParser.process();
        const glucoseData = abbottEUParser.getDataForTimeframe(OutputDataType.GLUCOSE, startTime, endTime) as GlucoseModel[];

        if (glucoseData) {
            return res.status(200).json(glucoseModelToExportModel(glucoseData));
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send();
    }
});

/**
 * Converts an array of glucose models to the export model for the glucose endpoint.
 * @param data Glucose models
 * @returns Export model
 */
function glucoseModelToExportModel(data: GlucoseModel[]): GlucoseExportModel {
    const timestamps: number[] = [];
    const glucoseLevels: number[] = [];
    for (let i = 0; i < data.length; i++) {
        timestamps.push(data[i].timestamp);
        glucoseLevels.push(data[i].glucoseLevel);
    }

    return { timestamps: timestamps, glucoseLevels: glucoseLevels } as GlucoseExportModel;
}

/**
 * What is returned by the glucose endpoint.
 * timestamps: list of timestamps
 * glucoseLevels: for each timestamp a glucose level
 */
interface GlucoseExportModel {
    timestamps: number[];
    glucoseLevels: number[];
}

module.exports = glucoseRouter;