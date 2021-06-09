/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import express from 'express';
const errorhandler = require('errorhandler');
const cors = require('cors');
import winston from 'winston';
import expressWinston from 'express-winston';
import { DBClient } from './db/dbClient';
import bodyParser from 'body-parser';

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

// This is so you can see every incoming request (from GameBus) in console
app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint())
    })
);

// Needed for POST requests JSON body
// Ignore the deprecated warning: https://github.com/expressjs/body-parser/issues/428
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

// ---- Do not add routes above this line! ----
app.use(require('./routes'));
if (!isProduction) {
    app.use(errorhandler());
}

// Launch
export const server = app.listen(port, () => {
    console.log('Listening on port ' + port);
});
