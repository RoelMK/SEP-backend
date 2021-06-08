import { addDays } from "date-fns";
import { Router } from "express";
import { TokenHandler } from "../gb/auth/tokenHandler";
import { GameBusClient } from "../gb/gbClient";
import { checkJwt } from "../middlewares/checkJwt";
import { DataEndpoint, EndpointParameters, parseExerciseTypes } from "../services/dataEndpoint";
import { DateFormat, DateSlice, parseDate } from "../services/utils/dates";
const dataRouter = Router();

dataRouter.get('/data', checkJwt, async (req: any, res: any) => { // checkJwt middleware should be included
    // Data we get:
    // startDate formatted as dd-MM-yyyy 
    // [Optional] endDate formatted as dd-MM-yyyy 
    // dataTypes, array of data types to retrieve, seperated by ',', choose from glucose,mood,exercise,insulin,food
    // [Optional] exerciseTypes, array of gamedescriptors, seperated by ','

    if (!req.query.startDate || !req.query.dataTypes) { // || !req.query.startTime || !req.query.endTime ) {
        return res.status(400).send();
    }
    if (!req.query.endDate) {
        req.query.endDate = req.query.startDate;    // TODO: is this allowed?
    }

    // Get date slices to retrieve data for
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
        parameters.exerciseTypes = parseExerciseTypes(req.query.exerciseTypes);
    }

    // Retrieve data
    const dataEndpoint = new DataEndpoint(gbClient, Number(req.user.playerId), dataTypes, parameters); 
    const data = await dataEndpoint.retrieveData(dateSlice);

    // Return the data
    res.status(200).json(data);
});


// http://localhost:8080/data?startDate=10-10-2020&endDate=11-10-2020&startTime=10:00&endTime=11:00&dataTypes=glucose

module.exports = dataRouter;