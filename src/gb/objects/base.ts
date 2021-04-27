import { GameBusClient } from '../GameBusClient';

/**
 * Base object used for constructor-inheritance
 */
export class GameBusObject {
    constructor(protected readonly gamebus: GameBusClient, protected readonly authRequired: boolean) {}
}
