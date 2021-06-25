import { XOR } from 'ts-xor';
import {
    AbbottData,
    Consumptie,
    FoodDiaryData,
    NightScoutTreatmentModel
} from '../dataParsers/dataParserTypes';
/**
 * Current food sources available
 */
export enum FoodSource {
    ABBOTT = 0,
    FOOD_DIARY_EXCEL = 1,
    EETMETER = 2,
    NIGHTSCOUT = 3
}

/**
 * All possible input types for food data,
 */
export type FoodInput = XOR<
    Consumptie[],
    XOR<AbbottData[], XOR<FoodDiaryData[], NightScoutTreatmentModel[]>>
>;
