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
exports.AcpGatewayAgent = void 0;
var sdk_1 = require("@agentclientprotocol/sdk");
var node_crypto_1 = require("node:crypto");
var commands_js_1 = require("./commands.js");
var event_mapper_js_1 = require("./event-mapper.js");
var meta_js_1 = require("./meta.js");
var session_mapper_js_1 = require("./session-mapper.js");
var session_js_1 = require("./session.js");
var types_js_1 = require("./types.js");
var AcpGatewayAgent = /** @class */ (function () {
    function AcpGatewayAgent(connection, gateway, opts) {
        if (opts === void 0) { opts = {}; }
        var _a;
        this.pendingPrompts = new Map();
        this.connection = connection;
        this.gateway = gateway;
        this.opts = opts;
        this.log = opts.verbose ? function (msg) { return process.stderr.write("[acp] ".concat(msg, "\n")); } : function () { };
        this.sessionStore = (_a = opts.sessionStore) !== null && _a !== void 0 ? _a : session_js_1.defaultAcpSessionStore;
    }
    AcpGatewayAgent.prototype.start = function () {
        this.log("ready");
    };
    AcpGatewayAgent.prototype.handleGatewayReconnect = function () {
        this.log("gateway reconnected");
    };
    AcpGatewayAgent.prototype.handleGatewayDisconnect = function (reason) {
        this.log("gateway disconnected: ".concat(reason));
        for (var _i = 0, _a = this.pendingPrompts.values(); _i < _a.length; _i++) {
            var pending = _a[_i];
            pending.reject(new Error("Gateway disconnected: ".concat(reason)));
            this.sessionStore.clearActiveRun(pending.sessionId);
        }
        this.pendingPrompts.clear();
    };
    AcpGatewayAgent.prototype.handleGatewayEvent = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(evt.event === "chat")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handleChatEvent(evt)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(evt.event === "agent")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.handleAgentEvent(evt)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.initialize = function (_params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        protocolVersion: sdk_1.PROTOCOL_VERSION,
                        agentCapabilities: {
                            loadSession: true,
                            promptCapabilities: {
                                image: true,
                                audio: false,
                                embeddedContext: true,
                            },
                            mcpCapabilities: {
                                http: false,
                                sse: false,
                            },
                            sessionCapabilities: {
                                list: {},
                            },
                        },
                        agentInfo: types_js_1.ACP_AGENT_INFO,
                        authMethods: [],
                    }];
            });
        });
    };
    AcpGatewayAgent.prototype.newSession = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, meta, sessionKey, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (params.mcpServers.length > 0) {
                            this.log("ignoring ".concat(params.mcpServers.length, " MCP servers"));
                        }
                        sessionId = (0, node_crypto_1.randomUUID)();
                        meta = (0, session_mapper_js_1.parseSessionMeta)(params._meta);
                        return [4 /*yield*/, (0, session_mapper_js_1.resolveSessionKey)({
                                meta: meta,
                                fallbackKey: "acp:".concat(sessionId),
                                gateway: this.gateway,
                                opts: this.opts,
                            })];
                    case 1:
                        sessionKey = _a.sent();
                        return [4 /*yield*/, (0, session_mapper_js_1.resetSessionIfNeeded)({
                                meta: meta,
                                sessionKey: sessionKey,
                                gateway: this.gateway,
                                opts: this.opts,
                            })];
                    case 2:
                        _a.sent();
                        session = this.sessionStore.createSession({
                            sessionId: sessionId,
                            sessionKey: sessionKey,
                            cwd: params.cwd,
                        });
                        this.log("newSession: ".concat(session.sessionId, " -> ").concat(session.sessionKey));
                        return [4 /*yield*/, this.sendAvailableCommands(session.sessionId)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { sessionId: session.sessionId }];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.loadSession = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var meta, sessionKey, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (params.mcpServers.length > 0) {
                            this.log("ignoring ".concat(params.mcpServers.length, " MCP servers"));
                        }
                        meta = (0, session_mapper_js_1.parseSessionMeta)(params._meta);
                        return [4 /*yield*/, (0, session_mapper_js_1.resolveSessionKey)({
                                meta: meta,
                                fallbackKey: params.sessionId,
                                gateway: this.gateway,
                                opts: this.opts,
                            })];
                    case 1:
                        sessionKey = _a.sent();
                        return [4 /*yield*/, (0, session_mapper_js_1.resetSessionIfNeeded)({
                                meta: meta,
                                sessionKey: sessionKey,
                                gateway: this.gateway,
                                opts: this.opts,
                            })];
                    case 2:
                        _a.sent();
                        session = this.sessionStore.createSession({
                            sessionId: params.sessionId,
                            sessionKey: sessionKey,
                            cwd: params.cwd,
                        });
                        this.log("loadSession: ".concat(session.sessionId, " -> ").concat(session.sessionKey));
                        return [4 /*yield*/, this.sendAvailableCommands(session.sessionId)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {}];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.unstable_listSessions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, result, cwd;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        limit = (_a = (0, meta_js_1.readNumber)(params._meta, ["limit"])) !== null && _a !== void 0 ? _a : 100;
                        return [4 /*yield*/, this.gateway.request("sessions.list", { limit: limit })];
                    case 1:
                        result = _c.sent();
                        cwd = (_b = params.cwd) !== null && _b !== void 0 ? _b : process.cwd();
                        return [2 /*return*/, {
                                sessions: result.sessions.map(function (session) {
                                    var _a, _b;
                                    return ({
                                        sessionId: session.key,
                                        cwd: cwd,
                                        title: (_b = (_a = session.displayName) !== null && _a !== void 0 ? _a : session.label) !== null && _b !== void 0 ? _b : session.key,
                                        updatedAt: session.updatedAt ? new Date(session.updatedAt).toISOString() : undefined,
                                        _meta: {
                                            sessionKey: session.key,
                                            kind: session.kind,
                                            channel: session.channel,
                                        },
                                    });
                                }),
                                nextCursor: null,
                            }];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.authenticate = function (_params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {}];
            });
        });
    };
    AcpGatewayAgent.prototype.setSessionMode = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var session, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = this.sessionStore.getSession(params.sessionId);
                        if (!session) {
                            throw new Error("Session ".concat(params.sessionId, " not found"));
                        }
                        if (!params.modeId) {
                            return [2 /*return*/, {}];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.gateway.request("sessions.patch", {
                                key: session.sessionKey,
                                thinkingLevel: params.modeId,
                            })];
                    case 2:
                        _a.sent();
                        this.log("setSessionMode: ".concat(session.sessionId, " -> ").concat(params.modeId));
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.log("setSessionMode error: ".concat(String(err_1)));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {}];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.prompt = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var session, abortController, runId, meta, userText, attachments, prefixCwd, message;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                session = this.sessionStore.getSession(params.sessionId);
                if (!session) {
                    throw new Error("Session ".concat(params.sessionId, " not found"));
                }
                if (session.abortController) {
                    this.sessionStore.cancelActiveRun(params.sessionId);
                }
                abortController = new AbortController();
                runId = (0, node_crypto_1.randomUUID)();
                this.sessionStore.setActiveRun(params.sessionId, runId, abortController);
                meta = (0, session_mapper_js_1.parseSessionMeta)(params._meta);
                userText = (0, event_mapper_js_1.extractTextFromPrompt)(params.prompt);
                attachments = (0, event_mapper_js_1.extractAttachmentsFromPrompt)(params.prompt);
                prefixCwd = (_b = (_a = meta.prefixCwd) !== null && _a !== void 0 ? _a : this.opts.prefixCwd) !== null && _b !== void 0 ? _b : true;
                message = prefixCwd ? "[Working directory: ".concat(session.cwd, "]\n\n").concat(userText) : userText;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.pendingPrompts.set(params.sessionId, {
                            sessionId: params.sessionId,
                            sessionKey: session.sessionKey,
                            idempotencyKey: runId,
                            resolve: resolve,
                            reject: reject,
                        });
                        _this.gateway
                            .request("chat.send", {
                            sessionKey: session.sessionKey,
                            message: message,
                            attachments: attachments.length > 0 ? attachments : undefined,
                            idempotencyKey: runId,
                            thinking: (0, meta_js_1.readString)(params._meta, ["thinking", "thinkingLevel"]),
                            deliver: (0, meta_js_1.readBool)(params._meta, ["deliver"]),
                            timeoutMs: (0, meta_js_1.readNumber)(params._meta, ["timeoutMs"]),
                        }, { expectFinal: true })
                            .catch(function (err) {
                            _this.pendingPrompts.delete(params.sessionId);
                            _this.sessionStore.clearActiveRun(params.sessionId);
                            reject(err instanceof Error ? err : new Error(String(err)));
                        });
                    })];
            });
        });
    };
    AcpGatewayAgent.prototype.cancel = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var session, err_2, pending;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = this.sessionStore.getSession(params.sessionId);
                        if (!session) {
                            return [2 /*return*/];
                        }
                        this.sessionStore.cancelActiveRun(params.sessionId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.gateway.request("chat.abort", { sessionKey: session.sessionKey })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        this.log("cancel error: ".concat(String(err_2)));
                        return [3 /*break*/, 4];
                    case 4:
                        pending = this.pendingPrompts.get(params.sessionId);
                        if (pending) {
                            this.pendingPrompts.delete(params.sessionId);
                            pending.resolve({ stopReason: "cancelled" });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.handleAgentEvent = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, stream, data, sessionKey, phase, name, toolCallId, pending, args, isError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = evt.payload;
                        if (!payload) {
                            return [2 /*return*/];
                        }
                        stream = payload.stream;
                        data = payload.data;
                        sessionKey = payload.sessionKey;
                        if (!stream || !data || !sessionKey) {
                            return [2 /*return*/];
                        }
                        if (stream !== "tool") {
                            return [2 /*return*/];
                        }
                        phase = data.phase;
                        name = data.name;
                        toolCallId = data.toolCallId;
                        if (!toolCallId) {
                            return [2 /*return*/];
                        }
                        pending = this.findPendingBySessionKey(sessionKey);
                        if (!pending) {
                            return [2 /*return*/];
                        }
                        if (!(phase === "start")) return [3 /*break*/, 2];
                        if (!pending.toolCalls) {
                            pending.toolCalls = new Set();
                        }
                        if (pending.toolCalls.has(toolCallId)) {
                            return [2 /*return*/];
                        }
                        pending.toolCalls.add(toolCallId);
                        args = data.args;
                        return [4 /*yield*/, this.connection.sessionUpdate({
                                sessionId: pending.sessionId,
                                update: {
                                    sessionUpdate: "tool_call",
                                    toolCallId: toolCallId,
                                    title: (0, event_mapper_js_1.formatToolTitle)(name, args),
                                    status: "in_progress",
                                    rawInput: args,
                                    kind: (0, event_mapper_js_1.inferToolKind)(name),
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(phase === "result")) return [3 /*break*/, 4];
                        isError = Boolean(data.isError);
                        return [4 /*yield*/, this.connection.sessionUpdate({
                                sessionId: pending.sessionId,
                                update: {
                                    sessionUpdate: "tool_call_update",
                                    toolCallId: toolCallId,
                                    status: isError ? "failed" : "completed",
                                    rawOutput: data.result,
                                },
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.handleChatEvent = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, sessionKey, state, runId, messageData, pending;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = evt.payload;
                        if (!payload) {
                            return [2 /*return*/];
                        }
                        sessionKey = payload.sessionKey;
                        state = payload.state;
                        runId = payload.runId;
                        messageData = payload.message;
                        if (!sessionKey || !state) {
                            return [2 /*return*/];
                        }
                        pending = this.findPendingBySessionKey(sessionKey);
                        if (!pending) {
                            return [2 /*return*/];
                        }
                        if (runId && pending.idempotencyKey !== runId) {
                            return [2 /*return*/];
                        }
                        if (!(state === "delta" && messageData)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handleDeltaEvent(pending.sessionId, messageData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (state === "final") {
                            this.finishPrompt(pending.sessionId, pending, "end_turn");
                            return [2 /*return*/];
                        }
                        if (state === "aborted") {
                            this.finishPrompt(pending.sessionId, pending, "cancelled");
                            return [2 /*return*/];
                        }
                        if (state === "error") {
                            this.finishPrompt(pending.sessionId, pending, "refusal");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.handleDeltaEvent = function (sessionId, messageData) {
        return __awaiter(this, void 0, void 0, function () {
            var content, fullText, pending, sentSoFar, newText;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        content = messageData.content;
                        fullText = (_b = (_a = content === null || content === void 0 ? void 0 : content.find(function (c) { return c.type === "text"; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
                        pending = this.pendingPrompts.get(sessionId);
                        if (!pending) {
                            return [2 /*return*/];
                        }
                        sentSoFar = (_c = pending.sentTextLength) !== null && _c !== void 0 ? _c : 0;
                        if (fullText.length <= sentSoFar) {
                            return [2 /*return*/];
                        }
                        newText = fullText.slice(sentSoFar);
                        pending.sentTextLength = fullText.length;
                        pending.sentText = fullText;
                        return [4 /*yield*/, this.connection.sessionUpdate({
                                sessionId: sessionId,
                                update: {
                                    sessionUpdate: "agent_message_chunk",
                                    content: { type: "text", text: newText },
                                },
                            })];
                    case 1:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AcpGatewayAgent.prototype.finishPrompt = function (sessionId, pending, stopReason) {
        this.pendingPrompts.delete(sessionId);
        this.sessionStore.clearActiveRun(sessionId);
        pending.resolve({ stopReason: stopReason });
    };
    AcpGatewayAgent.prototype.findPendingBySessionKey = function (sessionKey) {
        for (var _i = 0, _a = this.pendingPrompts.values(); _i < _a.length; _i++) {
            var pending = _a[_i];
            if (pending.sessionKey === sessionKey) {
                return pending;
            }
        }
        return undefined;
    };
    AcpGatewayAgent.prototype.sendAvailableCommands = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.sessionUpdate({
                            sessionId: sessionId,
                            update: {
                                sessionUpdate: "available_commands_update",
                                availableCommands: (0, commands_js_1.getAvailableCommands)(),
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AcpGatewayAgent;
}());
exports.AcpGatewayAgent = AcpGatewayAgent;
