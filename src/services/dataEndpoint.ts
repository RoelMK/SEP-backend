import { GameBusClient } from '../gb/gbClient';
import { ExerciseModel } from '../gb/models/exerciseModel';
import { FoodModel } from '../gb/models/foodModel';
import { GlucoseModel } from '../gb/models/glucoseModel';
import { InsulinModel } from '../gb/models/insulinModel';
import { MoodModel } from '../gb/models/moodModel';
import { DateSlice } from './utils/dates';
import { nullUnion, UnionModel } from '../gb/models/unionModel';
import { ExerciseGameDescriptorNames } from '../gb/objects/GBObjectTypes';

export class DataEndpoint {
    private readonly dataTypes: DataType[]; // Data types to retrieve

    // maximum number of pages that are requested
    private readonly MAX_PAGES = 1000;

    // maximum number of entries that are requested per page
    private readonly PAGE_LIMIT = 500;

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
        //console.log(data.glucose?.length);
        //console.log(data.food?.length);
        return data;
    }

    /**
     * Unions given data and returns it as an array.
     * @param data Retrieved data
     * @returns Union of given data
     */
    public static unionData(data: EndpointData): Array<any> {
        const unionDict: Record<number, UnionModel> = {};
        if (data.exercise) {
            data.exercise.forEach((exercise: ExerciseModel) => {
                this.addValues(unionDict, DataType.EXERCISE, exercise);
            });
        }
        if (data.mood) {
            data.mood.forEach((mood: MoodModel) => {
                this.addValues(unionDict, DataType.MOOD, mood);
            });
        }
        if (data.glucose) {
            data.glucose.forEach((glucose: GlucoseModel) => {
                this.addValues(unionDict, DataType.GLUCOSE, glucose);
            });
        }
        if (data.insulin) {
            data.insulin.forEach((insulin: InsulinModel) => {
                this.addValues(unionDict, DataType.INSULIN, insulin);
            });
        }
        if (data.food) {
            data.food.forEach((food: FoodModel) => {
                this.addValues(unionDict, DataType.FOOD, food);
            });
        }
        return Object.values(unionDict) as Array<any>;
    }
    /**
     * Helper function that adds all known keys of a model to a union model object in the dictionary
     * @param unionDict dictionary that contains all unionModels with timestamp as key
     * @param data data (e.g. FoodModel, ExerciseModel etc.)
     */
    private static addValues(
        unionDict: Record<number, UnionModel>,
        dataType: DataType,
        data: any
    ): void {
        // create a new UnionModel if it does not exist at the timestamp
        if (unionDict[data.timestamp] === undefined) {
            unionDict[data.timestamp] = { ...nullUnion }; // copy a null-filled unionModel
        }

        // add all known values to the UnionModel
        const unionModel: UnionModel = unionDict[data.timestamp];
        unionModel.timestamp = data.timestamp;
        switch (dataType) {
            case DataType.FOOD:
                unionModel.food = data;
                break;
            case DataType.MOOD:
                unionModel.mood = data;
                break;
            case DataType.GLUCOSE:
                unionModel.glucose = data;
                break;
            case DataType.INSULIN:
                unionModel.insulin = data;
                break;
            case DataType.EXERCISE:
                unionModel.exercise = data;
                break;
        }
    }

    /**
     * Retrieves exercise data from GameBus.
     * If no exercise types are specified, all exercise types are retrieved
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved exercise data
     */
    private async retrieveExerciseData(dateSlice: DateSlice): Promise<ExerciseModel[]> {
        if (this.parameters.exerciseTypes) {
            // retrieve specified exercise types
            return await this.retrieveExercisePages(dateSlice, this.parameters.exerciseTypes);
        }
        try {
            // retrieve all exercise types
            return await this.retrieveExercisePages(
                dateSlice,
                Object.values(ExerciseGameDescriptorNames)
            );
        } catch (e) {
            return [];
        }
    }

    /**
     *
     * @param dateSlice Timeframe to retrieve data for
     * @param exerciseTypes array of exercise types
     * @returns exercise models
     */
    private async retrieveExercisePages(
        dateSlice: DateSlice,
        exerciseTypes: ExerciseGameDescriptorNames[]
    ): Promise<ExerciseModel[]> {
        let models: ExerciseModel[] = [];
        for (let page = 0; page < this.MAX_PAGES; page++) {
            const pageModels: ExerciseModel[] = await this.gbClient
                .exercise()
                .getExerciseActivityFromGdBetweenUnix(
                    this.playerId,
                    exerciseTypes,
                    dateSlice.startDate.getTime(), // start of exercise query
                    dateSlice.endDate.getTime(), // end of exercise query
                    undefined, // no exercise order
                    this.PAGE_LIMIT,
                    page
                );
            // Concat exercise models
            models = models.concat(pageModels);
            if (pageModels.length < this.PAGE_LIMIT) break;
        }
        // Return exercise models
        return models;
    }

    /**
     * Retrieves glucose data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved glucose data
     */
    private async retrieveGlucoseData(dateSlice: DateSlice): Promise<GlucoseModel[]> {
        let models: GlucoseModel[] = [];
        for (let page = 0; page < this.MAX_PAGES; page++) {
            const pageModels: GlucoseModel[] = await this.gbClient
                .glucose()
                .getGlucoseActivitiesBetweenUnix(
                    this.playerId,
                    dateSlice.startDate.getTime(), // start of glucose query
                    dateSlice.endDate.getTime(), // end of glucose query
                    undefined, // no glucose order
                    this.PAGE_LIMIT,
                    page
                );
            // Concat glucose models
            models = models.concat(pageModels);
            if (pageModels.length < this.PAGE_LIMIT) break;
        }
        // Return glucose models
        return models;
    }

    /**
     * Retrieves insulin data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved insulin data
     */
    private async retrieveInsulinData(dateSlice: DateSlice): Promise<InsulinModel[]> {
        let models: InsulinModel[] = [];
        for (let page = 0; page < this.MAX_PAGES; page++) {
            const pageModels: InsulinModel[] = await this.gbClient
                .insulin()
                .getInsulinActivitiesBetweenUnix(
                    this.playerId,
                    dateSlice.startDate.getTime(), // start of insulin query
                    dateSlice.endDate.getTime(), // end of insulin query
                    undefined, // no insulin order
                    this.PAGE_LIMIT,
                    page
                );
            // Concat insulin models
            models = models.concat(pageModels);
            if (pageModels.length < this.PAGE_LIMIT) break;
        }
        // Return insulin models
        return models;
    }

    /**
     * Retrieves mood data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved mood data
     */
    private async retrieveMoodData(dateSlice: DateSlice): Promise<MoodModel[]> {
        let models: MoodModel[] = [];
        for (let page = 0; page < this.MAX_PAGES; page++) {
            const pageModels: MoodModel[] = await this.gbClient.mood().getMoodActivitiesBetweenUnix(
                this.playerId,
                dateSlice.startDate.getTime(), // start of mood query
                dateSlice.endDate.getTime(), // end of mood query
                undefined, // no mood order
                this.PAGE_LIMIT,
                page
            );
            // Concat mood models
            models = models.concat(pageModels);
            if (pageModels.length < this.PAGE_LIMIT) break;
        }
        // Return mood models
        return models;
    }

    /**
     * Retrieves food data from GameBus.
     * @param dateSlice Timeframe to retrieve data for
     * @returns Awaitable array of retrieved food data
     */
    private async retrieveFoodData(dateSlice: DateSlice): Promise<FoodModel[]> {
        let models: FoodModel[] = [];
        for (let page = 0; page < this.MAX_PAGES; page++) {
            const pageModels: FoodModel[] = await this.gbClient.food().getFoodActivitiesBetweenUnix(
                this.playerId,
                dateSlice.startDate.getTime(), // start of food query
                dateSlice.endDate.getTime(), // end of food query
                undefined, // no food order
                this.PAGE_LIMIT,
                page
            );
            // Concat food models
            models = models.concat(pageModels);
            if (pageModels.length < this.PAGE_LIMIT) break;
        }
        // Return food models
        return models;
    }
}

/**
 * Data retrieved from the endpoint.
 */
export interface EndpointData {
    glucose?: GlucoseModel[];
    exercise?: ExerciseModel[];
    insulin?: InsulinModel[];
    mood?: MoodModel[];
    food?: FoodModel[];
}

/**
 * Promises for the data to retrieve from the endpoint.
 */
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

/**
 * Mapping between datatype and another mapping between keys in the original
 * data model and the union model.
 */
export const unionRenamed: Record<DataType, any> = {
    [DataType.GLUCOSE]: {},
    [DataType.INSULIN]: {},
    [DataType.MOOD]: {},
    [DataType.FOOD]: {},
    [DataType.EXERCISE]: {
        calories: 'caloriesBurnt'
    }
};
