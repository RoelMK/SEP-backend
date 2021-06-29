import { AbbottData, NightScoutEntryModel } from '../dataParsers/dataParserTypes';
import { XOR } from 'ts-xor';
import { GlucoseModel } from '../../gb/models';

/**
 * Function that can return an empty GlucoseModel entry that might be needed for easy returns
 * @returns Empty GlucoseModel
 */
export const emptyGlucoseModel = (): GlucoseModel => ({
    timestamp: 0,
    glucoseLevel: 0
});
/**
 * Current glucose sources available
 */
export enum GlucoseSource {
    ABBOTT = 1,
    NIGHTSCOUT = 2
}

/**
 * All possible input types for glucose data
 */
export type GlucoseInput = XOR<AbbottData[], NightScoutEntryModel[]>;
