import axios from 'axios';
import { Response, Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { InsulinModel, InsulinType } from '../gb/models/insulinModel';
import { Keys } from '../gb/objects/keys';
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
    if (!validUnixTimestamp(insulinTime) || insulinAmount < 0 || insulinType < 0) {
        // Bad request
        return res
            .status(400)
            .json({ success: false, message: 'Insulin model provided is formatted incorrectly' });
    }

    // Create initial model
    let insulinModel: InsulinModel = {
        timestamp: insulinTime,
        insulinAmount: insulinAmount,
        insulinType: insulinType
    };

    // Initialize client
    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // PUT
    if (req.query.modify) {
        if (!req.body.activityId) {
            // Bad request, missing activity ID for PUT
            res.status(400).json({ success: false, message: 'Missing activity ID' });
        }
        // Get activity ID
        const activityId = req.body.activityId as number;
        // Check whether given ID is an insulin activity
        const insulinActivity = await gbClient
            .activity()
            .checkActivityType(activityId, Keys.insulinTranslationKey);
        if (!insulinActivity) {
            return res
                .status(400)
                .json({ success: false, message: 'Given Activity ID is not an insulin activity' });
        }
        // Add activity ID
        insulinModel = {
            ...insulinModel,
            activityId: activityId
        };
        try {
            // PUT data
            await gbClient.insulin().putSingleInsulinActivity(insulinModel, req.user.playerId);
            // Send 200 and new model
            return res.status(201).json(insulinModel);
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
        // POST model
        gbClient.insulin().postSingleInsulinActivity(insulinModel, req.user.playerId);
        res.sendStatus(201).json(insulinModel);
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
