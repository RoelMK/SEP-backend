"use strict";
exports.__esModule = true;
exports.GameBusObject = void 0;
/**
 * Base object used for constructor-inheritance
 */
var GameBusObject = /** @class */ (function () {
    function GameBusObject(gamebus, authRequired) {
        this.gamebus = gamebus;
        this.authRequired = authRequired;
    }
    return GameBusObject;
}());
exports.GameBusObject = GameBusObject;
