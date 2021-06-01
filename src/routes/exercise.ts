import { Router, Request, Response } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { ExerciseGameDescriptorNames } from '../gb/objects/exercise';
import { checkJwt } from '../middlewares/checkJwt';
import { validUnixTimestamp } from '../services/utils/dates';

const exerciseRouter = Router();

exerciseRouter.get('/exercise:gds:start:end', checkJwt, async (req: Request, res: Response) => {
    // Check if authorized
    if (!req.user) {
        // Unauthorized
        res.sendStatus(401);
        return;
    }

    // Get game descriptors, start & end date from request params
    const gdsRaw: string = req.params.gds;
    // Get start and end dates as unix timestamps from request params
    const start: number = parseInt(req.params.start);
    const end: number = parseInt(req.params.end);

    // Check if given timestamps are valid
    if (!validUnixTimestamp(start) || !validUnixTimestamp(end)) {
        // Bad request
        res.sendStatus(400);
        return;
    }

    // Create GBClient from token
    // TODO: still complaining about properties not existing
    const client = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    // Get exercises from query
    const exercises = await client
        .exercise()
        .getExerciseActivityFromGdBetweenUnix(0, rawToGds(gdsRaw), start, end);

    // Send exercises as response
    res.send(exercises);
});

const rawToGds = (gds: string): ExerciseGameDescriptorNames[] => {
    // First split the list intro strings
    const sep = gds.split(',');
    const result: ExerciseGameDescriptorNames[] = [];
    // Check if the game descriptors are valid (if they exist)
    for (const gd in sep) {
        if (ExerciseGameDescriptorNames[gd]) {
            result.push(ExerciseGameDescriptorNames[gd]);
        }
    }
    // Return all game descriptors that exist
    return result;
};

module.exports = exerciseRouter;
