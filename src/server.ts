/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import express from 'express';
const errorhandler = require('errorhandler');
const cors = require('cors');
import winston from 'winston';
import expressWinston from 'express-winston';
import { DBClient } from './db/dbClient';

const isProduction = process.env.NODE_ENV === 'production';

// Initialize database
const dbClient: DBClient = new DBClient();
dbClient.initialize();
dbClient.close();

// Create app object
const app = express();
let port = 8080;
if (process.env.PORT) {
    port = Number(process.env.PORT);
}

// // This is so you can see every incoming request (from GameBus) in console
// app.use(
//     expressWinston.logger({
//         transports: [new winston.transports.Console()],
//         format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint())
//     })
// );

app.use(express.json());
app.use(cors());

// ---- Do not add routes above this line! ----
app.use(require('./routes'));
if (!isProduction) {
    app.use(errorhandler());
}

// Launch
export const server = app.listen(port, () => {
    console.log('Listening on port ' + port + ' http://localhost:8080');
});
