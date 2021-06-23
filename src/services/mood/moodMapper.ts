import { MoodModel } from '../../gb/models/moodModel';

/**
 * Helper class to map the different mood sources to 1 mood model
 */
export default class MoodMapper {
    /*TODO if needed*/
    // for now the only mood sources is our dashboard
    // for this no mapping needs to be performed
    /**
     * TODO maps mood data to mood models
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public static mapMood(): (entry: any) => MoodModel {
        return function (entry: MoodModel): MoodModel {
            return entry;
        };
    }
}
