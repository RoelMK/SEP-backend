import { Router, Response } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { MoodModel } from '../gb/models/moodModel';
import { validUnixTimestamp } from '../services/utils/dates';

const moodRouter = Router()

moodRouter.post('/mood', (req: any, res: Response) => {
    // Call someone to aggregate and send data to gamebus
    console.log(req.body);

    const moodTime = req.body.timestamp as number;
    const valence = req.body.valence as number;
    const arousal = req.body.arousal as number

    // Check if given timestamps are valid
    if (!validUnixTimestamp(moodTime) 
    || (valence < 1 || valence > 3) 
    || (arousal < 1 || valence > 3)) {
        // Bad request
        res.sendStatus(400);
        return;
    }

    const moodModel: MoodModel = {
        timestamp: moodTime,
        valence: valence,
        arousal: arousal
    }

    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    gbClient.mood().postSingleMoodActivity(moodModel, req.user.playerId)

    res.send(moodModel);
});

module.exports = moodRouter;
