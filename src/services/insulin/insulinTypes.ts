import { XOR } from 'ts-xor';
import {
    AbbottData,
    FoodDiaryData,
    NightScoutTreatmentModel
} from '../dataParsers/dataParserTypes';

/**
 * Current insulin sources available
 */
export enum InsulinSource {
    ABBOTT = 0,
    FOOD_DIARY_EXCEL = 1,
    NIGHTSCOUT = 2
}

/**
 * All possible input types for insulin data
 */
export type InsulinInput = XOR<AbbottData[], XOR<FoodDiaryData[], NightScoutTreatmentModel[]>>;
