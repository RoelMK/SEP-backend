import { Router, Request, Response } from 'express';
import { finishLoginAttempt, registerConnectCallback, startLoginAttempt } from '../utils/authUtils';

const router = Router();

/**
 * Get endpoint for logging into the Diabetter dashboard
 * and into GameBus
 * Query parameters:
 * email GameBus email of the user that wants to log in
 * loginToken generated token to keep track of the login process
 */
router.get('/login', async (req: Request, res: Response) => {
    const email = req.query.email;
    const loginToken = req.query.loginToken;

    if (email) {
        // when an email is specified, the login process is started
        const attemptToken = await startLoginAttempt(email as string);
        if (attemptToken) {
            return res.status(200).json(attemptToken);
        } else {
            return res.status(403).send();
        }
    } else if (loginToken) {
        // when a loginToken is specfied the login process is finalized
        // under valid circumstances (i.e. login completed through GameBus)
        const newJwt = finishLoginAttempt(loginToken as string);
        if (newJwt) {
            return res.status(200).json({ newJwt: newJwt });
        } else {
            return res.status(403).send();
        }
    } else {
        // If login fails -> 400
        return res.status(400).send();
    }
});

/**
 * Post endpoint for handling redirects from GameBus
 * Query parameters:
 * player_id unique identifyer for a GameBus user
 * access_token token to gain access to GameBus
 * refresh_token token to refresh expired access token
 */
router.post('/gamebus/callback', (req: Request, res: Response) => {
    // This is now provided in the request URL as queries
    const playerId = req.query.player_id as string;
    const accessToken = req.query.access_token as string;
    const refreshToken = req.query.refresh_token as string;

    if (playerId && accessToken && refreshToken) {
        // if all necessary user info is present, register the info
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
