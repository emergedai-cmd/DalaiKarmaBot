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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGatewayRuntimeConfig = resolveGatewayRuntimeConfig;
var auth_js_1 = require("./auth.js");
var control_ui_shared_js_1 = require("./control-ui-shared.js");
var hooks_js_1 = require("./hooks.js");
var net_js_1 = require("./net.js");
function resolveGatewayRuntimeConfig(params) {
    return __awaiter(this, void 0, void 0, function () {
        var bindMode, customBindHost, bindHost, _a, controlUiEnabled, openAiChatCompletionsEnabled, openResponsesConfig, openResponsesEnabled, controlUiBasePath, authBase, authOverrides, authConfig, tailscaleBase, tailscaleOverrides, tailscaleConfig, tailscaleMode, resolvedAuth, authMode, hasToken, hasPassword, hasSharedSecret, hooksConfig, canvasHostEnabled;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    bindMode = (_d = (_b = params.bind) !== null && _b !== void 0 ? _b : (_c = params.cfg.gateway) === null || _c === void 0 ? void 0 : _c.bind) !== null && _d !== void 0 ? _d : "loopback";
                    customBindHost = (_e = params.cfg.gateway) === null || _e === void 0 ? void 0 : _e.customBindHost;
                    if (!((_f = params.host) !== null && _f !== void 0)) return [3 /*break*/, 1];
                    _a = _f;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, net_js_1.resolveGatewayBindHost)(bindMode, customBindHost)];
                case 2:
                    _a = (_7.sent());
                    _7.label = 3;
                case 3:
                    bindHost = _a;
                    controlUiEnabled = (_k = (_g = params.controlUiEnabled) !== null && _g !== void 0 ? _g : (_j = (_h = params.cfg.gateway) === null || _h === void 0 ? void 0 : _h.controlUi) === null || _j === void 0 ? void 0 : _j.enabled) !== null && _k !== void 0 ? _k : true;
                    openAiChatCompletionsEnabled = (_r = (_l = params.openAiChatCompletionsEnabled) !== null && _l !== void 0 ? _l : (_q = (_p = (_o = (_m = params.cfg.gateway) === null || _m === void 0 ? void 0 : _m.http) === null || _o === void 0 ? void 0 : _o.endpoints) === null || _p === void 0 ? void 0 : _p.chatCompletions) === null || _q === void 0 ? void 0 : _q.enabled) !== null && _r !== void 0 ? _r : false;
                    openResponsesConfig = (_u = (_t = (_s = params.cfg.gateway) === null || _s === void 0 ? void 0 : _s.http) === null || _t === void 0 ? void 0 : _t.endpoints) === null || _u === void 0 ? void 0 : _u.responses;
                    openResponsesEnabled = (_w = (_v = params.openResponsesEnabled) !== null && _v !== void 0 ? _v : openResponsesConfig === null || openResponsesConfig === void 0 ? void 0 : openResponsesConfig.enabled) !== null && _w !== void 0 ? _w : false;
                    controlUiBasePath = (0, control_ui_shared_js_1.normalizeControlUiBasePath)((_y = (_x = params.cfg.gateway) === null || _x === void 0 ? void 0 : _x.controlUi) === null || _y === void 0 ? void 0 : _y.basePath);
                    authBase = (_0 = (_z = params.cfg.gateway) === null || _z === void 0 ? void 0 : _z.auth) !== null && _0 !== void 0 ? _0 : {};
                    authOverrides = (_1 = params.auth) !== null && _1 !== void 0 ? _1 : {};
                    authConfig = __assign(__assign({}, authBase), authOverrides);
                    tailscaleBase = (_3 = (_2 = params.cfg.gateway) === null || _2 === void 0 ? void 0 : _2.tailscale) !== null && _3 !== void 0 ? _3 : {};
                    tailscaleOverrides = (_4 = params.tailscale) !== null && _4 !== void 0 ? _4 : {};
                    tailscaleConfig = __assign(__assign({}, tailscaleBase), tailscaleOverrides);
                    tailscaleMode = (_5 = tailscaleConfig.mode) !== null && _5 !== void 0 ? _5 : "off";
                    resolvedAuth = (0, auth_js_1.resolveGatewayAuth)({
                        authConfig: authConfig,
                        env: process.env,
                        tailscaleMode: tailscaleMode,
                    });
                    authMode = resolvedAuth.mode;
                    hasToken = typeof resolvedAuth.token === "string" && resolvedAuth.token.trim().length > 0;
                    hasPassword = typeof resolvedAuth.password === "string" && resolvedAuth.password.trim().length > 0;
                    hasSharedSecret = (authMode === "token" && hasToken) || (authMode === "password" && hasPassword);
                    hooksConfig = (0, hooks_js_1.resolveHooksConfig)(params.cfg);
                    canvasHostEnabled = process.env.OPENCLAW_SKIP_CANVAS_HOST !== "1" && ((_6 = params.cfg.canvasHost) === null || _6 === void 0 ? void 0 : _6.enabled) !== false;
                    (0, auth_js_1.assertGatewayAuthConfigured)(resolvedAuth);
                    if (tailscaleMode === "funnel" && authMode !== "password") {
                        throw new Error("tailscale funnel requires gateway auth mode=password (set gateway.auth.password or OPENCLAW_GATEWAY_PASSWORD)");
                    }
                    if (tailscaleMode !== "off" && !(0, net_js_1.isLoopbackHost)(bindHost)) {
                        throw new Error("tailscale serve/funnel requires gateway bind=loopback (127.0.0.1)");
                    }
                    if (!(0, net_js_1.isLoopbackHost)(bindHost) && !hasSharedSecret) {
                        throw new Error("refusing to bind gateway to ".concat(bindHost, ":").concat(params.port, " without auth (set gateway.auth.token/password, or set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD)"));
                    }
                    return [2 /*return*/, {
                            bindHost: bindHost,
                            controlUiEnabled: controlUiEnabled,
                            openAiChatCompletionsEnabled: openAiChatCompletionsEnabled,
                            openResponsesEnabled: openResponsesEnabled,
                            openResponsesConfig: openResponsesConfig
                                ? __assign(__assign({}, openResponsesConfig), { enabled: openResponsesEnabled }) : undefined,
                            controlUiBasePath: controlUiBasePath,
                            resolvedAuth: resolvedAuth,
                            authMode: authMode,
                            tailscaleConfig: tailscaleConfig,
                            tailscaleMode: tailscaleMode,
                            hooksConfig: hooksConfig,
                            canvasHostEnabled: canvasHostEnabled,
                        }];
            }
        });
    });
}
