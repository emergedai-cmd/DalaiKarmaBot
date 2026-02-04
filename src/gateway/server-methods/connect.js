"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectHandlers = void 0;
var index_js_1 = require("../protocol/index.js");
exports.connectHandlers = {
    connect: function (_a) {
        var respond = _a.respond;
        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "connect is only valid as the first request"));
    },
};
