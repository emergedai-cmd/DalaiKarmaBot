"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOutboundResultEnvelope = buildOutboundResultEnvelope;
var payloads_js_1 = require("./payloads.js");
var isOutboundPayloadJson = function (payload) { return "mediaUrl" in payload; };
function buildOutboundResultEnvelope(params) {
    var hasPayloads = params.payloads !== undefined;
    var payloads = params.payloads === undefined
        ? undefined
        : params.payloads.length === 0
            ? []
            : isOutboundPayloadJson(params.payloads[0])
                ? params.payloads
                : (0, payloads_js_1.normalizeOutboundPayloadsForJson)(params.payloads);
    if (params.flattenDelivery !== false && params.delivery && !params.meta && !hasPayloads) {
        return params.delivery;
    }
    return __assign(__assign(__assign({}, (hasPayloads ? { payloads: payloads } : {})), (params.meta ? { meta: params.meta } : {})), (params.delivery ? { delivery: params.delivery } : {}));
}
