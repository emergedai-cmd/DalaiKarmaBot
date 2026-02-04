"use strict";
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
var session_key_js_1 = require("../../../routing/session-key.js");
var config_js_1 = require("../../config.js");
var hooks_js_1 = require("../../hooks.js");
var soul_evil_js_1 = require("../../soul-evil.js");
var HOOK_KEY = "soul-evil";
var soulEvilHook = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var context, cfg, hookConfig, soulConfig, workspaceDir, updated;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(0, hooks_js_1.isAgentBootstrapEvent)(event)) {
                    return [2 /*return*/];
                }
                context = event.context;
                if (context.sessionKey && (0, session_key_js_1.isSubagentSessionKey)(context.sessionKey)) {
                    return [2 /*return*/];
                }
                cfg = context.cfg;
                hookConfig = (0, config_js_1.resolveHookConfig)(cfg, HOOK_KEY);
                if (!hookConfig || hookConfig.enabled === false) {
                    return [2 /*return*/];
                }
                soulConfig = (0, soul_evil_js_1.resolveSoulEvilConfigFromHook)(hookConfig, {
                    warn: function (message) { return console.warn("[soul-evil] ".concat(message)); },
                });
                if (!soulConfig) {
                    return [2 /*return*/];
                }
                workspaceDir = context.workspaceDir;
                if (!workspaceDir || !Array.isArray(context.bootstrapFiles)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, soul_evil_js_1.applySoulEvilOverride)({
                        files: context.bootstrapFiles,
                        workspaceDir: workspaceDir,
                        config: soulConfig,
                        userTimezone: (_b = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.userTimezone,
                        log: {
                            warn: function (message) { return console.warn("[soul-evil] ".concat(message)); },
                            debug: function (message) { var _a; return (_a = console.debug) === null || _a === void 0 ? void 0 : _a.call(console, "[soul-evil] ".concat(message)); },
                        },
                    })];
            case 1:
                updated = _c.sent();
                context.bootstrapFiles = updated;
                return [2 /*return*/];
        }
    });
}); };
exports.default = soulEvilHook;
