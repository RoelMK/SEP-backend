import { Router, Request, Response } from 'express';
import { createJWT, validateConnectRequest } from '../utils/authUtils';

const router = Router();

router.post('/connect', (req: Request, res: Response) => {
    let userId = req.body.player_id;
    let accessToken = req.body.access_token;
    let refreshToken = req.body.refresh_token;

    if (userId && accessToken && refreshToken) {
        if (validateConnectRequest(userId, accessToken)) {
            let jwt: string = createJWT(userId, accessToken, refreshToken);
            return res.status(200).json({ token: jwt }); // TODO: this token must be saved locally on the computer of the end-user.
        } else {
            return res.status(403).send(); // Invalid user id and/or token provided
        }
    } else {
        return res.status(400).send(); // Bad request
    }
});

module.exports = router;
