import { Router, Request, Response } from 'express';
import { finishLoginAttempt, registerConnectCallback, startLoginAttempt } from '../utils/authUtils';

const router = Router();

router.get('/login', async (req: Request, res: Response) => {
    const email = req.query.email;
    const loginToken = req.query.loginToken;

    if (email) {
        const attemptToken = await startLoginAttempt(email as string);
        if (attemptToken) {
            return res.status(200).json(attemptToken);
        } else {
            return res.status(403).send();
        }
    } else if (loginToken) {
        const newJwt = finishLoginAttempt(loginToken as string);
        if (newJwt) {
            return res.status(200).json({ newJwt: newJwt });
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send();
    }
});

router.post('/gamebus/callback', (req: Request, res: Response) => {
    // This is now provided in the request URL as queries
    const playerId = req.query.player_id as string;
    const accessToken = req.query.access_token as string;
    const refreshToken = req.query.refresh_token as string;

    if (playerId && accessToken && refreshToken) {
        const registered = registerConnectCallback(playerId, accessToken, refreshToken);
        if (registered) {
            return res.status(200).send();
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send(); // Bad request
    }
});

module.exports = router;
