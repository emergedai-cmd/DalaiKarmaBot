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
exports.createTestRegistry = void 0;
var createTestRegistry = function (overrides) {
    var _a, _b, _c;
    if (overrides === void 0) { overrides = {}; }
    var base = {
        plugins: [],
        tools: [],
        hooks: [],
        typedHooks: [],
        channels: [],
        providers: [],
        gatewayHandlers: {},
        httpHandlers: [],
        httpRoutes: [],
        cliRegistrars: [],
        services: [],
        commands: [],
        diagnostics: [],
    };
    var merged = __assign(__assign({}, base), overrides);
    return __assign(__assign({}, merged), { gatewayHandlers: (_a = merged.gatewayHandlers) !== null && _a !== void 0 ? _a : {}, httpHandlers: (_b = merged.httpHandlers) !== null && _b !== void 0 ? _b : [], httpRoutes: (_c = merged.httpRoutes) !== null && _c !== void 0 ? _c : [] });
};
exports.createTestRegistry = createTestRegistry;
