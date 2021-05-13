import { Router, Request, Response } from 'express';
import { createJWT, validateConnectRequest } from '../utils/authUtils';

const router = Router();

router.post('/gamebus/callback', (req: Request, res: Response) => {
    // This is now provided in the request URL as queries
    let userId = req.query.player_id as string;
    let accessToken = req.query.access_token as string;
    let refreshToken = req.query.refresh_token as string;

    if (userId && accessToken && refreshToken) {
        if (validateConnectRequest(userId, accessToken)) {
            let jwt: string = createJWT(userId, accessToken, refreshToken);
            //console.log(jwt);
            return res.status(200).json({ token: jwt }); // TODO: this token must be saved locally on the computer of the end-user.
        } else {
            return res.status(403).send(); // Invalid user id and/or token provided
        }
    } else {
        return res.status(400).send(); // Bad request
    }
});

// TODO: add DELETE endpoint on Disconnect URL (/gamebus/disconnect)

module.exports = router;
