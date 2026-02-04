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
exports.agentViaGatewayCommand = agentViaGatewayCommand;
exports.agentCliCommand = agentCliCommand;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var registry_js_1 = require("../channels/registry.js");
var command_format_js_1 = require("../cli/command-format.js");
var progress_js_1 = require("../cli/progress.js");
var config_js_1 = require("../config/config.js");
var call_js_1 = require("../gateway/call.js");
var session_key_js_1 = require("../routing/session-key.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var agent_js_1 = require("./agent.js");
var session_js_1 = require("./agent/session.js");
function parseTimeoutSeconds(opts) {
    var _a, _b, _c;
    var raw = opts.timeout !== undefined
        ? Number.parseInt(String(opts.timeout), 10)
        : ((_c = (_b = (_a = opts.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.timeoutSeconds) !== null && _c !== void 0 ? _c : 600);
    if (Number.isNaN(raw) || raw <= 0) {
        throw new Error("--timeout must be a positive integer (seconds)");
    }
    return raw;
}
function formatPayloadForLog(payload) {
    var _a;
    var lines = [];
    if (payload.text) {
        lines.push(payload.text.trimEnd());
    }
    var mediaUrl = typeof payload.mediaUrl === "string" && payload.mediaUrl.trim()
        ? payload.mediaUrl.trim()
        : undefined;
    var media = (_a = payload.mediaUrls) !== null && _a !== void 0 ? _a : (mediaUrl ? [mediaUrl] : []);
    for (var _i = 0, media_1 = media; _i < media_1.length; _i++) {
        var url = media_1[_i];
        lines.push("MEDIA:".concat(url));
    }
    return lines.join("\n").trimEnd();
}
function agentViaGatewayCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var body, cfg, agentIdRaw, agentId, knownAgents, timeoutSeconds, gatewayTimeoutMs, sessionKey, channel, idempotencyKey, response, result, payloads, _i, payloads_1, payload, out;
        var _this = this;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    body = ((_a = opts.message) !== null && _a !== void 0 ? _a : "").trim();
                    if (!body) {
                        throw new Error("Message (--message) is required");
                    }
                    if (!opts.to && !opts.sessionId && !opts.agent) {
                        throw new Error("Pass --to <E.164>, --session-id, or --agent to choose a session");
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    agentIdRaw = (_b = opts.agent) === null || _b === void 0 ? void 0 : _b.trim();
                    agentId = agentIdRaw ? (0, session_key_js_1.normalizeAgentId)(agentIdRaw) : undefined;
                    if (agentId) {
                        knownAgents = (0, agent_scope_js_1.listAgentIds)(cfg);
                        if (!knownAgents.includes(agentId)) {
                            throw new Error("Unknown agent id \"".concat(agentIdRaw, "\". Use \"").concat((0, command_format_js_1.formatCliCommand)("openclaw agents list"), "\" to see configured agents."));
                        }
                    }
                    timeoutSeconds = parseTimeoutSeconds({ cfg: cfg, timeout: opts.timeout });
                    gatewayTimeoutMs = Math.max(10000, (timeoutSeconds + 30) * 1000);
                    sessionKey = (0, session_js_1.resolveSessionKeyForRequest)({
                        cfg: cfg,
                        agentId: agentId,
                        to: opts.to,
                        sessionId: opts.sessionId,
                    }).sessionKey;
                    channel = (_c = (0, message_channel_js_1.normalizeMessageChannel)(opts.channel)) !== null && _c !== void 0 ? _c : registry_js_1.DEFAULT_CHAT_CHANNEL;
                    idempotencyKey = ((_d = opts.runId) === null || _d === void 0 ? void 0 : _d.trim()) || (0, call_js_1.randomIdempotencyKey)();
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({
                            label: "Waiting for agent reply…",
                            indeterminate: true,
                            enabled: opts.json !== true,
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, call_js_1.callGateway)({
                                            method: "agent",
                                            params: {
                                                message: body,
                                                agentId: agentId,
                                                to: opts.to,
                                                replyTo: opts.replyTo,
                                                sessionId: opts.sessionId,
                                                sessionKey: sessionKey,
                                                thinking: opts.thinking,
                                                deliver: Boolean(opts.deliver),
                                                channel: channel,
                                                replyChannel: opts.replyChannel,
                                                replyAccountId: opts.replyAccount,
                                                timeout: timeoutSeconds,
                                                lane: opts.lane,
                                                extraSystemPrompt: opts.extraSystemPrompt,
                                                idempotencyKey: idempotencyKey,
                                            },
                                            expectFinal: true,
                                            timeoutMs: gatewayTimeoutMs,
                                            clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
                                            mode: message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 1:
                    response = _f.sent();
                    if (opts.json) {
                        runtime.log(JSON.stringify(response, null, 2));
                        return [2 /*return*/, response];
                    }
                    result = response === null || response === void 0 ? void 0 : response.result;
                    payloads = (_e = result === null || result === void 0 ? void 0 : result.payloads) !== null && _e !== void 0 ? _e : [];
                    if (payloads.length === 0) {
                        runtime.log((response === null || response === void 0 ? void 0 : response.summary) ? String(response.summary) : "No reply from agent.");
                        return [2 /*return*/, response];
                    }
                    for (_i = 0, payloads_1 = payloads; _i < payloads_1.length; _i++) {
                        payload = payloads_1[_i];
                        out = formatPayloadForLog(payload);
                        if (out) {
                            runtime.log(out);
                        }
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
function agentCliCommand(opts, runtime, deps) {
    return __awaiter(this, void 0, void 0, function () {
        var localOpts, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    localOpts = __assign(__assign({}, opts), { agentId: opts.agent, replyAccountId: opts.replyAccount });
                    if (!(opts.local === true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, agent_js_1.agentCommand)(localOpts, runtime, deps)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _b.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, agentViaGatewayCommand(opts, runtime)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    err_1 = _b.sent();
                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "Gateway agent failed; falling back to embedded: ".concat(String(err_1)));
                    return [4 /*yield*/, (0, agent_js_1.agentCommand)(localOpts, runtime, deps)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [2 /*return*/];
            }
        });
    });
}
