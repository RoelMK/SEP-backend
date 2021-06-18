require('dotenv').config();
import { GameBusToken, TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { FoodModel } from '../../src/gb/models/foodModel';
import { Keys } from '../../src/gb/objects/keys';
import AbbottParser from '../../src/services/dataParsers/abbottParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import { flushActivities, flushDB } from '../../src/utils/flush';
import { request } from '../../src/utils/supervisorUtils';
import { addExercises } from './prepareExercises';
import { addMoods } from './prepareMoods';

class AccountPreparation {
    constructor(private gbAccessToken: string, private playerId: string) {}

    /**
     * Prepares the current user for the ATP
     */
    async prepare() {
        console.log(`Preparing account ${this.playerId}`);
        await this.setupEmptyAccount();
        await this.fillAccount();
        await this.prepareEnvironmentForAT();
    }

    /**
     * Clears all data from an account
     */
    async setupEmptyAccount() {
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

        const gbClient = new GameBusClient(new TokenHandler(this.gbAccessToken, '', this.playerId));
        gbClient.user().connectDataProvider(parseInt(this.playerId), Keys.dataProviderId);
        gbClient.user().connectDataProvider(parseInt(this.playerId), Keys.gbDataProviderId);

        // add data
        try {
            // TODO: check dates sent in backend-discussion to make sure the data is on the correct dates
            addMoods(this.gbAccessToken, this.playerId);
            console.log('mood added to the profile');

            addExercises(this.gbAccessToken, this.playerId);
            console.log('exercise added to the profile');

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

        const gbClient = new GameBusClient(new TokenHandler(this.gbAccessToken, '', this.playerId));
        const calorieFoods: FoodModel[] = [
            {
                timestamp: parseDate(
                    '18-06-2021 14:15',
                    DateFormat.ENDPOINT_DATETIME,
                    new Date(),
                    true
                ) as number,
                description: 'Worstenbroodje',
                carbohydrates: 60,
                glycemic_index: 75,
                calories: 600
            },
            {
                timestamp: parseDate(
                    '18-06-2021 14:00',
                    DateFormat.ENDPOINT_DATETIME,
                    new Date(),
                    true
                ) as number,
                description: 'Milk',
                carbohydrates: 15,
                glycemic_index: 37,
                calories: 250
            }
        ];
        await gbClient.food().postMultipleFoodActivities(calorieFoods, parseInt(this.playerId));
    }

    /**
     * Empties the database before a test
     */
    async prepareEnvironmentForAT() {
        const gbClient: GameBusClient = new GameBusClient(
            new TokenHandler(this.gbAccessToken, '', this.playerId)
        );
        // flush db afterwards to make sure not only newest data is uploaded
        await flushDB();

        // disconnect the data provider for testing environment
        console.log('Disconnecting data providers...');
        await gbClient.user().disconnectDataProvider(parseInt(this.playerId), Keys.dataProviderId);
        await gbClient
            .user()
            .disconnectDataProvider(parseInt(this.playerId), Keys.gbDataProviderId);
        console.log('Environment prepared - good to go!');
    }
}

/**
 * Prepares several users that are used for the AT
 * @param doDisconnect Whether to disconnect from the data provider (annoying to reconnect every time)
 */
async function prepareATPusers() {
    const prepNormal: AccountPreparation = new AccountPreparation(
        '049bcef0-48a1-4c10-9b9b-65d8932e0a5c',
        '600'
    );
    await prepNormal.prepare();

    const prepSupervisor: AccountPreparation = new AccountPreparation(
        '00867a4a-5818-4f6f-80c8-74777a04a5cb',
        '601'
    );
    await prepSupervisor.prepare();

    const prepSupervisor2: AccountPreparation = new AccountPreparation(
        '4eae250a-8691-4ebb-81e5-07f7feaacdd1',
        '603'
    );
    await prepSupervisor2.prepare();

    request('atp@supervisor.nl', 'atp@user.nl', false);
    request('atp@supervisor2.nl', 'atp@user.nl', true);
}

// make sure to be connected to the dataprovider BEFORE doing this
// afterwards you are automatically disconnected
prepareATPusers();
