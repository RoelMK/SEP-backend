import Database from 'better-sqlite3';

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
        this.db.exec(
            // eslint-disable-next-line max-len
            'CREATE TABLE IF NOT EXISTS login_attempts (player_id TEXT PRIMARY KEY, login_token TEXT NOT NULL, expire_time DATETIME NOT NULL, access_token TEXT, refresh_token TEXT);'
        );

        this.db.exec(
            'CREATE TABLE IF NOT EXISTS file_parse_events (player_id TEXT, file_name TEXT NOT NULL, time_stamp bigint NOT NULL, primary key (player_id, file_name));'
        );
    }

    /**
     * Removes all entries from the database.
     */
    reset(): void {
        this.db.exec(
            'DROP TABLE IF EXISTS login_attempts; DROP TABLE IF EXISTS file_parse_events;'
        );
        this.initialize();
    }

    /**
     * Removes all login attempts which have invalidated.
     * @returns If cleaning attempt succeeded
     */
    cleanLoginAttempts(): boolean {
        try {
            const stmt = this.db.prepare('DELETE FROM login_attempts WHERE ? > expire_time');
            stmt.run(new Date().toISOString());
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Removes a finished login attempt.
     * @param playerId Player id of attempt to remove
     * @returns If removal succeeded
     */
    removeFinishedLoginAttempt(playerId: string): boolean {
        try {
            const stmt = this.db.prepare('DELETE FROM login_attempts WHERE player_id=?');
            stmt.run(playerId);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Registers a new login attempt.
     * @param playerId Id of player
     * @param loginToken Token to set for attempt
     * @param expireTime When login token expires
     * @returns If attempt has been registered
     */
    registerLoginAttempt(playerId: string, loginToken: string, expireTime: Date): boolean {
        try {
            if (this.getLoginAttemptByPlayerId(playerId) === undefined) {
                // Only create new ones
                const stmt = this.db.prepare(
                    'INSERT OR REPLACE INTO login_attempts(player_id, login_token, expire_time) VALUES(?, ?, ?)'
                );
                stmt.run(playerId, loginToken, expireTime.toISOString());
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * Registers a callback from GameBus.
     * @param playerId Id of player
     * @param accessToken Access token in callback
     * @param refreshToken Refresh token in callback
     * @returns If callback has been registered
     */
    registerCallback(playerId: string, accessToken: string, refreshToken: string): boolean {
        try {
            if (this.getLoginAttemptByPlayerId(playerId)) {
                const stmt = this.db.prepare(
                    'UPDATE login_attempts SET access_token=?, refresh_token=? WHERE player_id=?'
                );
                stmt.run(accessToken, refreshToken, playerId);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * Tries to get a row from the database by login token.
     * @param loginToken Token to look for
     * @returns Row or undefined if nothing found
     */
    getLoginAttemptByLoginToken(loginToken: string): any {
        try {
            return this.db
                .prepare('SELECT * FROM login_attempts WHERE login_token=?')
                .get(loginToken);
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Tries to get a row from the database by player id.
     * @param loginToken Player id to look for
     * @returns Row or undefined if nothing found
     */
    getLoginAttemptByPlayerId(playerId: string): any {
        try {
            return this.db.prepare('SELECT * FROM login_attempts WHERE player_id=?').get(playerId);
        } catch (e) {
            return undefined;
        }
    }

    /**
    
     */

    /**
     * Every time a file is parsed, its file path or unique indicator (e.g. 'nightscout') and Unix timestamp
     * are added to the database. This data is used when the file is re-uploaded to prevent duplication of data.
     *
     * The funtion below adds an entry to the database stating the last parse time (time_stamp) for a certain file (file_name)
     * of a certain player (playerId)
     * @param playerId Id of player
     * @param file_name Name of file that is parsed
     * @param time_stamp time of last parsed entry
     * @returns
     */
    registerFileParse(playerId: string, file_name: string, timestamp: number): boolean {
        try {
            const insrt = this.db.prepare(
                `INSERT INTO file_parse_events (player_id, file_name, time_stamp) 
                                    VALUES(?, ?, ?) ON CONFLICT(player_id, file_name) DO UPDATE SET time_stamp=?`
            );
            insrt.run(playerId, file_name, timestamp, timestamp);
            return true;
        } catch (e) {
            return false;
        }
    }
    /**
     * Every time a file is parsed, its file path or unique indicator (e.g. 'nightscout') and Unix timestamp
     * are added to the database. This data is used when the file is re-uploaded to prevent duplication of data.
     * It fetches the last update of the file of the player.
     * @param playerId ID of player
     * @param file_name Name of file that is parsed
     * @returns Timestamp of last parse
     */
    getLastUpdate(playerId: string, file_name: string): number {
        try {
            const getLastParsed = this.db
                .prepare('SELECT * FROM file_parse_events WHERE player_id=? AND file_name=?')
                .get(playerId, file_name);
            return getLastParsed ? getLastParsed.time_stamp : 0;
        } catch (e) {
            return 0; // if an error occurs, pick the oldest timestamp
        }
    }

    /**
     * Throws out all entries in the file_parse_events table
     * Mainly used for testing purposes
     */
    cleanFileParseEvents() {
        try {
            const deleteAll = this.db.prepare('Delete from file_parse_events');
            deleteAll.run();
        } catch (e) {
            return undefined; // if an error occurs, return undefined
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
