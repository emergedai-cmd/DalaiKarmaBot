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
exports.buildTestCtx = buildTestCtx;
var inbound_context_js_1 = require("./inbound-context.js");
function buildTestCtx(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (0, inbound_context_js_1.finalizeInboundContext)(__assign({ Body: "", CommandBody: "", CommandSource: "text", From: "whatsapp:+1000", To: "whatsapp:+2000", ChatType: "direct", Provider: "whatsapp", Surface: "whatsapp", CommandAuthorized: false }, overrides));
}
