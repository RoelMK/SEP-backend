import { GameBusClient } from "../gb/gbClient";
import { ExerciseModel } from "../gb/models/exerciseModel";
import { FoodModel } from "../gb/models/foodModel";
import { ActivityGETData } from "../gb/models/gamebusModel";
import { GlucoseModel } from "../gb/models/glucoseModel";
import { InsulinModel } from "../gb/models/insulinModel";
import { MoodModel } from "../gb/models/moodModel";
import { ExerciseGameDescriptorNames } from "../gb/objects/exercise";
import { Insulin } from "../gb/objects/insulin";
import { Mood } from "../gb/objects/mood";
import { DateSlice } from "./utils/dates";

export class DataEndpoint {
    private readonly dataTypes: DataType[];

    constructor(
        private readonly gbClient: GameBusClient, 
        private readonly playerId: number,
        dataTypes: string[], 
        private readonly parameters: EndpointParameters) {
            this.dataTypes = parseDataTypes(dataTypes);
    }

    async retrieveData(dateSlice: DateSlice): Promise<EndpointData> {
        const data: EndpointData = {};
        for (let i = 0; i < this.dataTypes.length; i++) {
            if (this.dataTypes[i] === DataType.EXERCISE) {
                data.exercise = await this.retrieveExerciseData(dateSlice);
            } else if (this.dataTypes[i] === DataType.GLUCOSE) {
                data.glucose = await this.retrieveGlucoseData(dateSlice);
            } else if (this.dataTypes[i] === DataType.INSULIN) {
                data.insulin = await this.retrieveInsulinData(dateSlice);
            } else if (this.dataTypes[i] === DataType.MOOD) {
                data.mood = await this.retrieveMoodData(dateSlice);
            } else if (this.dataTypes[i] === DataType.FOOD) {
                data.food = await this.retrieveFoodData(dateSlice);
            }
        }
        return data;
    }

    private async retrieveExerciseData(dateSlice: DateSlice): Promise<ExerciseModel[]> {
        if (this.parameters.exerciseTypes) {
            return await this.gbClient
                .exercise()
                .getExerciseActivityFromGdBetweenUnix(this.playerId, this.parameters.exerciseTypes, dateSlice.startDate.getTime(), dateSlice.endDate.getTime());
        } else {
            return [];
        }
    }

    private async retrieveGlucoseData(dateSlice: DateSlice): Promise<GlucoseModel[]> {
        return await this.gbClient
            .glucose()
            .getGlucoseActivitiesBetweenUnix(this.playerId, dateSlice.startDate.getTime(), dateSlice.endDate.getTime());
    }

    private async retrieveInsulinData(dateSlice: DateSlice): Promise<InsulinModel[]> {
        return Insulin.convertResponseToInsulinModels(await this.gbClient
            .insulin()
            .getInsulinActivitiesBetweenUnix(this.playerId, dateSlice.startDate.getTime(), dateSlice.endDate.getTime()));
    }

    private async retrieveMoodData(dateSlice: DateSlice): Promise<MoodModel[]> { 
        return Mood.convertResponseToMoodModels(await this.gbClient
            .mood()
            .getMoodActivitiesBetweenUnix(this.playerId, dateSlice.startDate.getTime(), dateSlice.endDate.getTime()));
    }

    private async retrieveFoodData(dateSlice: DateSlice): Promise<FoodModel[]> {
        return await this.gbClient
            .food()
            .getFoodActivitiesBetweenUnix(this.playerId, dateSlice.startDate.getTime(), dateSlice.endDate.getTime());
    }

}

export interface EndpointData {
    glucose?: GlucoseModel[];
    exercise?: ExerciseModel[];
    insulin?: InsulinModel[];
    mood?: MoodModel[];
    food?: FoodModel[];
}

export interface EndpointParameters {
    exerciseTypes?: ExerciseGameDescriptorNames[];
}

function parseDataTypes(dataTypes: string[]): DataType[] {
    const types: DataType[] = [];
    for (let i = 0; i < dataTypes.length; i++) {
        const type = DataType[dataTypes[i].toUpperCase().trim()];
        if (type !== undefined && !types.includes(type)) {
            types.push(type)
        }
    }
    return types;
}

export function parseExerciseTypes(gds: string): ExerciseGameDescriptorNames[] {
    // First split the list intro strings
    const sep = gds.split(',');
    const result: ExerciseGameDescriptorNames[] = [];
    // Check if the game descriptors are valid (if they exist)
    for (let i = 0; i < sep.length; i++) {
        const type = ExerciseGameDescriptorNames[sep[i].toUpperCase().trim()];
        if (type && !result.includes(type)) {
            result.push(type)
        }
    }

    // Return all game descriptors that exist
    return result;
};

enum DataType {
    GLUCOSE,
    INSULIN,
    MOOD,
    FOOD,
    EXERCISE
}
