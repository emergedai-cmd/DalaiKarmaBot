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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOpenAiHttpRequest = handleOpenAiHttpRequest;
var node_crypto_1 = require("node:crypto");
var history_js_1 = require("../auto-reply/reply/history.js");
var deps_js_1 = require("../cli/deps.js");
var agent_js_1 = require("../commands/agent.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var runtime_js_1 = require("../runtime.js");
var auth_js_1 = require("./auth.js");
var http_common_js_1 = require("./http-common.js");
var http_utils_js_1 = require("./http-utils.js");
function writeSse(res, data) {
    res.write("data: ".concat(JSON.stringify(data), "\n\n"));
}
function asMessages(val) {
    return Array.isArray(val) ? val : [];
}
function extractTextContent(content) {
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .map(function (part) {
            if (!part || typeof part !== "object") {
                return "";
            }
            var type = part.type;
            var text = part.text;
            var inputText = part.input_text;
            if (type === "text" && typeof text === "string") {
                return text;
            }
            if (type === "input_text" && typeof text === "string") {
                return text;
            }
            if (typeof inputText === "string") {
                return inputText;
            }
            return "";
        })
            .filter(Boolean)
            .join("\n");
    }
    return "";
}
function buildAgentPrompt(messagesUnknown) {
    var _a, _b;
    var messages = asMessages(messagesUnknown);
    var systemParts = [];
    var conversationEntries = [];
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var msg = messages_1[_i];
        if (!msg || typeof msg !== "object") {
            continue;
        }
        var role = typeof msg.role === "string" ? msg.role.trim() : "";
        var content = extractTextContent(msg.content).trim();
        if (!role || !content) {
            continue;
        }
        if (role === "system" || role === "developer") {
            systemParts.push(content);
            continue;
        }
        var normalizedRole = role === "function" ? "tool" : role;
        if (normalizedRole !== "user" && normalizedRole !== "assistant" && normalizedRole !== "tool") {
            continue;
        }
        var name_1 = typeof msg.name === "string" ? msg.name.trim() : "";
        var sender = normalizedRole === "assistant"
            ? "Assistant"
            : normalizedRole === "user"
                ? "User"
                : name_1
                    ? "Tool:".concat(name_1)
                    : "Tool";
        conversationEntries.push({
            role: normalizedRole,
            entry: { sender: sender, body: content },
        });
    }
    var message = "";
    if (conversationEntries.length > 0) {
        var currentIndex = -1;
        for (var i = conversationEntries.length - 1; i >= 0; i -= 1) {
            var entryRole = (_a = conversationEntries[i]) === null || _a === void 0 ? void 0 : _a.role;
            if (entryRole === "user" || entryRole === "tool") {
                currentIndex = i;
                break;
            }
        }
        if (currentIndex < 0) {
            currentIndex = conversationEntries.length - 1;
        }
        var currentEntry = (_b = conversationEntries[currentIndex]) === null || _b === void 0 ? void 0 : _b.entry;
        if (currentEntry) {
            var historyEntries = conversationEntries.slice(0, currentIndex).map(function (entry) { return entry.entry; });
            if (historyEntries.length === 0) {
                message = currentEntry.body;
            }
            else {
                var formatEntry = function (entry) { return "".concat(entry.sender, ": ").concat(entry.body); };
                message = (0, history_js_1.buildHistoryContextFromEntries)({
                    entries: __spreadArray(__spreadArray([], historyEntries, true), [currentEntry], false),
                    currentMessage: formatEntry(currentEntry),
                    formatEntry: formatEntry,
                });
            }
        }
    }
    return {
        message: message,
        extraSystemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : undefined,
    };
}
function resolveOpenAiSessionKey(params) {
    return (0, http_utils_js_1.resolveSessionKey)(__assign(__assign({}, params), { prefix: "openai" }));
}
function coerceRequest(val) {
    if (!val || typeof val !== "object") {
        return {};
    }
    return val;
}
function handleOpenAiHttpRequest(req, res, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var url, token, authResult, body, payload, stream, model, user, agentId, sessionKey, prompt, runId, deps, result, payloads, content, err_1, wroteRole, sawAssistantDelta, closed, unsubscribe;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://".concat(req.headers.host || "localhost"));
                    if (url.pathname !== "/v1/chat/completions") {
                        return [2 /*return*/, false];
                    }
                    if (req.method !== "POST") {
                        (0, http_common_js_1.sendMethodNotAllowed)(res);
                        return [2 /*return*/, true];
                    }
                    token = (0, http_utils_js_1.getBearerToken)(req);
                    return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                            auth: opts.auth,
                            connectAuth: { token: token, password: token },
                            req: req,
                            trustedProxies: opts.trustedProxies,
                        })];
                case 1:
                    authResult = _c.sent();
                    if (!authResult.ok) {
                        (0, http_common_js_1.sendUnauthorized)(res);
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, http_common_js_1.readJsonBodyOrError)(req, res, (_b = opts.maxBodyBytes) !== null && _b !== void 0 ? _b : 1024 * 1024)];
                case 2:
                    body = _c.sent();
                    if (body === undefined) {
                        return [2 /*return*/, true];
                    }
                    payload = coerceRequest(body);
                    stream = Boolean(payload.stream);
                    model = typeof payload.model === "string" ? payload.model : "openclaw";
                    user = typeof payload.user === "string" ? payload.user : undefined;
                    agentId = (0, http_utils_js_1.resolveAgentIdForRequest)({ req: req, model: model });
                    sessionKey = resolveOpenAiSessionKey({ req: req, agentId: agentId, user: user });
                    prompt = buildAgentPrompt(payload.messages);
                    if (!prompt.message) {
                        (0, http_common_js_1.sendJson)(res, 400, {
                            error: {
                                message: "Missing user message in `messages`.",
                                type: "invalid_request_error",
                            },
                        });
                        return [2 /*return*/, true];
                    }
                    runId = "chatcmpl_".concat((0, node_crypto_1.randomUUID)());
                    deps = (0, deps_js_1.createDefaultDeps)();
                    if (!!stream) return [3 /*break*/, 7];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                            message: prompt.message,
                            extraSystemPrompt: prompt.extraSystemPrompt,
                            sessionKey: sessionKey,
                            runId: runId,
                            deliver: false,
                            messageChannel: "webchat",
                            bestEffortDeliver: false,
                        }, runtime_js_1.defaultRuntime, deps)];
                case 4:
                    result = _c.sent();
                    payloads = result === null || result === void 0 ? void 0 : result.payloads;
                    content = Array.isArray(payloads) && payloads.length > 0
                        ? payloads
                            .map(function (p) { return (typeof p.text === "string" ? p.text : ""); })
                            .filter(Boolean)
                            .join("\n\n")
                        : "No response from OpenClaw.";
                    (0, http_common_js_1.sendJson)(res, 200, {
                        id: runId,
                        object: "chat.completion",
                        created: Math.floor(Date.now() / 1000),
                        model: model,
                        choices: [
                            {
                                index: 0,
                                message: { role: "assistant", content: content },
                                finish_reason: "stop",
                            },
                        ],
                        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
                    });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    (0, http_common_js_1.sendJson)(res, 500, {
                        error: { message: String(err_1), type: "api_error" },
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, true];
                case 7:
                    (0, http_common_js_1.setSseHeaders)(res);
                    wroteRole = false;
                    sawAssistantDelta = false;
                    closed = false;
                    unsubscribe = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                        var _a, _b, _c;
                        if (evt.runId !== runId) {
                            return;
                        }
                        if (closed) {
                            return;
                        }
                        if (evt.stream === "assistant") {
                            var delta = (_a = evt.data) === null || _a === void 0 ? void 0 : _a.delta;
                            var text = (_b = evt.data) === null || _b === void 0 ? void 0 : _b.text;
                            var content = typeof delta === "string" ? delta : typeof text === "string" ? text : "";
                            if (!content) {
                                return;
                            }
                            if (!wroteRole) {
                                wroteRole = true;
                                writeSse(res, {
                                    id: runId,
                                    object: "chat.completion.chunk",
                                    created: Math.floor(Date.now() / 1000),
                                    model: model,
                                    choices: [{ index: 0, delta: { role: "assistant" } }],
                                });
                            }
                            sawAssistantDelta = true;
                            writeSse(res, {
                                id: runId,
                                object: "chat.completion.chunk",
                                created: Math.floor(Date.now() / 1000),
                                model: model,
                                choices: [
                                    {
                                        index: 0,
                                        delta: { content: content },
                                        finish_reason: null,
                                    },
                                ],
                            });
                            return;
                        }
                        if (evt.stream === "lifecycle") {
                            var phase = (_c = evt.data) === null || _c === void 0 ? void 0 : _c.phase;
                            if (phase === "end" || phase === "error") {
                                closed = true;
                                unsubscribe();
                                (0, http_common_js_1.writeDone)(res);
                                res.end();
                            }
                        }
                    });
                    req.on("close", function () {
                        closed = true;
                        unsubscribe();
                    });
                    void (function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, payloads, content, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, 3, 4]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                                            message: prompt.message,
                                            extraSystemPrompt: prompt.extraSystemPrompt,
                                            sessionKey: sessionKey,
                                            runId: runId,
                                            deliver: false,
                                            messageChannel: "webchat",
                                            bestEffortDeliver: false,
                                        }, runtime_js_1.defaultRuntime, deps)];
                                case 1:
                                    result = _a.sent();
                                    if (closed) {
                                        return [2 /*return*/];
                                    }
                                    if (!sawAssistantDelta) {
                                        if (!wroteRole) {
                                            wroteRole = true;
                                            writeSse(res, {
                                                id: runId,
                                                object: "chat.completion.chunk",
                                                created: Math.floor(Date.now() / 1000),
                                                model: model,
                                                choices: [{ index: 0, delta: { role: "assistant" } }],
                                            });
                                        }
                                        payloads = result === null || result === void 0 ? void 0 : result.payloads;
                                        content = Array.isArray(payloads) && payloads.length > 0
                                            ? payloads
                                                .map(function (p) { return (typeof p.text === "string" ? p.text : ""); })
                                                .filter(Boolean)
                                                .join("\n\n")
                                            : "No response from OpenClaw.";
                                        sawAssistantDelta = true;
                                        writeSse(res, {
                                            id: runId,
                                            object: "chat.completion.chunk",
                                            created: Math.floor(Date.now() / 1000),
                                            model: model,
                                            choices: [
                                                {
                                                    index: 0,
                                                    delta: { content: content },
                                                    finish_reason: null,
                                                },
                                            ],
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 2:
                                    err_2 = _a.sent();
                                    if (closed) {
                                        return [2 /*return*/];
                                    }
                                    writeSse(res, {
                                        id: runId,
                                        object: "chat.completion.chunk",
                                        created: Math.floor(Date.now() / 1000),
                                        model: model,
                                        choices: [
                                            {
                                                index: 0,
                                                delta: { content: "Error: ".concat(String(err_2)) },
                                                finish_reason: "stop",
                                            },
                                        ],
                                    });
                                    (0, agent_events_js_1.emitAgentEvent)({
                                        runId: runId,
                                        stream: "lifecycle",
                                        data: { phase: "error" },
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    if (!closed) {
                                        closed = true;
                                        unsubscribe();
                                        (0, http_common_js_1.writeDone)(res);
                                        res.end();
                                    }
                                    return [7 /*endfinally*/];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })();
                    return [2 /*return*/, true];
            }
        });
    });
}
