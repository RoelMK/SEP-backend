import axios from 'axios';
import { Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { MoodModel } from '../gb/models/moodModel';
import { Keys } from '../gb/objects/keys';
import { checkJwt } from '../middlewares/checkJwt';
import { validUnixTimestamp } from '../services/utils/dates';

const moodRouter = Router();

moodRouter.post('/mood', checkJwt, async (req: any, res: any) => {
    // For now, the 'modify' parameter will be used to distinguish between POST and PUT
    // modify as boolean (only important if true)

    // Call someone to aggregate and send data to gamebus
    console.log(req.body);

    const moodTime = req.body.timestamp as number;
    const valence = req.body.valence as number;
    const arousal = req.body.arousal as number;

    // Check if given timestamps are valid
    if (!validUnixTimestamp(moodTime) || valence < 1 || valence > 3 || arousal < 1 || valence > 3) {
        // Bad request
        res.status(400).json({
            success: false,
            message: 'Mood model provided is formatted incorrectly'
        });
        return;
    }

    // Create initial model
    let moodModel: MoodModel = {
        timestamp: moodTime,
        valence: valence,
        arousal: arousal
    };

    // Initialize client
    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // PUT
    if (req.query.modify) {
        if (!req.body.activityId) {
            // Bad request, missing activity ID for PUT
            return res.status(400).json({ success: false, message: 'Missing activity ID' });
        }
        // Get activity ID
        const activityId = req.body.activityId as number;
        // Check whether given ID is a mood activity
        const moodActivity = await gbClient
            .activity()
            .checkActivityType(activityId, Keys.moodTranslationKey);
        if (!moodActivity) {
            return res
                .status(400)
                .json({ success: false, message: 'Given Activity ID is not a mood activity' });
        }
        // Add activity ID
        moodModel = {
            ...moodModel,
            activityId: activityId
        };
        try {
            // PUT Data
            const response = gbClient.mood().putSingleMoodActivity(moodModel, req.user.playerId);
            res.status(201).json(response);
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
        const response = gbClient.mood().postSingleMoodActivity(moodModel, req.user.playerId);
        res.status(201).json(response);
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

module.exports = moodRouter;
