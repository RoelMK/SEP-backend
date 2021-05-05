import Database from "better-sqlite3";
import { UserModel } from "../models/userModel";


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
        this.db.exec("CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, token TEXT NOT NULL);")
    }

    /**
     * Gets a token from the database.
     * @param userId User to get token for
     * @returns Token or undefined if not found / error occurred
     */
    getToken(userId: string): string | undefined {
        try {
            const userRow = this.db.prepare('SELECT token FROM users WHERE user_id=?').get(userId);
            if (userRow) {
                return userRow.token;
            } else {
                return undefined;
            }
        } catch(e) {
            return undefined;
        }
    }

    /**
     * Adds a new token to the database.
     * @param user User data to add
     * @returns If token was set successfully
     */
    setToken(user: UserModel): boolean {
        try {
            const stmt = this.db.prepare('INSERT OR REPLACE INTO users(user_id, token) VALUES(?, ?)');
            stmt.run(user.userId, user.gamebusToken);
            return true;
        } catch(e) {
            return false;
        }
        
    }

    /**
     * Removes a token from the database.
     * @param userId User to remove
     * @returns If token was removed successfully
     */
    removeToken(userId: string): boolean {
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