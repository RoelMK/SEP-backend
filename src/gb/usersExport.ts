import { ConnectionData } from './models/gamebusModel';

const dotenv = require('dotenv');
dotenv.config();

let kevinP: string = process.env.kevin_playerID ?? '0';
let kevinU: string = process.env.kevin_userID ?? '0';

let kevin2P: string = process.env.kevin2_playerID ?? '0';
let kevin2U: string = process.env.kevin2_userID ?? '0';

let oneDriveToken : string = process.env.kevin_onedrivetoken ?? "" //Needs to be refreshed often during testing: so login again and put the new token in .env

let userKevin : ConnectionData= {
    authToken : process.env.kevin_authtoken ?? "",
    playerID : parseInt(kevinP) ,
    userID : parseInt(kevinU)
}
let userKevin2 : ConnectionData = {
    authToken : process.env.kevin2_authtoken ?? "",
    playerID : parseInt(kevin2P) ,
    userID : parseInt(kevin2U) 
}

export {userKevin, userKevin2, oneDriveToken} ;
