import { Router, Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/userModel';
import { connectUser, disconnectUser, getUserStatus } from '../utils/authUtils';

const router = Router();

router.get('/connect', (req: Request, res: Response) => { 
    let userModel: UserModel | undefined = parseUserModel(req);

    if (userModel) {
        let connected: boolean = connectUser(userModel as UserModel);
        if (connected) {
            // TODO: give jwt
            return res.status(200).send();      // OK
        } else {
            return res.status(403).send();      // Forbidden
        }
        
    } else {
        return res.status(400).send();      // Bad request
    }   
});

router.get('/disconnect', (req: Request, res: Response, next: NextFunction) => {
    let userModel: UserModel | undefined = parseUserModel(req);

    if (userModel) {
        let disconnected: boolean = disconnectUser(userModel as UserModel);
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
    let userModel: UserModel | undefined = parseUserModel(req);

    if (userModel) {
        return res.status(200).json({"status": getUserStatus(userModel as UserModel)});     // TODO: how to specify the status?
    } else {
        return res.status(400).send();      // Bad request
    }   
});

/**
 * Parses the user model from a request query.
 * @param req Request to get user model from
 * @returns The parsed user model if available, else undefined
 */
function parseUserModel(req: Request): UserModel | undefined {
    let userId: string = req.query.userId as string;
    let gamebusToken: string = req.query.gamebusToken as string;
    if (userId && gamebusToken) {
        return {
            userId: userId,
            gamebusToken: gamebusToken
        };
    } else {
        return undefined;
    }
}

module.exports = router;