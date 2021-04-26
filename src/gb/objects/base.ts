import { GameBusClient } from '../GamebusClient';

/**
 * Base object used for constructor-inheritance
 */
export class GameBusObject {
    constructor(protected readonly gamebus: GameBusClient, protected readonly authRequired: boolean) {}
}
