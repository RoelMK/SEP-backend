import axios from 'axios';
import { Router, Response } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { MoodModel } from '../gb/models/moodModel';
import { Keys } from '../gb/objects/GBObjectTypes';
import { checkJwt } from '../middlewares/checkJwt';
import { validUnixTimestamp } from '../services/utils/dates';

const moodRouter = Router();

moodRouter.post('/mood', checkJwt, async (req: any, res: Response) => {
    const moodTime = req.body.timestamp as number;
    const valence = req.body.valence as number;
    const arousal = req.body.arousal as number;

    // Check if given timestamps are valid
    if (!validUnixTimestamp(moodTime) || valence < 1 || valence > 3 || arousal < 1 || valence > 3) {
        // Bad request
        return res.status(400).json({
            success: false,
            message: 'Mood model provided is formatted incorrectly'
        });
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

    // PUT request for mood if activityId is present
    if (req.body.activityId) {
        // Get activity ID of mood
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
            const response = await gbClient
                .mood()
                .putSingleMoodActivity(moodModel, req.user.playerId);
            // Send 201 and new model
            return res.status(201).json(response);
        } catch (error) {
            // Check for errors on mood PUT
            if (axios.isAxiosError(error)) {
                // Unauthorized on mood PUT -> 401
                if (error.response?.status === 401) {
                    return res.status(401).send();
                }
            }
            // Unknown error on mood PUT -> 503
            return res.status(503).send();
        }
    }

    // POST
    try {
        // POST mood model
        const response = await gbClient.mood().postSingleMoodActivity(moodModel, req.user.playerId);
        return res.status(201).json(response);
    } catch (error) {
        // Error catching on mood POST
        if (axios.isAxiosError(error)) {
            // Unauthorized on mood POST -> 401
            if (error.response?.status === 401) {
                return res.status(401).send();
            }
        }
        // Unknown error on mood POST -> 503
        return res.status(503).send();
    }
});

module.exports = moodRouter;
