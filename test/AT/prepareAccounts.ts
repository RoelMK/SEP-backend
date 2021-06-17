//import { DBClient } from '../../src/db/dbClient';
import { GameBusToken, TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import AbbottParser from '../../src/services/dataParsers/abbottParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import { disconnectDataProvider, flushActivities, flushDB } from '../../src/utils/flush';
//import { request } from '../../src/utils/supervisorUtils';
import { addMoods } from './prepareMoods';

class AccountPreparation {
    constructor(private gbAccessToken: string, private playerId: string) {
        console.log(`Preparing account ${this.playerId}`);
    }

    /**
     * Prepares the current user for the ATP
     */
    async prepare(doDisconnect: boolean) {
        await this.cleanUpAccount();
        await this.fillAccount();
        if (doDisconnect) await this.prepareEnvironment();
    }

    /**
     * Clears all data from an account
     */
    async cleanUpAccount() {
        const gbClient: GameBusClient = new GameBusClient(
            new TokenHandler(this.gbAccessToken, '', this.playerId)
        );
        await flushActivities(gbClient, parseInt(this.playerId));
    }

    /**
     * Fills a test account with relevant data
     * Needs to be connected to the dataprovider
     */
    async fillAccount() {
        // flush db to ensure all data is uploaded
        flushDB();

        // add data
        try {
            // TODO: check dates sent in backend-discussion to make sure the data is on the correct dates
            await addMoods(this.gbAccessToken, this.playerId);
            console.log('mood added to the profile');
            // TODO: addExercises
            await this.addGlucoseInsulin();
            console.log('glucose and insulin added to the profile');
            await this.addFood();
            console.log('food added to the profile');
        } catch (e) {
            console.log(e.message);
            console.log(
                'You have entered invalid credentials OR did not connect to the data provider, please do so'
            );
        }
    }

    /**
     * Adds glucose and insulin to a test account
     */
    private async addGlucoseInsulin() {
        const userInfo: GameBusToken = {
            playerId: this.playerId,
            accessToken: this.gbAccessToken
        };
        await new AbbottParser(
            'test/AT/User-build_beforeAT/glucose_insulin_abott_AT.csv',
            userInfo
        ).process();
    }

    /**
     * Adds food to a test account
     */
    private async addFood() {
        const userInfo: GameBusToken = {
            playerId: this.playerId,
            accessToken: this.gbAccessToken
        };
        await new FoodDiaryParser(
            'test/AT/User-build_beforeAT/foodDiary_AT.xlsx',
            userInfo
        ).process();
    }

    /**
     * Empties the database before a test
     */
    async prepareEnvironment() {
        const gbClient: GameBusClient = new GameBusClient(
            new TokenHandler(this.gbAccessToken, '', this.playerId)
        );
        // flush db afterwards to make sure not only newest data is uploaded
        await flushDB();

        // disconnect the data provider for testing environment
        await disconnectDataProvider(gbClient, parseInt(this.playerId));
        console.log('Environment prepared - good to go!');
    }
}

/**
 * Prepares several users that are used for the AT
 * @param doDisconnect Whether to disconnect from the data provider (annoying to reconnect every time)
 */
async function prepareATPusers(doDisconnect: boolean) {
    const prepNormal: AccountPreparation = new AccountPreparation(
        '5e16bdbe-b2ce-45b2-a027-52d7cab0c94a',
        '600'
    );
    await prepNormal.prepare(doDisconnect);

    const prepSupervisor1: AccountPreparation = new AccountPreparation(
        '00867a4a-5818-4f6f-80c8-74777a04a5cb',
        '601'
    );
    await prepSupervisor1.prepare(doDisconnect);

    const prepSupervisor2: AccountPreparation = new AccountPreparation(
        '4eae250a-8691-4ebb-81e5-07f7feaacdd1',
        '603'
    );
    await prepSupervisor2.prepare(doDisconnect);
    //const dbClient: DBClient = new DBClient();
    // dbClient.initialize();
    // dbClient.confirmSupervisor('atp@supervisor.nl', 'atp@user.nl');
    // dbClient.requestSupervisor('atp@supervisor2.nl', 'atp@user.nl');
    // request('atp@supervisor.nl', 'atp@user.nl', false);
    // request('atp@supervisor2.nl', 'atp@user.nl', true);
    // dbClient.close();
}

// make sure to be connected to the dataprovider BEFORE doing this
// afterwards you are automatically disconnected
prepareATPusers(false);
