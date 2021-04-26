"use strict";
exports.__esModule = true;
var https = require('https');
function x_func(xObj) { console.log(xObj); }
var response = '{"b":"foo","c":"bar"}';
var obj = JSON.parse(response);
x_func(obj);
var temp = {
    id: 26940,
    date: 1618848682000,
    isManual: true,
    group: null,
    image: null,
    creator: {
        id: 524,
        user: { id: 516, firstName: 'kevin', lastName: 'dirksen', image: null }
    },
    player: {
        id: 524,
        user: { id: 516, firstName: 'kevin', lastName: 'dirksen', image: null }
    },
    gameDescriptor: {
        id: 1,
        translationKey: 'WALK',
        image: 'https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png',
        type: 'PHYSICAL',
        isAggregate: false
    },
    dataProvider: {
        id: 1,
        name: 'GameBus',
        image: 'https://api3.gamebus.eu/v2/uploads/public/brand/dp/GameBus.png',
        isConnected: false
    },
    propertyInstances: [
        { id: 69066, value: '6', property: [Object] },
        { id: 69067, value: '5', property: [Object] },
        { id: 69068, value: '5', property: [Object] }
    ],
    personalPoints: [],
    supports: [{ id: 82, date: 1618906191000, supporter: [Object] }]
};
//kevins credential (DON'T MISUSE!)
var activityID = 26940;
var onComplete = function (data) {
    console.log(data);
};
var newActivity = {
    "gameDescriptorTK": "WALK",
    "dataProviderName": "Duel Links",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Black_x.svg/525px-Black_x.svg.png",
    "date": 1619090468664,
    "propertyInstances": [{
            "propertyTK": "STEPS",
            "value": 200
        }],
    "players": [userKevin.userID]
};
/*
testGamebarGetSingleActivity(activityID,userKevin,((x:activityOutput) => {
  console.log(x)
  console.log(x.group)
}))
*/
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
