import { Activity } from './activity';
export { Activity } from './activity';
export { Challenge } from './challenge';
export { Circle } from './circle';
export { User } from './user';

/**
 * Base object used for constructor-inheritance
 */
export class GameBusObject {
    constructor(protected readonly activity: Activity, protected readonly authRequired: boolean) {}
}
