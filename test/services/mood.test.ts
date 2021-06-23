import { GameBusToken } from '../../src/gb/auth/tokenHandler';
import { MoodModel } from '../../src/gb/models/moodModel';
import MoodMapper from '../../src/services/mood/moodMapper';
import MoodParser from '../../src/services/mood/moodParser';
import { postMoodData } from '../testUtils/parseUtils';

/**
 * UTP: MEX - 1
 */
test('mood data processing', async () => {
    const moodInput: MoodModel = {
        timestamp: 0,
        arousal: 1,
        valence: 1
    };
    expect(await postMoodData(moodInput)).toBe(undefined);
});

/**
 * UTP: TODO
 * Moodparser is not used now, but this test ensures the template is correct
 */
test('mood from future other source', async () => {
    const dummyUserInfo: GameBusToken = {
        playerId: 'testing',
        accessToken: '12345',
        refreshToken: '67890'
    };

    const moodInput: MoodModel[] = [
        {
            timestamp: 0,
            arousal: 1,
            valence: 1
        }
    ];
    expect(await new MoodParser(moodInput, dummyUserInfo).mood).toStrictEqual({
        timestamp: 0,
        arousal: 1,
        valence: 1
    });
});

describe('Mood mapper', () => {
    /**
     * UTP: TODO
     */
    test('unsupported mood source', () => {
        new MoodMapper(); // test if class is error-free and can be created
        //TODO, finish when mood template is implemented in the future
        expect(true).toBeTruthy();
    });
});
