import { GameBusClient } from '../gbClient';
import { verify } from 'jsonwebtoken';
import { DecodedJWT } from '../../utils/authUtils';

/**
 * Token handler that can retrieve and refresh tokens if needed
 */
export class TokenHandler {
    // Decoded JWT
    private JWT?: string;
    // The Ready promise is needed if we are going to asynchronously retrieve tokens
    Ready: Promise<any>;

    /**
     * A token handler is made with the gamebus client and (for now) a token
     * @param gamebus GameBusClient
     * @param token JWT generated from GameBus connection
     */
    constructor(private readonly gamebus: GameBusClient, private readonly token: string) {
        this.JWT = token;
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
     */
    private async generateToken(): Promise<void> {
        if (!this.JWT) {
            this.JWT = await this.login();
        }
    }

    /**
     * Method that should be able to retrieve a new token
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
        const decoded = verify(this.JWT!, 'test') as DecodedJWT;
        return {
            userId: parseInt(decoded.userId),
            accessToken: decoded.accessToken
        } as GameBusToken;
    }
}

/**
 * Token that is used for actually authenticating GameBus requests (from decoded JWT)
 */
export interface GameBusToken {
    userId: number;
    accessToken: string;
}
