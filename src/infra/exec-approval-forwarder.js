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
exports.createExecApprovalForwarder = createExecApprovalForwarder;
exports.shouldForwardExecApproval = shouldForwardExecApproval;
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var session_key_js_1 = require("../routing/session-key.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var deliver_js_1 = require("./outbound/deliver.js");
var targets_js_1 = require("./outbound/targets.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("gateway/exec-approvals");
var DEFAULT_MODE = "session";
function normalizeMode(mode) {
    return mode !== null && mode !== void 0 ? mode : DEFAULT_MODE;
}
function matchSessionFilter(sessionKey, patterns) {
    return patterns.some(function (pattern) {
        try {
            return sessionKey.includes(pattern) || new RegExp(pattern).test(sessionKey);
        }
        catch (_a) {
            return sessionKey.includes(pattern);
        }
    });
}
function shouldForward(params) {
    var _a, _b, _c, _d;
    var config = params.config;
    if (!(config === null || config === void 0 ? void 0 : config.enabled)) {
        return false;
    }
    if ((_a = config.agentFilter) === null || _a === void 0 ? void 0 : _a.length) {
        var agentId = (_b = params.request.request.agentId) !== null && _b !== void 0 ? _b : (_c = (0, session_key_js_1.parseAgentSessionKey)(params.request.request.sessionKey)) === null || _c === void 0 ? void 0 : _c.agentId;
        if (!agentId) {
            return false;
        }
        if (!config.agentFilter.includes(agentId)) {
            return false;
        }
    }
    if ((_d = config.sessionFilter) === null || _d === void 0 ? void 0 : _d.length) {
        var sessionKey = params.request.request.sessionKey;
        if (!sessionKey) {
            return false;
        }
        if (!matchSessionFilter(sessionKey, config.sessionFilter)) {
            return false;
        }
    }
    return true;
}
function buildTargetKey(target) {
    var _a, _b, _c;
    var channel = (_a = (0, message_channel_js_1.normalizeMessageChannel)(target.channel)) !== null && _a !== void 0 ? _a : target.channel;
    var accountId = (_b = target.accountId) !== null && _b !== void 0 ? _b : "";
    var threadId = (_c = target.threadId) !== null && _c !== void 0 ? _c : "";
    return [channel, target.to, accountId, threadId].join(":");
}
function buildRequestMessage(request, nowMs) {
    var lines = ["🔒 Exec approval required", "ID: ".concat(request.id)];
    lines.push("Command: ".concat(request.request.command));
    if (request.request.cwd) {
        lines.push("CWD: ".concat(request.request.cwd));
    }
    if (request.request.host) {
        lines.push("Host: ".concat(request.request.host));
    }
    if (request.request.agentId) {
        lines.push("Agent: ".concat(request.request.agentId));
    }
    if (request.request.security) {
        lines.push("Security: ".concat(request.request.security));
    }
    if (request.request.ask) {
        lines.push("Ask: ".concat(request.request.ask));
    }
    var expiresIn = Math.max(0, Math.round((request.expiresAtMs - nowMs) / 1000));
    lines.push("Expires in: ".concat(expiresIn, "s"));
    lines.push("Reply with: /approve <id> allow-once|allow-always|deny");
    return lines.join("\n");
}
function decisionLabel(decision) {
    if (decision === "allow-once") {
        return "allowed once";
    }
    if (decision === "allow-always") {
        return "allowed always";
    }
    return "denied";
}
function buildResolvedMessage(resolved) {
    var base = "\u2705 Exec approval ".concat(decisionLabel(resolved.decision), ".");
    var by = resolved.resolvedBy ? " Resolved by ".concat(resolved.resolvedBy, ".") : "";
    return "".concat(base).concat(by, " ID: ").concat(resolved.id);
}
function buildExpiredMessage(request) {
    return "\u23F1\uFE0F Exec approval expired. ID: ".concat(request.id);
}
function defaultResolveSessionTarget(params) {
    var _a, _b, _c, _d;
    var sessionKey = (_a = params.request.request.sessionKey) === null || _a === void 0 ? void 0 : _a.trim();
    if (!sessionKey) {
        return null;
    }
    var parsed = (0, session_key_js_1.parseAgentSessionKey)(sessionKey);
    var agentId = (_c = (_b = parsed === null || parsed === void 0 ? void 0 : parsed.agentId) !== null && _b !== void 0 ? _b : params.request.request.agentId) !== null && _c !== void 0 ? _c : "main";
    var storePath = (0, sessions_js_1.resolveStorePath)((_d = params.cfg.session) === null || _d === void 0 ? void 0 : _d.store, { agentId: agentId });
    var store = (0, sessions_js_1.loadSessionStore)(storePath);
    var entry = store[sessionKey];
    if (!entry) {
        return null;
    }
    var target = (0, targets_js_1.resolveSessionDeliveryTarget)({ entry: entry, requestedChannel: "last" });
    if (!target.channel || !target.to) {
        return null;
    }
    if (!(0, message_channel_js_1.isDeliverableMessageChannel)(target.channel)) {
        return null;
    }
    return {
        channel: target.channel,
        to: target.to,
        accountId: target.accountId,
        threadId: target.threadId,
    };
}
function deliverToTargets(params) {
    return __awaiter(this, void 0, void 0, function () {
        var deliveries;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deliveries = params.targets.map(function (target) { return __awaiter(_this, void 0, void 0, function () {
                        var channel, err_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (params.shouldSend && !params.shouldSend()) {
                                        return [2 /*return*/];
                                    }
                                    channel = (_a = (0, message_channel_js_1.normalizeMessageChannel)(target.channel)) !== null && _a !== void 0 ? _a : target.channel;
                                    if (!(0, message_channel_js_1.isDeliverableMessageChannel)(channel)) {
                                        return [2 /*return*/];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, params.deliver({
                                            cfg: params.cfg,
                                            channel: channel,
                                            to: target.to,
                                            accountId: target.accountId,
                                            threadId: target.threadId,
                                            payloads: [{ text: params.text }],
                                        })];
                                case 2:
                                    _b.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _b.sent();
                                    log.error("exec approvals: failed to deliver to ".concat(channel, ":").concat(target.to, ": ").concat(String(err_1)));
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.allSettled(deliveries)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createExecApprovalForwarder(deps) {
    var _this = this;
    var _a, _b, _c, _d;
    if (deps === void 0) { deps = {}; }
    var getConfig = (_a = deps.getConfig) !== null && _a !== void 0 ? _a : config_js_1.loadConfig;
    var deliver = (_b = deps.deliver) !== null && _b !== void 0 ? _b : deliver_js_1.deliverOutboundPayloads;
    var nowMs = (_c = deps.nowMs) !== null && _c !== void 0 ? _c : Date.now;
    var resolveSessionTarget = (_d = deps.resolveSessionTarget) !== null && _d !== void 0 ? _d : defaultResolveSessionTarget;
    var pending = new Map();
    var handleRequested = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, config, mode, targets, seen, sessionTarget, key, explicitTargets, _i, explicitTargets_1, target, key, expiresInMs, timeoutId, pendingEntry, text;
        var _this = this;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cfg = getConfig();
                    config = (_a = cfg.approvals) === null || _a === void 0 ? void 0 : _a.exec;
                    if (!shouldForward({ config: config, request: request })) {
                        return [2 /*return*/];
                    }
                    mode = normalizeMode(config === null || config === void 0 ? void 0 : config.mode);
                    targets = [];
                    seen = new Set();
                    if (mode === "session" || mode === "both") {
                        sessionTarget = resolveSessionTarget({ cfg: cfg, request: request });
                        if (sessionTarget) {
                            key = buildTargetKey(sessionTarget);
                            if (!seen.has(key)) {
                                seen.add(key);
                                targets.push(__assign(__assign({}, sessionTarget), { source: "session" }));
                            }
                        }
                    }
                    if (mode === "targets" || mode === "both") {
                        explicitTargets = (_b = config === null || config === void 0 ? void 0 : config.targets) !== null && _b !== void 0 ? _b : [];
                        for (_i = 0, explicitTargets_1 = explicitTargets; _i < explicitTargets_1.length; _i++) {
                            target = explicitTargets_1[_i];
                            key = buildTargetKey(target);
                            if (seen.has(key)) {
                                continue;
                            }
                            seen.add(key);
                            targets.push(__assign(__assign({}, target), { source: "target" }));
                        }
                    }
                    if (targets.length === 0) {
                        return [2 /*return*/];
                    }
                    expiresInMs = Math.max(0, request.expiresAtMs - nowMs());
                    timeoutId = setTimeout(function () {
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            var entry, expiredText;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        entry = pending.get(request.id);
                                        if (!entry) {
                                            return [2 /*return*/];
                                        }
                                        pending.delete(request.id);
                                        expiredText = buildExpiredMessage(request);
                                        return [4 /*yield*/, deliverToTargets({ cfg: cfg, targets: entry.targets, text: expiredText, deliver: deliver })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                    }, expiresInMs);
                    (_c = timeoutId.unref) === null || _c === void 0 ? void 0 : _c.call(timeoutId);
                    pendingEntry = { request: request, targets: targets, timeoutId: timeoutId };
                    pending.set(request.id, pendingEntry);
                    if (pending.get(request.id) !== pendingEntry) {
                        return [2 /*return*/];
                    }
                    text = buildRequestMessage(request, nowMs());
                    return [4 /*yield*/, deliverToTargets({
                            cfg: cfg,
                            targets: targets,
                            text: text,
                            deliver: deliver,
                            shouldSend: function () { return pending.get(request.id) === pendingEntry; },
                        })];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleResolved = function (resolved) { return __awaiter(_this, void 0, void 0, function () {
        var entry, cfg, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entry = pending.get(resolved.id);
                    if (!entry) {
                        return [2 /*return*/];
                    }
                    if (entry.timeoutId) {
                        clearTimeout(entry.timeoutId);
                    }
                    pending.delete(resolved.id);
                    cfg = getConfig();
                    text = buildResolvedMessage(resolved);
                    return [4 /*yield*/, deliverToTargets({ cfg: cfg, targets: entry.targets, text: text, deliver: deliver })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var stop = function () {
        for (var _i = 0, _a = pending.values(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.timeoutId) {
                clearTimeout(entry.timeoutId);
            }
        }
        pending.clear();
    };
    return { handleRequested: handleRequested, handleResolved: handleResolved, stop: stop };
}
function shouldForwardExecApproval(params) {
    return shouldForward(params);
}
