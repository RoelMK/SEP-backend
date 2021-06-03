import { MoodModel } from '../../gb/models/moodModel';
import { ModelParser } from '../modelParser';

export default class MoodParser extends ModelParser{
    // Mood data to be exported
    mood?: MoodModel;

    /**
     * Create mood parser that makes sure mood data to reach Gamebus
     * @param moodInput mood input from front end
     */
    constructor(private readonly moodInput: MoodModel) {
        super();
        // Maybe process if needed in the future
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to MoodModel
     */
    private process(): void {
        // TODO: process if needed
        // retrieve the last time stamp in the glucoseData and set it as a threshold
        // to prevent double parsing in the future
        this.setNewestEntry([this.mood]);
    }

    /**
     * Posts mood data to GameBus
     */
    async post(): Promise<void> {
        // TODO: post mood data to GameBus
    }
}
