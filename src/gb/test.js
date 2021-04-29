"use strict";
exports.__esModule = true;
// Example file on how to use this setup
/*
import { GameBusClient } from './GameBusClient';
// Make sure you have a (valid) API token in .env.local
require('dotenv').config({ path: './env.local' });
const token = process.env.TEST_TOKEN;

async function main() {
    const gamebus = new GameBusClient(true, token);
    const activity = await gamebus.activity().getActivityById(0);
    console.log(JSON.stringify(activity));
}

main();
*/
var https = require("https");
var fetch = require('node-fetch');
var axios = require('axios');
var usersExport_1 = require("./usersExport");
var GamebusClient_1 = require("./GamebusClient");
var lodash_1 = require("lodash");
var GameBusClient_1 = require("./GameBusClient");
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
    return lodash_1.transform(object, function (result, value, key) {
        if (!lodash_1.isEqual(value, base[key])) {
            result[key] = lodash_1.isObject(value) && lodash_1.isObject(base[key]) ? difference(value, base[key]) : value;
        }
    });
}
var kevin = usersExport_1.userKevin;
var kevin2 = usersExport_1.userKevin2;
var x = {
    "gameDescriptorTK": "WALK",
    "dataProviderName": "Google Fit",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Black_x.svg/525px-Black_x.svg.png",
    "date": 1619355003,
    "miniGameUse": null,
    "propertyInstances": [
        {
            "propertyTK": "DISTANCE",
            "value": 41
        },
        {
            "propertyTK": "DURATION",
            "value": 42
        },
        {
            "propertyTK": "KCALORIES",
            "value": 43
        },
    ],
    "players": [kevin.playerID]
};
var y = {
    "gameDescriptorTK": "WALK",
    "dataProviderName": "Google Fit",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Black_x.svg/525px-Black_x.svg.png",
    "date": 1619355003,
    "propertyInstances": [{
            "propertyTK": "STEPS",
            "value": 42
        }],
    "players": [usersExport_1.userKevin.playerID]
};
var z = {
    "gameDescriptorTK": "WALK",
    "dataProviderName": "Google Fit",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Black_x.svg/525px-Black_x.svg.png",
    "date": 1619355003,
    "propertyInstances": [{
            "propertyTK": "STEPS",
            "value": 42
        }],
    "players": [usersExport_1.userKevin.playerID]
};
var a = {
    activity: x
};
//testGamebarGetActivities(kevin,data => console.log("done"))
//testGamebarGetSingleActivity(26940,kevin,data => console.log(data))
//testGamebarGetSingleUser(kevin,data=>console.log(data))//TODO: nullpointer
//testGamebarGetSinglePlayer(kevin,data=>console.log(data))
//testGamebarPostActivity(x,kevin,(data:any) => console.log(data))
function testHttps() {
    var options = {
        hostname: 'yurakidb.web.app',
        //hostname: '8.8.8.8',
        //port: 443,
        //path: '/',
        method: 'GET'
    };
    console.log("Looking for " + options.hostname);
    console.log();
    var req = https.request(options, function (res) {
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            process.stdout.write(d);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
function testGamebarGetActivities(user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/players/' + user.playerID + '/activities',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
function testGamebarGetSingleActivity(activityID, user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/activities/' + activityID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//TODO: disfunctional!! (nullpointer), TODO: remove any from onComplete
function testGamebarGetSingleUser(user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/users/' + user.userID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//TODO remove any from onComplete
function testGamebarGetSinglePlayer(user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/players/' + user.playerID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//TODO remove any from onComplete
function testGamebarPostActivity(activity, user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/me/activities',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + user.authToken,
            'Content-Type': 'application/json'
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        console.log("statusMessage: " + res.statusMessage);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log("Succes");
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.log("Error");
        console.error(error);
        console.error(error.name);
        console.error(error.message);
    });
    req.write(JSON.stringify(activity));
    req.end();
}
function testGamebarGetProvider(providerID, user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/players/' + user.playerID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//fetch("https://api3.gamebus.eu/v2/players/524/activities?end=30-04-2021&limit=30&sort=-date&excludedGds=", {
//  "headers": {
//    "accept": "application/json, text/plain, */*",
//    "accept-language": "en-US,en;q=0.9,nl-NL;q=0.8,nl;q=0.7",
//    "authorization": "Bearer 436a116e-6814-409a-8afc-0be7a2e34711",
//    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
//    "sec-ch-ua-mobile": "?0",
//    "sec-fetch-dest": "empty",
//    "sec-fetch-mode": "cors",
//    "sec-fetch-site": "same-site"
//  },
//  "referrer": "https://app3.gamebus.eu/",
//  "referrerPolicy": "strict-origin-when-cross-origin",
//  "body": null,
//  "method": "GET",
//  "mode": "cors"
//}).then(res => res.json()).then(json => console.log(json));
//fetch("https://api3.gamebus.eu/v2/players/524/activities?start=25-04-2021&end=30-04-2021&limit=30&sort=-date&excludedGds=", {
//  "headers": {
//    "accept": "application/json, text/plain, */*",
//    "authorization": "Bearer 436a116e-6814-409a-8afc-0be7a2e34711",
//  },
//  "body": null,
//  "method": "GET",
//}).then(res => res.json()).then(json => console.log(json));
//testGamebarGetLimitedActivities('25-04-2021','30-04-2021',30,kevin,(data:any)=>console.log(data))
//IMPORTANT: date in dd-mm-yyyy string format! NOT UNIX TIMESTAMP
//Not sure how limit works, whether it takes top x, bottom x or random x
function testGamebarGetLimitedActivities(startDate, endDate, limit, user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/players/' + user.playerID + '/activities?start=' + startDate + '&end=' + endDate + '&limit=' + limit + '&sort=-date',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
var client = new GameBusClient_1.GameBusClient(true, kevin.authToken);
function testClientGetAllActs(client, playerID) {
    var path = '/v2/players/' + playerID + '/activities';
    var method = GamebusClient_1.requestMethod.GET;
    var body = "";
    var headers = undefined;
    var query = undefined;
    client.request(path, method, body, headers, query, true, false).then(function (value) { return console.log(value); })["catch"](function (error) { return console.log(error); });
}
testClientGetAllActs(client, kevin.playerID);
