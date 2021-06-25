import { Activity, Challenge, Circle, User } from '.';
import { BMI } from './bmi';
import { Exercise } from './exercise';
import { Food } from './food';
import { Glucose } from './glucose';
import { Insulin } from './insulin';
import { Mood } from './mood';

/**
 * Helper class that creates and distributes different GameBus
 * objects
 */
export class GameBusObjects {
    readonly gamebusActivity: Activity;
    readonly gamebusExercise: Exercise;
    readonly gamebusFood: Food;
    readonly gamebusGlucose: Glucose;
    readonly gamebusInsulin: Insulin;
    readonly gamebusMood: Mood;
    readonly gamebusCircle: Circle;
    readonly gamebusChallenge: Challenge;
    readonly gamebusBMI: BMI;
    readonly gamebusUser: User;

    constructor(gbClient) {
        // Create necessary classes
        this.gamebusActivity = new Activity(gbClient, true);
        // Needed for Exercise (activity) retrieval
        this.gamebusExercise = new Exercise(this.gamebusActivity, true);
        // Needed for food posting and retrieval
        this.gamebusFood = new Food(this.gamebusActivity, true);
        // Needed for glucose level posting and retrieval
        this.gamebusGlucose = new Glucose(this.gamebusActivity, true);
        // Needed for insulin posting and retrieval
        this.gamebusInsulin = new Insulin(this.gamebusActivity, true);
        // Needed for mood posting
        this.gamebusMood = new Mood(this.gamebusActivity, true);
        // Needed for retrieving info about GameBus circles
        this.gamebusCircle = new Circle(gbClient, true);
        // Needed for creating challenges
        this.gamebusChallenge = new Challenge(gbClient, true);
        // Needed for posting and retrieving BMI related profile info
        this.gamebusBMI = new BMI(this.gamebusActivity, true);
        // Needed to perform actions and get info from users
        this.gamebusUser = new User(gbClient, true);
    }
}
