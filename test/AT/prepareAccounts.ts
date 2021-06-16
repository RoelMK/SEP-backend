import { GameBusToken, TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import AbbottParser from '../../src/services/dataParsers/abbottParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import { flush } from '../../src/utils/flush';
import { addMoods } from './prepareMoods';

class AccountPreparation {
    constructor(private gbAccessToken: string, private playerId: string) {}

    cleanUpAccount() {
        const gbClient: GameBusClient = new GameBusClient(
            new TokenHandler(this.gbAccessToken, '', this.playerId)
        );
        console.log(this.playerId + ':' + this.gbAccessToken);
        flush(gbClient, parseInt(this.playerId));
    }

    async fillAccount() {
        await addMoods(this.gbAccessToken, this.playerId);
        console.log('mood done');
        await this.addGlucoseInsulin();
        console.log('glucose done');
        await this.addFood();
        console.log('food done');
    }

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
}

const prep: AccountPreparation = new AccountPreparation(
    '00867a4a-5818-4f6f-80c8-74777a04a5cb',
    '601'
);
//prep.cleanUpAccount();
prep.fillAccount();
