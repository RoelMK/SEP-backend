import { MoodModel } from '../../gb/models/moodModel';
import { ModelParser } from '../modelParser';

export default class MoodParser { // TODO should it extend ModelParser? It does not really make use of its functions
    // Mood data to be exported
    mood?: MoodModel;

    /**
     * Create mood parser that makes sure mood data to reach Gamebus
     * @param moodInput mood input from front end
     */
    constructor(private readonly moodInput: MoodModel) {
        // Maybe process if needed in the future
        this.process();
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
        // TODO: post mood data to GameBus
    }
}
