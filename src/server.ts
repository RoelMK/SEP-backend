require('dotenv').config({ path: __dirname.split('\\').slice(0, -1).join('\\') + '\\.env.local' });
const express = require('express');
const errorhandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';

// Create app object
const app = express();
const port = 8080;
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
