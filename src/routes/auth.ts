import { Router, Request, Response, NextFunction } from 'express';
import { connectUser, disconnectUser, generateToken, getUserStatus } from '../utils/authUtils';

const router = Router();

interface UserModel {
    userId: string,
    accessToken: string,
    refreshToken: string
}

router.get('/connect', (req: Request, res: Response) => { 
    let userModel: UserModel | undefined = parseUserModel(req);

    if (userModel) {
        let connected: boolean = connectUser(userModel.userId, userModel.accessToken, userModel.refreshToken); // TODO: request must be validated before connectUser call is made.
        if (connected) {
            let jwt: string = generateToken(userModel.userId);
            return res.status(200).send(jwt);      // TODO: how to send the token to the client?
        } else {
            return res.status(403).send();      // Forbidden
        }
        
    } else {
        return res.status(400).send();      // Bad request
    }   
});

router.get('/disconnect', (req: Request, res: Response, next: NextFunction) => {
    let userModel: UserModel | undefined = parseUserModel(req);     // TODO: validate source

    if (userModel) {
        let disconnected: boolean = disconnectUser(userModel.userId);
        if (disconnected) {
            return res.status(200).send();      // OK
        } else {
            return res.status(403).send();      // Forbidden
        }
        
    } else {
        return res.status(400).send();      // Bad request
    }   
});

router.get('/status', (req: Request, res: Response, next: NextFunction) => {
    let userId = req.body.player_id;

    if (userId) {
        return res.status(200).json({"status": getUserStatus(userId)});     // TODO: how to specify the status?
    } else {
        return res.status(400).send();      // Bad request
    }   
});

/**
 * Parses the user model from a request body (formatted as described in https://devdocs.gamebus.eu/).
 * @param req Request to get user model from
 * @returns The parsed user model if available, else undefined
 */
function parseUserModel(req: Request): UserModel | undefined {
    let userId: string = req.body.player_id as string;
    let accessToken: string = req.body.access_token as string;
    let refreshToken: string = req.body.refresh_token as string;
    if (userId && accessToken && refreshToken) {
        return {
            userId: userId,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    } else {
        return undefined;
    }
}

module.exports = router;