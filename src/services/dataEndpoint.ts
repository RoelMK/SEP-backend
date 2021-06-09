import { GameBusClient } from '../gb/gbClient';
import { ExerciseModel } from '../gb/models/exerciseModel';
import { FoodModel } from '../gb/models/foodModel';
import { GlucoseModel } from '../gb/models/glucoseModel';
import { InsulinModel } from '../gb/models/insulinModel';
import { MoodModel } from '../gb/models/moodModel';
import { ExerciseGameDescriptorNames } from '../gb/objects/exercise';
import { Insulin } from '../gb/objects/insulin';
import { Mood } from '../gb/objects/mood';
import { DateSlice } from './utils/dates';

export class DataEndpoint {
    private readonly dataTypes: DataType[]; // Data types to retrieve

    /**
     * Constructs the endpoint object.
     * @param gbClient GameBus client to use
     * @param playerId Player id to retrieve data for
     * @param dataTypes Data types to retrieve
     * @param parameters Parameters to use
     */
    constructor(
        private readonly gbClient: GameBusClient,
        private readonly playerId: number,
        dataTypes: string[],
        private readonly parameters: EndpointParameters
    ) {
        this.dataTypes = parseDataTypes(dataTypes);
    }

    /**
     * Retrieves data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable set of data
     */
    async retrieveData(dateSlice: DateSlice): Promise<EndpointData> {
        const data: EndpointData = {};
        const promises: EndpointPromises = {};

        for (let i = 0; i < this.dataTypes.length; i++) {
            if (this.dataTypes[i] === DataType.EXERCISE) {
                promises.exercise = this.retrieveExerciseData(dateSlice);
            } else if (this.dataTypes[i] === DataType.GLUCOSE) {
                promises.glucose = this.retrieveGlucoseData(dateSlice);
            } else if (this.dataTypes[i] === DataType.INSULIN) {
                promises.insulin = this.retrieveInsulinData(dateSlice);
            } else if (this.dataTypes[i] === DataType.MOOD) {
                promises.mood = this.retrieveMoodData(dateSlice);
            } else if (this.dataTypes[i] === DataType.FOOD) {
                promises.food = this.retrieveFoodData(dateSlice);
            }
        }
        
        // Make calls and copy results
        Object.keys(promises).forEach((key) => {
            promises[key].then((value: any) => {
                data[key] = value;
            });
        });
        await Promise.all(Object.values(promises));

        return data;
    }

    public static unionData(data: EndpointData): Array<any> {
        const dict: Record<number, any> = {};
        if (data.exercise) {
            data.exercise.forEach((element) => {
                dict[element.timestamp] = { ...dict[element.timestamp], ...element };
            });
        }
        if (data.mood) {
            data.mood.forEach((element) => {
                dict[element.timestamp] = { ...dict[element.timestamp], ...element };
            });
        }
        if (data.glucose) {
            data.glucose.forEach((element) => {
                dict[element.timestamp] = { ...dict[element.timestamp], ...element };
            });
        }
        if (data.insulin) {
            data.insulin.forEach((element) => {
                dict[element.timestamp] = { ...dict[element.timestamp], ...element };
            });
        }
        if (data.food) {
            data.food.forEach((element) => {
                dict[element.timestamp] = { ...dict[element.timestamp], ...element };
            });
        }
        return Object.values(dict) as Array<any>;
    }

    /**
     * Retrieves exercise data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved exercise data
     */
    private async retrieveExerciseData(dateSlice: DateSlice): Promise<ExerciseModel[]> {
        if (this.parameters.exerciseTypes) {
            return await this.gbClient
                .exercise()
                .getExerciseActivityFromGdBetweenUnix(
                    this.playerId,
                    this.parameters.exerciseTypes,
                    dateSlice.startDate.getTime(),
                    dateSlice.endDate.getTime()
                );
        } else {
            return [];
        }
    }

    /**
     * Retrieves glucose data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved glucose data
     */
    private async retrieveGlucoseData(dateSlice: DateSlice): Promise<GlucoseModel[]> {
        return await this.gbClient
            .glucose()
            .getGlucoseActivitiesBetweenUnix(
                this.playerId,
                dateSlice.startDate.getTime(),
                dateSlice.endDate.getTime()
            );
    }

    /**
     * Retrieves insulin data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved insulin data
     */
    private async retrieveInsulinData(dateSlice: DateSlice): Promise<InsulinModel[]> {
        return Insulin.convertResponseToInsulinModels(
            await this.gbClient
                .insulin()
                .getInsulinActivitiesBetweenUnix(
                    this.playerId,
                    dateSlice.startDate.getTime(),
                    dateSlice.endDate.getTime()
                )
        );
    }

    /**
     * Retrieves mood data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved mood data
     */
    private async retrieveMoodData(dateSlice: DateSlice): Promise<MoodModel[]> {
        return Mood.convertResponseToMoodModels(
            await this.gbClient
                .mood()
                .getMoodActivitiesBetweenUnix(
                    this.playerId,
                    dateSlice.startDate.getTime(),
                    dateSlice.endDate.getTime()
                )
        );
    }

    /**
     * Retrieves food data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved food data
     */
    private async retrieveFoodData(dateSlice: DateSlice): Promise<FoodModel[]> {
        return await this.gbClient
            .food()
            .getFoodActivitiesBetweenUnix(
                this.playerId,
                dateSlice.startDate.getTime(),
                dateSlice.endDate.getTime()
            );
    }
}

/**
 * Data retrieved by the endpoint.
 */
export interface EndpointData {
    glucose?: GlucoseModel[];
    exercise?: ExerciseModel[];
    insulin?: InsulinModel[];
    mood?: MoodModel[];
    food?: FoodModel[];
}

export interface EndpointPromises {
    glucose?: Promise<GlucoseModel[]>;
    exercise?: Promise<ExerciseModel[]>;
    insulin?: Promise<InsulinModel[]>;
    mood?: Promise<MoodModel[]>;
    food?: Promise<FoodModel[]>;
}


/**
 * Parameters for the endpoint.
 */
export interface EndpointParameters {
    exerciseTypes?: ExerciseGameDescriptorNames[];
}

/**
 * Parses a given list of data types.
 * @param dataTypes List of data types to parse
 * @returns Parsed data types
 */
export function parseDataTypes(dataTypes: string[]): DataType[] {
    const types: DataType[] = [];
    for (let i = 0; i < dataTypes.length; i++) {
        const type = DataType[dataTypes[i].toUpperCase().trim()];
        if (type !== undefined && !types.includes(type)) {
            types.push(type);
        }
    }
    return types;
}

/**
 * Seperates and parses a given list of exercise types.
 * @param exerciseTypes List of exercise types to parse, seperated by a comma
 * @returns Seperated and parsed exercise types
 */
export function parseExerciseTypes(exerciseTypes: string): ExerciseGameDescriptorNames[] {
    // First split the list intro strings
    const sep = exerciseTypes.split(',');
    const result: ExerciseGameDescriptorNames[] = [];
    // Check if the game descriptors are valid (if they exist)
    for (let i = 0; i < sep.length; i++) {
        const type = ExerciseGameDescriptorNames[sep[i].toUpperCase().trim()];
        if (type !== undefined && !result.includes(type)) {
            result.push(type);
        }
    }
    // Return all game descriptors that exist
    return result;
}

/**
 * Types of data which can be requested.
 */
export enum DataType {
    GLUCOSE,
    INSULIN,
    MOOD,
    FOOD,
    EXERCISE
}
