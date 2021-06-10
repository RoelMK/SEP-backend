import axios from 'axios';
import { addDays } from 'date-fns';
import { Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { checkJwt } from '../middlewares/checkJwt';
import { DataEndpoint, EndpointParameters, parseExerciseTypes } from '../services/dataEndpoint';
import { DateFormat, DateSlice, parseDate } from '../services/utils/dates';
const dataRouter = Router();

dataRouter.get('/data', checkJwt, async (req: any, res: any) => {
    // Data we get:
    // startDate formatted as dd-MM-yyyy
    // [Optional] endDate formatted as dd-MM-yyyy
    // dataTypes, array of data types to retrieve, seperated by ',', choose from glucose,mood,exercise,insulin,food
    // [Optional] exerciseTypes, array of gamedescriptors, seperated by ','
    // union, boolean, if true: return per timestamp all available data in one single object
    const t1 = new Date().getTime();
    if (!req.query.startDate || !req.query.dataTypes) {
        return res.status(400).send();
    }
    if (!req.query.endDate) {
        req.query.endDate = req.query.startDate;
    }

    // Get date slices to retrieve data for
    const dateSlice: DateSlice = {
        startDate: parseDate(req.query.startDate, DateFormat.ENDPOINT_DATE) as Date,
        endDate: addDays(parseDate(req.query.endDate, DateFormat.ENDPOINT_DATE) as Date, 1)
    };

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
    const dataEndpoint = new DataEndpoint(
        gbClient,
        Number(req.user.playerId),
        dataTypes,
        parameters
    );
    try {
        const data = await dataEndpoint.retrieveData(dateSlice);
        console.log(data.glucose?.length);
        console.log('Time to do full data get ' + (new Date().getTime() - t1));
        // Return the data
        if (req.query.union) {
            res.status(200).json(DataEndpoint.unionData(data));
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                // Unauthorized
                return res.status(401).send();
            }
        }
        return res.status(503).send(); // We cannot handle this specific request, no data for the user.
    }
});

module.exports = dataRouter;
