import Database from "better-sqlite3";
import { UserModel } from "../models/userModel";


export class DBClient {
    private readonly db: Database.Database;

    constructor(log?: boolean) {
        if (log) {
            this.db = new Database(process.env.DATABASE as string, { verbose: console.log });
        } else {
            this.db = new Database(process.env.DATABASE as string);
        }
    }

    /**
     * Initializes the database. Only needs to be executed at the start of the server.
     */
    initialize(): void {
        this.db.exec("CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, token TEXT NOT NULL);")
    }

    /**
     * Gets a token from the database.
     * @param userId User to get token for
     * @returns Token or undefined if not found
     */
    getToken(userId: string): string | undefined {
        const userRow = this.db.prepare('SELECT token FROM users WHERE user_id=?').get(userId);
        if (userRow) {
            return userRow.token;
        } else {
            return undefined;
        }
    }

    /**
     * Adds a new token to the database.
     * @param user User data to add
     */
    setToken(user: UserModel): void {
        const stmt = this.db.prepare('INSERT OR REPLACE INTO users(user_id, token) VALUES(?, ?)');
        stmt.run(user.userId, user.gamebusToken);
    }

    /**
     * Removes a token from the database.
     * @param userId User to remove
     */
    removeToken(userId: string): void {
        const stmt = this.db.prepare('DELETE FROM users WHERE user_id=?');
        stmt.run(userId);
    }

    /**
     * Closes the database connection.
     */
    close(): void {
        this.db.close();
    }
}