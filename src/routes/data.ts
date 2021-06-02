import { Router } from "express";
import { createDateSlices, DateFormat, DateSlice, parseDate } from "../services/utils/dates";
const dataRouter = Router();

dataRouter.get('/data', async (req: any, res: any) => { // checkJwt middleware should be included
    // Data we get:
    // startTime, formatted as HH:mm
    // startDate, endDate as dd-MM-yyyy
    // sliceDate, boolean
    // more ...
    if (!req.query.startDate || !req.query.endDate || !req.query.startTime || !req.query.endTime) {
        return res.status(400).send();
    }

    let dateSlices: DateSlice[] = [];
    if (req.query.sliceDate) {
        const startDate = parseDate(req.query.startDate as string, DateFormat.ENDPOINT_DATE) as Date;
        const endDate = parseDate(req.query.endDate as string, DateFormat.ENDPOINT_DATE) as Date;

        const startTimeSplit = req.query.startTime.split(':') as number[];
        const endTimeSplit = req.query.endTime.split(':') as number[];
        if (startTimeSplit.length < 2 || endTimeSplit.length < 2) {
            return res.status(400).send();
        }
        dateSlices = createDateSlices(startDate, endDate, startTimeSplit[0], startTimeSplit[1], endTimeSplit[0], endTimeSplit[1]);
    } else {
        dateSlices.push({
            startDate: parseDate(req.query.startDate + ' ' + req.query.startTime, DateFormat.ENDPOINT_DATETIME) as Date,
            endDate: parseDate(req.query.endDate + ' ' + req.query.endTime, DateFormat.ENDPOINT_DATETIME) as Date
        });
    }
    res.status(200).json(dateSlices);
});


// http://localhost:8080/data?startDate=10-10-2020&endDate=11-10-2020&startTime=10:00&endTime=11:00

module.exports = dataRouter;