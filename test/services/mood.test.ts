import { MoodModel } from '../../src/gb/models/moodModel';
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
