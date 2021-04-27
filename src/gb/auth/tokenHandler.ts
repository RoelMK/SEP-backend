import { GameBusClient } from '../GameBusClient';

/**
 * Token handler that can retrieve and refresh tokens if needed
 */
export class TokenHandler {
    private gamebusToken?: string;
    // The Ready promise is needed if we are going to asynchronously retrieve tokens
    Ready: Promise<any>;

    /**
     * A token handler is made with the gamebus client and (for now) a token
     * @param gamebus GameBusClient
     * @param token Gamebus token
     */
    constructor(private readonly gamebus: GameBusClient, private readonly token: string) {
        this.gamebusToken = token;
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
        if (!this.gamebusToken) {
            this.gamebusToken = await this.login();
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
    getToken(): string {
        // TODO: check validity of token before returning it
        return this.gamebusToken!;
    }
}
