import axios from 'axios';
import { Response, Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { InsulinModel, InsulinType } from '../gb/models/insulinModel';
import { checkJwt } from '../middlewares/checkJwt';
import { validUnixTimestamp } from '../services/utils/dates';

const insulinRouter = Router();

insulinRouter.post('/insulin', checkJwt, async (req: any, res: Response) => {
    // Simple POST should only include an InsulinModel

    const insulinTime = req.body.timestamp as number;
    const insulinAmount = req.body.insulinAmount as number;
    const insulinType = req.body.insulinType as InsulinType;
    const activityId = req.body.activityId as number;

    if (!validUnixTimestamp(insulinTime) || insulinAmount < 0 || !activityId) {
        // Bad request
        return res.sendStatus(400);
    }

    const insulinModel: InsulinModel = {
        timestamp: insulinTime,
        insulinAmount: insulinAmount,
        insulinType: insulinType,
        activityId: activityId
    };

    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    try {
        // PUT data
        await gbClient.insulin().putSingleInsulinActivity(insulinModel, req.user.playerId);
        // Send 200 and new model
        res.status(200).send(insulinModel);
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
