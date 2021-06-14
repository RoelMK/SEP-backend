import { Router } from 'express';
import { GameBusToken } from '../gb/auth/tokenHandler';
import { BMIModel } from '../gb/models/BMIModel';
import { checkJwt } from '../middlewares/checkJwt';

const profileRouter = Router();

profileRouter.get('/profile', checkJwt, (req: any, res: any) => {
    // retrieve user information
    const userInfo: GameBusToken = {
        playerId: req.user.playerId,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
    };

    //TODO

    res.status(200).send('Successfully retrieved profile information');
});

profileRouter.post('/profile', checkJwt, (req: any, res: any) => {
    if (!req.query.weight || !req.query.length || !req.query.age) {
        res.status(400).send();
        return;
    }

    // retrieve user information
    const userInfo: GameBusToken = {
        playerId: req.user.playerId,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
    };

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

    // TODO
    res.status(200).send('Successfully posted profile information');
});

module.exports = profileRouter;
