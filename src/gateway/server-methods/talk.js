"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.talkHandlers = void 0;
var index_js_1 = require("../protocol/index.js");
exports.talkHandlers = {
    "talk.mode": function (_a) {
        var _b;
        var params = _a.params, respond = _a.respond, context = _a.context, client = _a.client, isWebchatConnect = _a.isWebchatConnect;
        if (client && isWebchatConnect(client.connect) && !context.hasConnectedMobileNode()) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "talk disabled: no connected iOS/Android nodes"));
            return;
        }
        if (!(0, index_js_1.validateTalkModeParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid talk.mode params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateTalkModeParams.errors))));
            return;
        }
        var payload = {
            enabled: params.enabled,
            phase: (_b = params.phase) !== null && _b !== void 0 ? _b : null,
            ts: Date.now(),
        };
        context.broadcast("talk.mode", payload, { dropIfSlow: true });
        respond(true, payload, undefined);
    },
};
