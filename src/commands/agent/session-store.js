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
exports.updateSessionStoreAfterAgentRun = updateSessionStoreAfterAgentRun;
var cli_session_js_1 = require("../../agents/cli-session.js");
var context_js_1 = require("../../agents/context.js");
var defaults_js_1 = require("../../agents/defaults.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var usage_js_1 = require("../../agents/usage.js");
var sessions_js_1 = require("../../config/sessions.js");
function updateSessionStoreAfterAgentRun(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, sessionId, sessionKey, storePath, sessionStore, defaultProvider, defaultModel, fallbackProvider, fallbackModel, result, usage, modelUsed, providerUsed, contextTokens, entry, next, cliSessionId, input, output, promptTokens;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    cfg = params.cfg, sessionId = params.sessionId, sessionKey = params.sessionKey, storePath = params.storePath, sessionStore = params.sessionStore, defaultProvider = params.defaultProvider, defaultModel = params.defaultModel, fallbackProvider = params.fallbackProvider, fallbackModel = params.fallbackModel, result = params.result;
                    usage = (_a = result.meta.agentMeta) === null || _a === void 0 ? void 0 : _a.usage;
                    modelUsed = (_d = (_c = (_b = result.meta.agentMeta) === null || _b === void 0 ? void 0 : _b.model) !== null && _c !== void 0 ? _c : fallbackModel) !== null && _d !== void 0 ? _d : defaultModel;
                    providerUsed = (_g = (_f = (_e = result.meta.agentMeta) === null || _e === void 0 ? void 0 : _e.provider) !== null && _f !== void 0 ? _f : fallbackProvider) !== null && _g !== void 0 ? _g : defaultProvider;
                    contextTokens = (_j = (_h = params.contextTokensOverride) !== null && _h !== void 0 ? _h : (0, context_js_1.lookupContextTokens)(modelUsed)) !== null && _j !== void 0 ? _j : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
                    entry = (_k = sessionStore[sessionKey]) !== null && _k !== void 0 ? _k : {
                        sessionId: sessionId,
                        updatedAt: Date.now(),
                    };
                    next = __assign(__assign({}, entry), { sessionId: sessionId, updatedAt: Date.now(), modelProvider: providerUsed, model: modelUsed, contextTokens: contextTokens });
                    if ((0, model_selection_js_1.isCliProvider)(providerUsed, cfg)) {
                        cliSessionId = (_m = (_l = result.meta.agentMeta) === null || _l === void 0 ? void 0 : _l.sessionId) === null || _m === void 0 ? void 0 : _m.trim();
                        if (cliSessionId) {
                            (0, cli_session_js_1.setCliSessionId)(next, providerUsed, cliSessionId);
                        }
                    }
                    next.abortedLastRun = (_o = result.meta.aborted) !== null && _o !== void 0 ? _o : false;
                    if ((0, usage_js_1.hasNonzeroUsage)(usage)) {
                        input = (_p = usage.input) !== null && _p !== void 0 ? _p : 0;
                        output = (_q = usage.output) !== null && _q !== void 0 ? _q : 0;
                        promptTokens = input + ((_r = usage.cacheRead) !== null && _r !== void 0 ? _r : 0) + ((_s = usage.cacheWrite) !== null && _s !== void 0 ? _s : 0);
                        next.inputTokens = input;
                        next.outputTokens = output;
                        next.totalTokens = promptTokens > 0 ? promptTokens : ((_t = usage.total) !== null && _t !== void 0 ? _t : input);
                    }
                    sessionStore[sessionKey] = next;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[sessionKey] = next;
                        })];
                case 1:
                    _u.sent();
                    return [2 /*return*/];
            }
        });
    });
}
