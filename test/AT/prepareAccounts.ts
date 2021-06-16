import { GameBusToken, TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import AbbottParser from '../../src/services/dataParsers/abbottParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import { disconnectDataProvider, flushActivities, flushDB } from '../../src/utils/flush';
import { addMoods } from './prepareMoods';

class AccountPreparation {
    constructor(private gbAccessToken: string, private playerId: string) {
        console.log(`Preparing account ${this.playerId}`);
    }

    /**
     * Clears all data from an account
     */
    cleanUpAccount() {
        const gbClient: GameBusClient = new GameBusClient(
            new TokenHandler(this.gbAccessToken, '', this.playerId)
        );
        flushActivities(gbClient, parseInt(this.playerId));
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
            await addMoods(this.gbAccessToken, this.playerId);
            console.log('mood added to the profile');
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
    prepareEnvironment() {
        const gbClient: GameBusClient = new GameBusClient(
            new TokenHandler(this.gbAccessToken, '', this.playerId)
        );
        // flush db afterwards to make sure not only newest data is uploaded
        flushDB();

        // disconnect the data provider for testing environment
        disconnectDataProvider(gbClient, parseInt(this.playerId));
        console.log('Environment prepared - good to go!');
    }
}

async function prepareTestUser(prep: AccountPreparation) {
    prep.cleanUpAccount();
    await prep.fillAccount();
    prep.prepareEnvironment();
}
const prep: AccountPreparation = new AccountPreparation(
    '00867a4a-5818-4f6f-80c8-74777a04a5cb',
    '601'
);

// make sure to be connected to the dataprovider BEFORE doing this
// afterwards you are automatically disconnected
prepareTestUser(prep);
