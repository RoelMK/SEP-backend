//require('dotenv').config({ path: __dirname.split('\\').slice( 0, -1 ).join('\\') + '\\.env' });
require('dotenv').config();
const express = require('express');
const errorhandler = require('errorhandler');
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
const port = 8080;

// This is so you can see every incoming request (from GameBus) in console
app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint())
    })
);

app.use(express.json());

// ---- Do not add routes above this line! ----
app.use(require('./routes'));
if (!isProduction) {
    app.use(errorhandler());
}

// Launch
const server = app.listen(port, () => {
    console.log('Listening on port ' + server.address().port);
});
