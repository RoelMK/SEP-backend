import axios from 'axios';
import { Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { BMIModel } from '../gb/models/bmiModels';
import { checkJwt } from '../middlewares/checkJwt';

const profileRouter = Router();

/**
 * Endpoint for retrieving profile data of the user
 */
profileRouter.get('/profile', checkJwt, async (req: any, res: any) => {
    // use user info to create a GameBus client
    const gbClient: GameBusClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    try {
        const profileData: BMIModel = await gbClient.bmi().getLatestBMIActivity(req.user.playerId);
        return res.status(200).json(profileData).send('Successfully retrieved profile information');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                // Unauthorized
                return res.status(401).send();
            }
        }
        // We cannot handle this specific request, no data for the user.
        return res.status(503).send();
    }
});

/**
 * Endpoint for posting profile data to gamebus
 */
profileRouter.post('/profile', checkJwt, async (req: any, res: any) => {
    if (!req.query.weight || !req.query.length || !req.query.age) {
        res.status(400).send();
        return;
    }

    // use user info to create a GameBus client
    const gbClient: GameBusClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // extract parameters into bmi model
    const bmi: BMIModel = {
        // necessary properties
        timestamp: new Date().getTime(),
        weight: parseInt(req.query.weight),
        length: parseInt(req.query.length),
        age: parseInt(req.query.age),
        // optional properties are added when specified
        ...(req.query.gender && { gender: req.query.gender }),
        ...(req.query.waistCircumference && { waistCircumference: req.query.waistCircumference }),
        ...(req.query.bmi && { bmi: req.query.bmi })
    };

    try {
        // tries posting the bmi profile data to GameBus
        await gbClient.bmi().postSingleBMIActivity(bmi, req.user.playerId);
        return res.status(200).send('Successfully posted profile information');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                // Unauthorized
                return res.status(401).send();
            }
        }
        // We cannot handle this specific request, no data for the user.
        return res.status(503).send();
    }
});

module.exports = profileRouter;
