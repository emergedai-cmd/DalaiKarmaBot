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
exports.buildGatewaySnapshot = buildGatewaySnapshot;
exports.getHealthCache = getHealthCache;
exports.getHealthVersion = getHealthVersion;
exports.incrementPresenceVersion = incrementPresenceVersion;
exports.getPresenceVersion = getPresenceVersion;
exports.setBroadcastHealthUpdate = setBroadcastHealthUpdate;
exports.refreshGatewayHealthSnapshot = refreshGatewayHealthSnapshot;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var health_js_1 = require("../../commands/health.js");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var system_presence_js_1 = require("../../infra/system-presence.js");
var session_key_js_1 = require("../../routing/session-key.js");
var presenceVersion = 1;
var healthVersion = 1;
var healthCache = null;
var healthRefresh = null;
var broadcastHealthUpdate = null;
function buildGatewaySnapshot() {
    var _a, _b, _c;
    var cfg = (0, config_js_1.loadConfig)();
    var defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
    var mainKey = (0, session_key_js_1.normalizeMainKey)((_a = cfg.session) === null || _a === void 0 ? void 0 : _a.mainKey);
    var mainSessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
    var scope = (_c = (_b = cfg.session) === null || _b === void 0 ? void 0 : _b.scope) !== null && _c !== void 0 ? _c : "per-sender";
    var presence = (0, system_presence_js_1.listSystemPresence)();
    var uptimeMs = Math.round(process.uptime() * 1000);
    // Health is async; caller should await getHealthSnapshot and replace later if needed.
    var emptyHealth = {};
    return {
        presence: presence,
        health: emptyHealth,
        stateVersion: { presence: presenceVersion, health: healthVersion },
        uptimeMs: uptimeMs,
        // Surface resolved paths so UIs can display the true config location.
        configPath: config_js_1.CONFIG_PATH,
        stateDir: config_js_1.STATE_DIR,
        sessionDefaults: {
            defaultAgentId: defaultAgentId,
            mainKey: mainKey,
            mainSessionKey: mainSessionKey,
            scope: scope,
        },
    };
}
function getHealthCache() {
    return healthCache;
}
function getHealthVersion() {
    return healthVersion;
}
function incrementPresenceVersion() {
    presenceVersion += 1;
    return presenceVersion;
}
function getPresenceVersion() {
    return presenceVersion;
}
function setBroadcastHealthUpdate(fn) {
    broadcastHealthUpdate = fn;
}
function refreshGatewayHealthSnapshot(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (!healthRefresh) {
                healthRefresh = (function () { return __awaiter(_this, void 0, void 0, function () {
                    var snap;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, health_js_1.getHealthSnapshot)({ probe: opts === null || opts === void 0 ? void 0 : opts.probe })];
                            case 1:
                                snap = _a.sent();
                                healthCache = snap;
                                healthVersion += 1;
                                if (broadcastHealthUpdate) {
                                    broadcastHealthUpdate(snap);
                                }
                                return [2 /*return*/, snap];
                        }
                    });
                }); })().finally(function () {
                    healthRefresh = null;
                });
            }
            return [2 /*return*/, healthRefresh];
        });
    });
}
