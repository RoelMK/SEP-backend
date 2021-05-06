import Database from "better-sqlite3";


export class DBClient {
    private readonly db: Database.Database;

    /**
     * Constructs database client.
     * @param log Log database calls
     * @throws Will throw an error if database is invalid or undefined
     */
    constructor(log?: boolean) {
        if (log) {
            this.db = new Database(process.env.DATABASE as string, { verbose: console.log });
        } else {
            this.db = new Database(process.env.DATABASE as string);
        }
    }

    /**
     * Initializes the database. Only needs to be executed at the start of the server.
     * @throws Will throw an error if unable to initialize the database
     */
    initialize(): void {
        this.db.exec("CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, access_token TEXT NOT NULL, refresh_token TEXT);")
    }

    /**
     * Gets an access token from the database.
     * @param userId User to get access token for
     * @returns Access token or undefined if not found / error occurred
     */
    getAccessToken(userId: string): string | undefined {
        try {
            const userRow = this.db.prepare('SELECT access_token FROM users WHERE user_id=?').get(userId);
            if (userRow) {
                return userRow.access_token;
            } else {
                return undefined;
            }
        } catch(e) {
            return undefined;
        }
    }

    /**
     * Gets a refresh token from the database.
     * @param userId User to get refresh token for
     * @returns Refresh token or undefined if not found / error occurred
     */
     getRefreshToken(userId: string): string | undefined {
        try {
            const userRow = this.db.prepare('SELECT refresh_token FROM users WHERE user_id=?').get(userId);
            if (userRow) {
                return userRow.refresh_token;
            } else {
                return undefined;
            }
        } catch(e) {
            return undefined;
        }
    }

    /**
     * Adds a new user to the database or update the tokens for a user.
     * @param userId Id of user to set tokens for
     * @param accessToken Access token for user to set
     * @param refreshToken Refresh token for user to set
     * @returns If tokens were set successfully
     */
    setUser(userId: string, accessToken: string, refreshToken: string): boolean {
        try {
            const stmt = this.db.prepare('INSERT OR REPLACE INTO users(user_id, access_token, refresh_token) VALUES(?, ?, ?)');
            stmt.run(userId, accessToken, refreshToken);
            return true;
        } catch(e) {
            return false;
        }
        
    }

    /**
     * Removes a user from the database.
     * @param userId User to remove
     * @returns If user was removed successfully
     */
    removeUser(userId: string): boolean {
        try {
            const stmt = this.db.prepare('DELETE FROM users WHERE user_id=?');
            stmt.run(userId);
            return true;
        } catch(e) {
            return false;
        }
    }

    /**
     * Closes the database connection.
     * @throws Will throw an error if unable to close
     */
    close(): void {
        this.db.close();
    }
}