import { Router, Request, Response } from 'express';
import { finishLoginAttempt, registerConnectCallback, startLoginAttempt } from '../utils/authUtils';

const router = Router();

router.get('/login', async(req: Request, res: Response) => {
    let email = req.query.email;
    let loginToken = req.query.loginToken;

    if (email) {
        let attemptToken = await startLoginAttempt(email as string);
        if (attemptToken) {
            return res.status(200).json(attemptToken);
        } else {
            return res.status(403).send();
        }
    } else if (loginToken) {
        let jwt = finishLoginAttempt(loginToken as string);
        if (jwt) {
            return res.status(200).send(jwt);
        } else {
            return res.status(403).send();
        }
    }
});

router.post('/gamebus/callback', (req: Request, res: Response) => {
    // This is now provided in the request URL as queries
    let playerId = req.query.player_id as string;
    let accessToken = req.query.access_token as string;
    let refreshToken = req.query.refresh_token as string;

    if (playerId && accessToken && refreshToken) {
        let registered = registerConnectCallback(playerId, accessToken, refreshToken);
        if (registered) {
            return res.status(200).send();
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(400).send(); // Bad request
    }
});

// TODO: add DELETE endpoint on Disconnect URL (/gamebus/disconnect)

module.exports = router;
