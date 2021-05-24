import { MoodModel } from '../../src/gb/models/moodModel';
import { postMoodData } from './parseUtils';

test('mood data processing', async () => {
    const moodInput: MoodModel = {
        timestamp: 0,
        moodDescription: 'happy',
        moodValue: 1
    };
    expect(await postMoodData(moodInput)).toBe(undefined);
});
