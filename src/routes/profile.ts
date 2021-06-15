import axios from 'axios';
import { Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { BMIModel } from '../gb/models/bmiModels';
import { GameBusUser, Notification } from '../gb/models/gamebusModel';
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
        const bmiData: BMIModel = await gbClient.bmi().getLatestBMIActivity(req.user.playerId);
        const userData: GameBusUser = await gbClient.user().getCurrentUser();
        const profileData: UserProfile = { ...bmiData, ...userData };
        return res.status(200).json(profileData);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                // Unauthorized
                return res.status(401).send();
            }
        }
        console.log(error);
        // We cannot handle this specific request, no data for the user.
        return res.status(200).json({
            timestamp: -1,
            activityId: -1,
            weight: null,
            length: null,
            age: null
        });
    }
});

/**
 * Endpoint for posting profile data to gamebus
 */
profileRouter.post('/profile', checkJwt, async (req: any, res: any) => {
    if (!req.body.weight || !req.body.length || !req.body.age) {
        return res.status(400).send('Weight, length or age is not specified');
    }
    if (
        parseFloat(req.body.weight) <= 0 ||
        parseFloat(req.body.length) <= 0 ||
        parseFloat(req.body.age) < 0
    ) {
        return res.status(400).send('Weight, length or age is invalid');
    }

    // use user info to create a GameBus client
    const gbClient: GameBusClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // extract parameters into bmi model
    const bmi: BMIModel = {
        // necessary properties
        timestamp: new Date().getTime(),
        weight: parseFloat(req.body.weight),
        length: parseFloat(req.body.length),
        age: parseInt(req.body.age),
        // optional properties are added when specified
        ...(req.body.gender && { gender: req.body.gender }),
        ...(req.body.waistCircumference && { waistCircumference: req.body.waistCircumference }),
        ...(req.body.bmi && { bmi: req.body.bmi })
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

interface UserProfile extends GameBusUser, BMIModel {
    timestamp: number;
    activityId?: number; // ID of GameBus activity
    weight: number | null; // weight in kg, should not be optional since we POST it
    length: number | null; // height in cm
    age: number | null; // age in years
    gender?: string | null; // Either m, f or o, optional since we don't really need it
    waistCircumference?: number | null; // in cm, optional since we don't really need it
    bmi?: number | null; // in kg/m^2, optional since we don't really need it
    id: number; // user ID
    email: string;
    firstName: string;
    lastName: string;
    image: string | null; // null if no image
    registrationDate: number; // Unix timestamp in ms
    isActivated: boolean; // email verified
    language: string; // 'en' for English, 'nl' for Dutch
    player: {
        id: number; // player ID (as opposed to user ID)
    };
    notifications: Notification[];
}
module.exports = profileRouter;
