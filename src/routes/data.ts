import { addDays } from "date-fns";
import { Router } from "express";
import { TokenHandler } from "../gb/auth/tokenHandler";
import { GameBusClient } from "../gb/gbClient";
import { ExerciseGameDescriptorNames } from "../gb/objects/exercise";
import { checkJwt } from "../middlewares/checkJwt";
import { DataEndpoint, EndpointParameters, rawToGds } from "../services/dataEndpoint";
import { DateFormat, DateSlice, parseDate } from "../services/utils/dates";
const dataRouter = Router();

dataRouter.get('/data', checkJwt, async (req: any, res: any) => { // checkJwt middleware should be included
    // Data we get:
    // startDate formatted as dd-MM-yyyy 
    // Optional: endDate formatted as dd-MM-yyyy 
    // sliceDate, boolean
    // dataTypes, array of data types to retrieve, seperated by ','
    // Optional: exerciseTypes, array of gamedescriptors, seperated by ','

    if (!req.query.startDate || !req.query.dataTypes) { // || !req.query.startTime || !req.query.endTime ) {
        return res.status(400).send();
    }
    if (!req.query.endDate) {
        req.query.endDate = req.query.startDate;    // TODO: is this allowed?
    }

    // Get date slices to retrieve data for
    /*let dateSlices: DateSlice[] = [];
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
    }*/
    const dateSlice: DateSlice = {
        startDate: parseDate(req.query.startDate, DateFormat.ENDPOINT_DATE) as Date,
        endDate: addDays(parseDate(req.query.endDate, DateFormat.ENDPOINT_DATE) as Date, 1)
    }

    // Create GameBus client
    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // Get data types to retrieve
    const dataTypes = req.query.dataTypes.split(',') as string[];
    const parameters: EndpointParameters = {};
    if (req.query.exerciseTypes) {
        parameters.exerciseTypes = rawToGds(req.query.exerciseTypes);
    }

    // Retrieve data
    const dataEndpoint = new DataEndpoint(gbClient, Number(req.user.playerId), dataTypes, dateSlice, parameters);  // TODO: pass params
    const data = await dataEndpoint.retrieveData();

    // Return the data
    res.status(200).json(data);
});


// http://localhost:8080/data?startDate=10-10-2020&endDate=11-10-2020&startTime=10:00&endTime=11:00&dataTypes=glucose

module.exports = dataRouter;