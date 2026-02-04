"use strict";
/**
 * Twitch message monitor - processes incoming messages and routes to agents.
 *
 * This monitor connects to the Twitch client manager, processes incoming messages,
 * resolves agent routes, and handles replies.
 */
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
exports.monitorTwitchProvider = monitorTwitchProvider;
var access_control_js_1 = require("./access-control.js");
var client_manager_registry_js_1 = require("./client-manager-registry.js");
var runtime_js_1 = require("./runtime.js");
var markdown_js_1 = require("./utils/markdown.js");
/**
 * Process an incoming Twitch message and dispatch to agent.
 */
function processTwitchMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var message, account, accountId, config, runtime, core, statusSink, cfg, route, rawBody, body, ctxPayload, storePath, tableMode;
        var _this = this;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    message = params.message, account = params.account, accountId = params.accountId, config = params.config, runtime = params.runtime, core = params.core, statusSink = params.statusSink;
                    cfg = config;
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: cfg,
                        channel: "twitch",
                        accountId: accountId,
                        peer: {
                            kind: "group", // Twitch chat is always group-like
                            id: message.channel,
                        },
                    });
                    rawBody = message.message;
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Twitch",
                        from: (_a = message.displayName) !== null && _a !== void 0 ? _a : message.username,
                        timestamp: (_b = message.timestamp) === null || _b === void 0 ? void 0 : _b.getTime(),
                        envelope: core.channel.reply.resolveEnvelopeFormatOptions(cfg),
                        body: rawBody,
                    });
                    ctxPayload = core.channel.reply.finalizeInboundContext({
                        Body: body,
                        RawBody: rawBody,
                        CommandBody: rawBody,
                        From: "twitch:user:".concat(message.userId),
                        To: "twitch:channel:".concat(message.channel),
                        SessionKey: route.sessionKey,
                        AccountId: route.accountId,
                        ChatType: "group",
                        ConversationLabel: message.channel,
                        SenderName: (_c = message.displayName) !== null && _c !== void 0 ? _c : message.username,
                        SenderId: message.userId,
                        SenderUsername: message.username,
                        Provider: "twitch",
                        Surface: "twitch",
                        MessageSid: message.id,
                        OriginatingChannel: "twitch",
                        OriginatingTo: "twitch:channel:".concat(message.channel),
                    });
                    storePath = core.channel.session.resolveStorePath((_d = cfg.session) === null || _d === void 0 ? void 0 : _d.store, {
                        agentId: route.agentId,
                    });
                    return [4 /*yield*/, core.channel.session.recordInboundSession({
                            storePath: storePath,
                            sessionKey: (_e = ctxPayload.SessionKey) !== null && _e !== void 0 ? _e : route.sessionKey,
                            ctx: ctxPayload,
                            onRecordError: function (err) {
                                var _a;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "Failed updating session meta: ".concat(String(err)));
                            },
                        })];
                case 1:
                    _f.sent();
                    tableMode = core.channel.text.resolveMarkdownTableMode({
                        cfg: cfg,
                        channel: "twitch",
                        accountId: accountId,
                    });
                    return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                            ctx: ctxPayload,
                            cfg: cfg,
                            dispatcherOptions: {
                                deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, deliverTwitchReply({
                                                    payload: payload,
                                                    channel: message.channel,
                                                    account: account,
                                                    accountId: accountId,
                                                    config: config,
                                                    tableMode: tableMode,
                                                    runtime: runtime,
                                                    statusSink: statusSink,
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                            },
                        })];
                case 2:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Deliver a reply to Twitch chat.
 */
function deliverTwitchReply(params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, channel, account, accountId, config, runtime, statusSink, clientManager, client, textToSend, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    payload = params.payload, channel = params.channel, account = params.account, accountId = params.accountId, config = params.config, runtime = params.runtime, statusSink = params.statusSink;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    clientManager = (0, client_manager_registry_js_1.getOrCreateClientManager)(accountId, {
                        info: function (msg) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, msg); },
                        warn: function (msg) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, msg); },
                        error: function (msg) { var _a; return (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, msg); },
                        debug: function (msg) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, msg); },
                    });
                    return [4 /*yield*/, clientManager.getClient(account, config, accountId)];
                case 2:
                    client = _d.sent();
                    if (!client) {
                        (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "No client available for sending reply");
                        return [2 /*return*/];
                    }
                    // Send the reply
                    if (!payload.text) {
                        (_b = runtime.error) === null || _b === void 0 ? void 0 : _b.call(runtime, "No text to send in reply payload");
                        return [2 /*return*/];
                    }
                    textToSend = (0, markdown_js_1.stripMarkdownForTwitch)(payload.text);
                    return [4 /*yield*/, client.say(channel, textToSend)];
                case 3:
                    _d.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _d.sent();
                    (_c = runtime.error) === null || _c === void 0 ? void 0 : _c.call(runtime, "Failed to send reply: ".concat(String(err_1)));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Main monitor provider for Twitch.
 *
 * Sets up message handlers and processes incoming messages.
 */
function monitorTwitchProvider(options) {
    return __awaiter(this, void 0, void 0, function () {
        var account, accountId, config, runtime, abortSignal, statusSink, core, stopped, coreLogger, logVerboseMessage, logger, clientManager, error_1, errorMsg, unregisterHandler, stop;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    account = options.account, accountId = options.accountId, config = options.config, runtime = options.runtime, abortSignal = options.abortSignal, statusSink = options.statusSink;
                    core = (0, runtime_js_1.getTwitchRuntime)();
                    stopped = false;
                    coreLogger = core.logging.getChildLogger({ module: "twitch" });
                    logVerboseMessage = function (message) {
                        var _a;
                        if (!core.logging.shouldLogVerbose()) {
                            return;
                        }
                        (_a = coreLogger.debug) === null || _a === void 0 ? void 0 : _a.call(coreLogger, message);
                    };
                    logger = {
                        info: function (msg) { return coreLogger.info(msg); },
                        warn: function (msg) { return coreLogger.warn(msg); },
                        error: function (msg) { return coreLogger.error(msg); },
                        debug: logVerboseMessage,
                    };
                    clientManager = (0, client_manager_registry_js_1.getOrCreateClientManager)(accountId, logger);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clientManager.getClient(account, config, accountId)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    errorMsg = error_1 instanceof Error ? error_1.message : String(error_1);
                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "Failed to connect: ".concat(errorMsg));
                    throw error_1;
                case 4:
                    unregisterHandler = clientManager.onMessage(account, function (message) {
                        if (stopped) {
                            return;
                        }
                        // Access control check
                        var botUsername = account.username.toLowerCase();
                        if (message.username.toLowerCase() === botUsername) {
                            return; // Ignore own messages
                        }
                        var access = (0, access_control_js_1.checkTwitchAccessControl)({
                            message: message,
                            account: account,
                            botUsername: botUsername,
                        });
                        if (!access.allowed) {
                            return;
                        }
                        statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastInboundAt: Date.now() });
                        // Fire-and-forget: process message without blocking
                        void processTwitchMessage({
                            message: message,
                            account: account,
                            accountId: accountId,
                            config: config,
                            runtime: runtime,
                            core: core,
                            statusSink: statusSink,
                        }).catch(function (err) {
                            var _a;
                            (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "Message processing failed: ".concat(String(err)));
                        });
                    });
                    stop = function () {
                        stopped = true;
                        unregisterHandler();
                    };
                    abortSignal.addEventListener("abort", stop, { once: true });
                    return [2 /*return*/, { stop: stop }];
            }
        });
    });
}
