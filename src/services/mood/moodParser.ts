import { TokenHandler } from '../../gb/auth/tokenHandler';
import { GameBusClient } from '../../gb/gbClient';
import { MoodModel } from '../../gb/models/moodModel';
import { DiabetterUserInfo } from '../dataParsers/dataParser';
import { ModelParser } from '../modelParser';
//import { ModelParser } from '../modelParser';

export default class MoodParser extends ModelParser {
    // Mood data to be exported
    mood?: MoodModel;

    /**
     * Create mood parser that makes sure mood data to reach Gamebus
     * @param moodInput mood input from front end
     */
    constructor(
        private readonly moodInput: MoodModel[],
        userInfo: DiabetterUserInfo
    ) {
        // only processing newest is not necessary for moods, since it is only given via the dashboard
        super(userInfo, false);
        // Maybe process if needed in the future
        this.process();
        this.post();
    }

    /**
     * Processes the data (if necessary) and maps it to MoodModel
     */
    private process(): void {
        // TODO: process if needed
    }

    /**
     * Posts mood data to GameBus
     */
    async post(): Promise<void> {
        if (this.moodInput && this.moodInput.length > 0)
            this.gbClient
                .mood()
                .postMultipleMoodActivities(this.moodInput, this.userInfo.playerId);
    }
}
