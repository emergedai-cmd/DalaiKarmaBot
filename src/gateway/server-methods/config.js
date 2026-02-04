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
exports.configHandlers = void 0;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var index_js_1 = require("../../channels/plugins/index.js");
var config_js_1 = require("../../config/config.js");
var legacy_js_1 = require("../../config/legacy.js");
var merge_patch_js_1 = require("../../config/merge-patch.js");
var schema_js_1 = require("../../config/schema.js");
var restart_sentinel_js_1 = require("../../infra/restart-sentinel.js");
var restart_js_1 = require("../../infra/restart.js");
var loader_js_1 = require("../../plugins/loader.js");
var index_js_2 = require("../protocol/index.js");
function resolveBaseHash(params) {
    var raw = params === null || params === void 0 ? void 0 : params.baseHash;
    if (typeof raw !== "string") {
        return null;
    }
    var trimmed = raw.trim();
    return trimmed ? trimmed : null;
}
function requireConfigBaseHash(params, snapshot, respond) {
    if (!snapshot.exists) {
        return true;
    }
    var snapshotHash = (0, config_js_1.resolveConfigSnapshotHash)(snapshot);
    if (!snapshotHash) {
        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "config base hash unavailable; re-run config.get and retry"));
        return false;
    }
    var baseHash = resolveBaseHash(params);
    if (!baseHash) {
        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "config base hash required; re-run config.get and retry"));
        return false;
    }
    if (baseHash !== snapshotHash) {
        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "config changed since last load; re-run config.get and retry"));
        return false;
    }
    return true;
}
exports.configHandlers = {
    "config.get": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var snapshot;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_2.validateConfigGetParams)(params)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.get params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateConfigGetParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _c.sent();
                    respond(true, snapshot, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "config.schema": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_2.validateConfigSchemaParams)(params)) {
            respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.schema params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateConfigSchemaParams.errors))));
            return;
        }
        var cfg = (0, config_js_1.loadConfig)();
        var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
        var pluginRegistry = (0, loader_js_1.loadOpenClawPlugins)({
            config: cfg,
            workspaceDir: workspaceDir,
            logger: {
                info: function () { },
                warn: function () { },
                error: function () { },
                debug: function () { },
            },
        });
        var schema = (0, schema_js_1.buildConfigSchema)({
            plugins: pluginRegistry.plugins.map(function (plugin) { return ({
                id: plugin.id,
                name: plugin.name,
                description: plugin.description,
                configUiHints: plugin.configUiHints,
                configSchema: plugin.configJsonSchema,
            }); }),
            channels: (0, index_js_1.listChannelPlugins)().map(function (entry) {
                var _a, _b;
                return ({
                    id: entry.id,
                    label: entry.meta.label,
                    description: entry.meta.blurb,
                    configSchema: (_a = entry.configSchema) === null || _a === void 0 ? void 0 : _a.schema,
                    configUiHints: (_b = entry.configSchema) === null || _b === void 0 ? void 0 : _b.uiHints,
                });
            }),
        });
        respond(true, schema, undefined);
    },
    "config.set": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var snapshot, rawValue, parsedRes, validated;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_2.validateConfigSetParams)(params)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.set params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateConfigSetParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _c.sent();
                    if (!requireConfigBaseHash(params, snapshot, respond)) {
                        return [2 /*return*/];
                    }
                    rawValue = params.raw;
                    if (typeof rawValue !== "string") {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.set params: raw (string) required"));
                        return [2 /*return*/];
                    }
                    parsedRes = (0, config_js_1.parseConfigJson5)(rawValue);
                    if (!parsedRes.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, parsedRes.error));
                        return [2 /*return*/];
                    }
                    validated = (0, config_js_1.validateConfigObjectWithPlugins)(parsedRes.parsed);
                    if (!validated.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config", {
                            details: { issues: validated.issues },
                        }));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
                case 2:
                    _c.sent();
                    respond(true, {
                        ok: true,
                        path: config_js_1.CONFIG_PATH,
                        config: validated.config,
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "config.patch": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var snapshot, rawValue, parsedRes, merged, migrated, resolved, validated, sessionKey, note, restartDelayMsRaw, restartDelayMs, payload, sentinelPath, _c, restart;
        var _d, _e, _f;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!(0, index_js_2.validateConfigPatchParams)(params)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.patch params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateConfigPatchParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _g.sent();
                    if (!requireConfigBaseHash(params, snapshot, respond)) {
                        return [2 /*return*/];
                    }
                    if (!snapshot.valid) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config; fix before patching"));
                        return [2 /*return*/];
                    }
                    rawValue = params.raw;
                    if (typeof rawValue !== "string") {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.patch params: raw (string) required"));
                        return [2 /*return*/];
                    }
                    parsedRes = (0, config_js_1.parseConfigJson5)(rawValue);
                    if (!parsedRes.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, parsedRes.error));
                        return [2 /*return*/];
                    }
                    if (!parsedRes.parsed ||
                        typeof parsedRes.parsed !== "object" ||
                        Array.isArray(parsedRes.parsed)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "config.patch raw must be an object"));
                        return [2 /*return*/];
                    }
                    merged = (0, merge_patch_js_1.applyMergePatch)(snapshot.config, parsedRes.parsed);
                    migrated = (0, legacy_js_1.applyLegacyMigrations)(merged);
                    resolved = (_d = migrated.next) !== null && _d !== void 0 ? _d : merged;
                    validated = (0, config_js_1.validateConfigObjectWithPlugins)(resolved);
                    if (!validated.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config", {
                            details: { issues: validated.issues },
                        }));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
                case 2:
                    _g.sent();
                    sessionKey = typeof params.sessionKey === "string"
                        ? ((_e = params.sessionKey) === null || _e === void 0 ? void 0 : _e.trim()) || undefined
                        : undefined;
                    note = typeof params.note === "string"
                        ? ((_f = params.note) === null || _f === void 0 ? void 0 : _f.trim()) || undefined
                        : undefined;
                    restartDelayMsRaw = params.restartDelayMs;
                    restartDelayMs = typeof restartDelayMsRaw === "number" && Number.isFinite(restartDelayMsRaw)
                        ? Math.max(0, Math.floor(restartDelayMsRaw))
                        : undefined;
                    payload = {
                        kind: "config-apply",
                        status: "ok",
                        ts: Date.now(),
                        sessionKey: sessionKey,
                        message: note !== null && note !== void 0 ? note : null,
                        doctorHint: (0, restart_sentinel_js_1.formatDoctorNonInteractiveHint)(),
                        stats: {
                            mode: "config.patch",
                            root: config_js_1.CONFIG_PATH,
                        },
                    };
                    sentinelPath = null;
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, restart_sentinel_js_1.writeRestartSentinel)(payload)];
                case 4:
                    sentinelPath = _g.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _c = _g.sent();
                    sentinelPath = null;
                    return [3 /*break*/, 6];
                case 6:
                    restart = (0, restart_js_1.scheduleGatewaySigusr1Restart)({
                        delayMs: restartDelayMs,
                        reason: "config.patch",
                    });
                    respond(true, {
                        ok: true,
                        path: config_js_1.CONFIG_PATH,
                        config: validated.config,
                        restart: restart,
                        sentinel: {
                            path: sentinelPath,
                            payload: payload,
                        },
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "config.apply": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var snapshot, rawValue, parsedRes, validated, sessionKey, note, restartDelayMsRaw, restartDelayMs, payload, sentinelPath, _c, restart;
        var _d, _e;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!(0, index_js_2.validateConfigApplyParams)(params)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.apply params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateConfigApplyParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _f.sent();
                    if (!requireConfigBaseHash(params, snapshot, respond)) {
                        return [2 /*return*/];
                    }
                    rawValue = params.raw;
                    if (typeof rawValue !== "string") {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config.apply params: raw (string) required"));
                        return [2 /*return*/];
                    }
                    parsedRes = (0, config_js_1.parseConfigJson5)(rawValue);
                    if (!parsedRes.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, parsedRes.error));
                        return [2 /*return*/];
                    }
                    validated = (0, config_js_1.validateConfigObjectWithPlugins)(parsedRes.parsed);
                    if (!validated.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid config", {
                            details: { issues: validated.issues },
                        }));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
                case 2:
                    _f.sent();
                    sessionKey = typeof params.sessionKey === "string"
                        ? ((_d = params.sessionKey) === null || _d === void 0 ? void 0 : _d.trim()) || undefined
                        : undefined;
                    note = typeof params.note === "string"
                        ? ((_e = params.note) === null || _e === void 0 ? void 0 : _e.trim()) || undefined
                        : undefined;
                    restartDelayMsRaw = params.restartDelayMs;
                    restartDelayMs = typeof restartDelayMsRaw === "number" && Number.isFinite(restartDelayMsRaw)
                        ? Math.max(0, Math.floor(restartDelayMsRaw))
                        : undefined;
                    payload = {
                        kind: "config-apply",
                        status: "ok",
                        ts: Date.now(),
                        sessionKey: sessionKey,
                        message: note !== null && note !== void 0 ? note : null,
                        doctorHint: (0, restart_sentinel_js_1.formatDoctorNonInteractiveHint)(),
                        stats: {
                            mode: "config.apply",
                            root: config_js_1.CONFIG_PATH,
                        },
                    };
                    sentinelPath = null;
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, restart_sentinel_js_1.writeRestartSentinel)(payload)];
                case 4:
                    sentinelPath = _f.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _c = _f.sent();
                    sentinelPath = null;
                    return [3 /*break*/, 6];
                case 6:
                    restart = (0, restart_js_1.scheduleGatewaySigusr1Restart)({
                        delayMs: restartDelayMs,
                        reason: "config.apply",
                    });
                    respond(true, {
                        ok: true,
                        path: config_js_1.CONFIG_PATH,
                        config: validated.config,
                        restart: restart,
                        sentinel: {
                            path: sentinelPath,
                            payload: payload,
                        },
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
