require('dotenv').config({ path: __dirname.split('\\').slice(0, -1).join('\\') + '\\.env' });
const express = require('express');
const errorhandler = require('errorhandler');
const cors = require('cors');
import winston from 'winston';
import expressWinston from 'express-winston';

const isProduction = process.env.NODE_ENV === 'production';

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

// TODO: cors might not be needed
app.use(cors());
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
