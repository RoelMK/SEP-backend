import { GameBusClient } from '../gbClient';
import { verify } from 'jsonwebtoken';
import { DecodedJWT } from '../../utils/authUtils';

/**
 * Token handler that can retrieve and refresh tokens if needed
 */
export class TokenHandler {
    // The Ready promise is needed if we are going to asynchronously retrieve tokens
    Ready: Promise<any>;

    /**
     * A token handler is made with the gamebus client and (for now) a token
     * @param gamebus GameBusClient
     * @param JWT JWT generated from GameBus connection
     */
    constructor(private readonly gamebus: GameBusClient, private readonly JWT: string) {
        this.Ready = new Promise((resolve, reject) => {
            this.generateToken()
                .then(() => {
                    resolve(undefined);
                })
                .catch(reject);
        });
    }

    /**
     * Method that should generate a (new) token if there is no token yet
     * TODO: not sure if this is needed anymore, since we'll always have a token
     */
    private async generateToken(): Promise<void> {}

    /**
     * Method that should be able to retrieve a new token (using JWT with refresh)
     * @returns Fresh token
     */
    private async login() {
        // TODO: add method to get a (new) token
        // TODO: if refresh is possible, add a method for that as well
        return '';
    }

    /**
     * Get method for current token
     * @returns Current token
     */
    getToken(): GameBusToken {
        // TODO: check validity of token before returning it
        // TODO: do we decode only when getToken() is called or do we also store a decoded token in the TokenHandler?
        // We must first decode the web token before returning it
        // TODO: private secret
        //const privateSecret = process.env.TOKEN_SECRET as string;
        const decoded = verify(this.JWT, 'test') as DecodedJWT;
        return {
            playerId: parseInt(decoded.playerId), 
            accessToken: decoded.accessToken
        } as GameBusToken;
    }
}

/**
 * Token that is used for actually authenticating GameBus requests (from decoded JWT)
 */
export interface GameBusToken {
    playerId: number;
    accessToken: string;
}
