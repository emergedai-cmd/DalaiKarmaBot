"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreCiaoCancellationRejection = ignoreCiaoCancellationRejection;
var logger_js_1 = require("../logger.js");
var bonjour_errors_js_1 = require("./bonjour-errors.js");
function ignoreCiaoCancellationRejection(reason) {
    var message = (0, bonjour_errors_js_1.formatBonjourError)(reason).toUpperCase();
    if (!message.includes("CIAO ANNOUNCEMENT CANCELLED")) {
        return false;
    }
    (0, logger_js_1.logDebug)("bonjour: ignoring unhandled ciao rejection: ".concat((0, bonjour_errors_js_1.formatBonjourError)(reason)));
    return true;
}
