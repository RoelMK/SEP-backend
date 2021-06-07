import { Request, Response, Router } from 'express';
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { InsulinModel } from '../gb/models/insulinModel';
import { checkJwt } from '../middlewares/checkJwt';

const insulinRouter = Router();

insulinRouter.post('/insulin', checkJwt, async (req: Request, res: Response) => {
    // Simple POST should only include an InsulinModel
    if (!InsulinModelGuard(req.body)) {
        // Bad request as body is not InsulinModel
        res.sendStatus(400);
    }

    // TODO: not sure if this works directly, might need to "rebuild" the model from the body
    const insulin: InsulinModel = req.body;

    const gbClient = new GameBusClient(
        new TokenHandler(req.user.accessToken, req.user.refreshToken, req.user.playerId)
    );

    try {
        // Store response and PUT insulin data
        const response = await gbClient
            .insulin()
            .putSingleInsulinActivity(insulin, req.user.playerId);
        // Send response back and also 200
        res.status(200).send(response);
    } catch (e) {
        // If error, send 400 and error
        res.status(400).send(e);
    }
});

function InsulinModelGuard(object: any): object is InsulinModel {
    return (
        object.timestamp !== undefined &&
        object.insulinAmount !== undefined &&
        object.insulinType !== undefined &&
        object.activityId !== undefined
    );
}

module.exports = insulinRouter;
