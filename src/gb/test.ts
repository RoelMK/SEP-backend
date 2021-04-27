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

const https = require('https')

import * as i from './interfaces'

const {userKevin, userKevin2} = require('./usersExport')
let kevin : i.connectionData = userKevin;
let kevin2 : i.connectionData = userKevin2;

testGamebarGetActivities(kevin,data => console.log(data))
//testGamebarGetSingleActivity(26940,kevin,data => console.log(data))
//testGamebarGetSingleUser(kevin,data=>console.log(data))//TODO: nullpointer
//testGamebarGetSinglePlayer(kevin,data=>console.log(data))



function testHttps () { //yurakiDB
  const options = {
      hostname : 'yurakidb.web.app',
      //hostname: '8.8.8.8',
      //port: 443,
      //path: '/',
      method: 'GET'
    }
    
    console.log("Looking for " + options.hostname)
    console.log()
    
    const req = https.request(options, (res:any) => {
      console.log(`statusCode: ${res.statusCode}`)
    
      res.on('data', (d:string) => {
        process.stdout.write(d)
      })
    })
    
    req.on('error', (error:any) => {
      console.error(error)
    })
    
    req.end()
}
function testGamebarGetActivities(user:i.connectionData, onComplete:((data: i.activityGETData[])=> void)) : void {
  const options = {
      hostname : 'api3.gamebus.eu',
      path: '/v2/players/'+user.playerID+'/activities', 
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + user.authToken
      }
  }
  
  console.log("Looking for " + options.hostname + options.path)    
  const req = https.request(options, (res:any) => {
      let data = '';
      let counter = 0;
      console.log(`statusCode: ${res.statusCode}`)
  
      res.on('data', (d:string) => {
          data = data + d;
          counter++;

          console.log("Chunk number: " + counter)
      })
      res.on('end', () => {
          console.log()
          let x :i.activityGETData[] = JSON.parse(data)
          onComplete(x)
      })
  })
  
  req.on('error', (error:any) => {
      console.error(error)
  })
  
  req.end()
}

function testGamebarGetSingleActivity(activityID:number, user:i.connectionData, onComplete:((data: i.activityGETData)=> void)) {
  const options = {
      hostname : 'api3.gamebus.eu',
      path: '/v2/activities/'+activityID, 
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + user.authToken
      }
  }
  
  console.log("Looking for " + options.hostname + options.path)    
  const req = https.request(options, (res:any) => {
      let data = '';
      let counter = 0;
      console.log(`statusCode: ${res.statusCode}`)
  
      res.on('data', (d:string) => {
          data = data + d;
          counter++;

          console.log("Chunk number: " + counter)
      })
      res.on('end', () => {
          console.log()
          let x : i.activityGETData= JSON.parse(data)
          onComplete(x)
      })
  })
  
  req.on('error', (error:any) => {
      console.error(error)
  })
  
  req.end()
}

//TODO: disfunctional!! (nullpointer), TODO: remove any from onComplete
function testGamebarGetSingleUser(user:i.connectionData, onComplete:any) {
  const options = {
      hostname : 'api3.gamebus.eu',
      path: '/v2/users/'+user.userID, 
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + user.authToken
      }
  }
  
  console.log("Looking for " + options.hostname + options.path)    
  const req = https.request(options, (res:any) => {
      let data = '';
      let counter = 0;
      console.log(`statusCode: ${res.statusCode}`)
  
      res.on('data', (d:string) => {
          data = data + d;
          counter++;

          console.log("Chunk number: " + counter)
      })
      res.on('end', () => {
          console.log()
          let x = JSON.parse(data)
          onComplete(x)
      })
  })
  
  req.on('error', (error:any) => {
      console.error(error)
  })
  
  req.end()
}

//TODO remove any from onComplete
function testGamebarGetSinglePlayer(user:i.connectionData, onComplete:any) {
  const options = {
      hostname : 'api3.gamebus.eu',
      path: '/v2/players/'+user.playerID, 
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + user.authToken
      }
  }
  
  console.log("Looking for " + options.hostname + options.path)    
  const req = https.request(options, (res:any) => {
      let data = '';
      let counter = 0;
      console.log(`statusCode: ${res.statusCode}`)
  
      res.on('data', (d:string) => {
          data = data + d;
          counter++;

          console.log("Chunk number: " + counter)
      })
      res.on('end', () => {
          console.log()
          let x = JSON.parse(data)
          onComplete(x)
      })
  })
  
  req.on('error', (error:any) => {
      console.error(error)
  })
  
  req.end()
}

//TODO remove any from onComplete
function testGamebarPostActivity(activity:i.activityPOSTData, user:i.connectionData, onComplete:any) {
  const options = {
      hostname : 'api3.gamebus.eu',
      path: '/v2/me/activities', 
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + user.authToken,
          'Content-Type': 'application/json'
      },
  }
  console.log("Looking for " + options.hostname + options.path)    
  const req = https.request(options, (res:any) => {
      let data = '';
      let counter = 0;
      console.log(`statusCode: ${res.statusCode}`)
      console.log(`statusMessage: ${res.statusMessage}`)
      res.on('data', (d:string) => {
          data = data + d;
          counter++;

          console.log("Chunk number: " + counter)
      })
      res.on('end', () => {
          console.log("Succes")
          let x = JSON.parse(data)
          onComplete(x)
      })
  })
  req.on('error', (error:any) => {
      console.log("Error")
      console.error(error)
      console.error(error.name)
      console.error(error.message)
  })
  req.write(activity)
  req.end()
}