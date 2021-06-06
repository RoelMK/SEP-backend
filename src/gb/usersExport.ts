import { ConnectionData } from './models/gamebusModel';

import dotenv from 'dotenv';
dotenv.config();

const kevinP: string = process.env.kevin_playerID ?? '0';
const kevinU: string = process.env.kevin_userID ?? '0';

const kevin2P: string = process.env.kevin2_playerID ?? '0';
const kevin2U: string = process.env.kevin2_userID ?? '0';

//Needs to be refreshed often during testing: so login again and put the new token in .env
const oneDriveToken: string = process.env.kevin_onedrivetoken ?? '';

const userKevin: ConnectionData = {
    authToken: process.env.kevin_authtoken ?? '',
    playerID: parseInt(kevinP),
    userID: parseInt(kevinU)
};
const userKevin2: ConnectionData = {
    authToken: process.env.kevin2_authtoken ?? '',
    playerID: parseInt(kevin2P),
    userID: parseInt(kevin2U)
};

export { userKevin, userKevin2, oneDriveToken };
