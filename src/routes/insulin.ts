import axios from 'axios';
import { Response, Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { InsulinModel, InsulinType } from '../gb/models/insulinModel';
import { checkJwt } from '../middlewares/checkJwt';
import { validUnixTimestamp } from '../services/utils/dates';

const insulinRouter = Router();

insulinRouter.post('/insulin', checkJwt, async (req: any, res: Response) => {
    // For now, the 'modify' parameter will be used to distinguish between POST and PUT
    // modify as boolean (only important if true)

    const insulinTime = req.body.timestamp as number;
    const insulinAmount = req.body.insulinAmount as number;
    const insulinType = req.body.insulinType as InsulinType;

    // Verify that we have a valid amount, an activityId, an insulinType and a valid timestamp
    if (!validUnixTimestamp(insulinTime) || insulinAmount < 0 || !insulinType) {
        // Bad request
        return res.sendStatus(400);
    }

    let insulinModel: InsulinModel = {
        timestamp: insulinTime,
        insulinAmount: insulinAmount,
        insulinType: insulinType
    };

    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // PUT
    if (req.query.modify) {
        if (!req.body.activityId) {
            // Bad request, missing activity ID for PUT
            res.sendStatus(400);
        }
        const activityId = req.body.activityId as number;
        insulinModel = {
            ...insulinModel,
            activityId: activityId
        };
        try {
            // PUT data
            await gbClient.insulin().putSingleInsulinActivity(insulinModel, req.user.playerId);
            // Send 200 and new model
            return res.status(201).send(insulinModel);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Unauthorized -> 401
                if (error.response?.status === 401) {
                    return res.status(401).send();
                }
            }
            // Unknown error -> 503
            return res.status(503).send();
        }
    }

    // POST
    try {
        gbClient.insulin().postSingleInsulinActivity(insulinModel, req.user.playerId);
        res.sendStatus(201).send(insulinModel);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Unauthorized -> 401
            if (error.response?.status === 401) {
                return res.status(401).send();
            }
        }
        // Unknown error -> 503
        return res.status(503).send();
    }
});

module.exports = insulinRouter;
