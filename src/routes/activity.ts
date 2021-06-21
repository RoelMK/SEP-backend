import axios from 'axios';
import { Response, Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { checkJwt } from '../middlewares/checkJwt';

const activityRouter = Router();

activityRouter.post('/activities/delete', checkJwt, async (req: any, res: Response) => {
    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    if (!req.body.activityId) {
        // Bad request, missing activity ID for PUT
        res.sendStatus(400);
    }
    const activityId = req.body.activityId as number;
    try {
        // PUT data
        await gbClient.activity().deleteActivityById(activityId, req.user.playerId);
        // Send 204 no content for deletion
        return res.sendStatus(204);
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

module.exports = activityRouter;
