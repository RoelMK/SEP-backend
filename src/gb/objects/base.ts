import { Activity } from './activity';

/**
 * Base object used for constructor-inheritance
 */
export class GameBusObject {
    constructor(protected readonly activity: Activity, protected readonly authRequired: boolean) {}
}
