import { MoodModel } from "../../gb/models/moodModel";

export default class MoodParser {
    // Mood data to be exported
    mood?: MoodModel;

    /**
     * Create mood parser that makes sure mood data to reach Gamebus
     * @param moodInput mood input from front end
     */
    constructor(
        private readonly moodInput: MoodModel,
    ) {
        // Maybe process if needed in the future
    }

    /**
     * Processes the data (if necessary) and maps it to MoodModel
     */
    private process() {
        // TODO: process if needed
    }

    /**
     * Posts mood data to GameBus
     */
    async post() {
        // TODO: post mood data to GameBus
    }
}