"use strict";
/**
 * OpenResponses HTTP Handler
 *
 * Implements the OpenResponses `/v1/responses` endpoint for OpenClaw Gateway.
 *
 * @see https://www.open-responses.com/
 */
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
exports.buildAgentPrompt = buildAgentPrompt;
exports.handleOpenResponsesHttpRequest = handleOpenResponsesHttpRequest;
var node_crypto_1 = require("node:crypto");
var history_js_1 = require("../auto-reply/reply/history.js");
var deps_js_1 = require("../cli/deps.js");
var agent_js_1 = require("../commands/agent.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var input_files_js_1 = require("../media/input-files.js");
var runtime_js_1 = require("../runtime.js");
var auth_js_1 = require("./auth.js");
var http_common_js_1 = require("./http-common.js");
var http_utils_js_1 = require("./http-utils.js");
var open_responses_schema_js_1 = require("./open-responses.schema.js");
var DEFAULT_BODY_BYTES = 20 * 1024 * 1024;
function writeSseEvent(res, event) {
    res.write("event: ".concat(event.type, "\n"));
    res.write("data: ".concat(JSON.stringify(event), "\n\n"));
}
function extractTextContent(content) {
    if (typeof content === "string") {
        return content;
    }
    return content
        .map(function (part) {
        if (part.type === "input_text") {
            return part.text;
        }
        if (part.type === "output_text") {
            return part.text;
        }
        return "";
    })
        .filter(Boolean)
        .join("\n");
}
function resolveResponsesLimits(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var files = config === null || config === void 0 ? void 0 : config.files;
    var images = config === null || config === void 0 ? void 0 : config.images;
    return {
        maxBodyBytes: (_a = config === null || config === void 0 ? void 0 : config.maxBodyBytes) !== null && _a !== void 0 ? _a : DEFAULT_BODY_BYTES,
        files: {
            allowUrl: (_b = files === null || files === void 0 ? void 0 : files.allowUrl) !== null && _b !== void 0 ? _b : true,
            allowedMimes: (0, input_files_js_1.normalizeMimeList)(files === null || files === void 0 ? void 0 : files.allowedMimes, input_files_js_1.DEFAULT_INPUT_FILE_MIMES),
            maxBytes: (_c = files === null || files === void 0 ? void 0 : files.maxBytes) !== null && _c !== void 0 ? _c : input_files_js_1.DEFAULT_INPUT_FILE_MAX_BYTES,
            maxChars: (_d = files === null || files === void 0 ? void 0 : files.maxChars) !== null && _d !== void 0 ? _d : input_files_js_1.DEFAULT_INPUT_FILE_MAX_CHARS,
            maxRedirects: (_e = files === null || files === void 0 ? void 0 : files.maxRedirects) !== null && _e !== void 0 ? _e : input_files_js_1.DEFAULT_INPUT_MAX_REDIRECTS,
            timeoutMs: (_f = files === null || files === void 0 ? void 0 : files.timeoutMs) !== null && _f !== void 0 ? _f : input_files_js_1.DEFAULT_INPUT_TIMEOUT_MS,
            pdf: {
                maxPages: (_h = (_g = files === null || files === void 0 ? void 0 : files.pdf) === null || _g === void 0 ? void 0 : _g.maxPages) !== null && _h !== void 0 ? _h : input_files_js_1.DEFAULT_INPUT_PDF_MAX_PAGES,
                maxPixels: (_k = (_j = files === null || files === void 0 ? void 0 : files.pdf) === null || _j === void 0 ? void 0 : _j.maxPixels) !== null && _k !== void 0 ? _k : input_files_js_1.DEFAULT_INPUT_PDF_MAX_PIXELS,
                minTextChars: (_m = (_l = files === null || files === void 0 ? void 0 : files.pdf) === null || _l === void 0 ? void 0 : _l.minTextChars) !== null && _m !== void 0 ? _m : input_files_js_1.DEFAULT_INPUT_PDF_MIN_TEXT_CHARS,
            },
        },
        images: {
            allowUrl: (_o = images === null || images === void 0 ? void 0 : images.allowUrl) !== null && _o !== void 0 ? _o : true,
            allowedMimes: (0, input_files_js_1.normalizeMimeList)(images === null || images === void 0 ? void 0 : images.allowedMimes, input_files_js_1.DEFAULT_INPUT_IMAGE_MIMES),
            maxBytes: (_p = images === null || images === void 0 ? void 0 : images.maxBytes) !== null && _p !== void 0 ? _p : input_files_js_1.DEFAULT_INPUT_IMAGE_MAX_BYTES,
            maxRedirects: (_q = images === null || images === void 0 ? void 0 : images.maxRedirects) !== null && _q !== void 0 ? _q : input_files_js_1.DEFAULT_INPUT_MAX_REDIRECTS,
            timeoutMs: (_r = images === null || images === void 0 ? void 0 : images.timeoutMs) !== null && _r !== void 0 ? _r : input_files_js_1.DEFAULT_INPUT_TIMEOUT_MS,
        },
    };
}
function extractClientTools(body) {
    var _a;
    return ((_a = body.tools) !== null && _a !== void 0 ? _a : []);
}
function applyToolChoice(params) {
    var _a, _b;
    var tools = params.tools, toolChoice = params.toolChoice;
    if (!toolChoice) {
        return { tools: tools };
    }
    if (toolChoice === "none") {
        return { tools: [] };
    }
    if (toolChoice === "required") {
        if (tools.length === 0) {
            throw new Error("tool_choice=required but no tools were provided");
        }
        return {
            tools: tools,
            extraSystemPrompt: "You must call one of the available tools before responding.",
        };
    }
    if (typeof toolChoice === "object" && toolChoice.type === "function") {
        var targetName_1 = (_b = (_a = toolChoice.function) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.trim();
        if (!targetName_1) {
            throw new Error("tool_choice.function.name is required");
        }
        var matched = tools.filter(function (tool) { var _a; return ((_a = tool.function) === null || _a === void 0 ? void 0 : _a.name) === targetName_1; });
        if (matched.length === 0) {
            throw new Error("tool_choice requested unknown tool: ".concat(targetName_1));
        }
        return {
            tools: matched,
            extraSystemPrompt: "You must call the ".concat(targetName_1, " tool before responding."),
        };
    }
    return { tools: tools };
}
function buildAgentPrompt(input) {
    var _a, _b;
    if (typeof input === "string") {
        return { message: input };
    }
    var systemParts = [];
    var conversationEntries = [];
    for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var item = input_1[_i];
        if (item.type === "message") {
            var content = extractTextContent(item.content).trim();
            if (!content) {
                continue;
            }
            if (item.role === "system" || item.role === "developer") {
                systemParts.push(content);
                continue;
            }
            var normalizedRole = item.role === "assistant" ? "assistant" : "user";
            var sender = normalizedRole === "assistant" ? "Assistant" : "User";
            conversationEntries.push({
                role: normalizedRole,
                entry: { sender: sender, body: content },
            });
        }
        else if (item.type === "function_call_output") {
            conversationEntries.push({
                role: "tool",
                entry: { sender: "Tool:".concat(item.call_id), body: item.output },
            });
        }
        // Skip reasoning and item_reference for prompt building (Phase 1)
    }
    var message = "";
    if (conversationEntries.length > 0) {
        // Find the last user or tool message as the current message
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
function resolveOpenResponsesSessionKey(params) {
    return (0, http_utils_js_1.resolveSessionKey)(__assign(__assign({}, params), { prefix: "openresponses" }));
}
function createEmptyUsage() {
    return { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
}
function toUsage(value) {
    var _a, _b, _c, _d, _e;
    if (!value) {
        return createEmptyUsage();
    }
    var input = (_a = value.input) !== null && _a !== void 0 ? _a : 0;
    var output = (_b = value.output) !== null && _b !== void 0 ? _b : 0;
    var cacheRead = (_c = value.cacheRead) !== null && _c !== void 0 ? _c : 0;
    var cacheWrite = (_d = value.cacheWrite) !== null && _d !== void 0 ? _d : 0;
    var total = (_e = value.total) !== null && _e !== void 0 ? _e : input + output + cacheRead + cacheWrite;
    return {
        input_tokens: Math.max(0, input),
        output_tokens: Math.max(0, output),
        total_tokens: Math.max(0, total),
    };
}
function extractUsageFromResult(result) {
    var _a;
    var meta = result === null || result === void 0 ? void 0 : result.meta;
    var usage = meta && typeof meta === "object" ? (_a = meta.agentMeta) === null || _a === void 0 ? void 0 : _a.usage : undefined;
    return toUsage(usage);
}
function createResponseResource(params) {
    var _a;
    return {
        id: params.id,
        object: "response",
        created_at: Math.floor(Date.now() / 1000),
        status: params.status,
        model: params.model,
        output: params.output,
        usage: (_a = params.usage) !== null && _a !== void 0 ? _a : createEmptyUsage(),
        error: params.error,
    };
}
function createAssistantOutputItem(params) {
    return {
        type: "message",
        id: params.id,
        role: "assistant",
        content: [{ type: "output_text", text: params.text }],
        status: params.status,
    };
}
function handleOpenResponsesHttpRequest(req, res, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var url, token, authResult, limits, maxBodyBytes, body, parseResult, issue, message, payload, stream, model, user, images, fileContexts, _i, _a, item, _b, _c, part, source, sourceType, imageSource, image, source, sourceType, file, err_1, clientTools, toolChoicePrompt, resolvedClientTools, toolChoiceResult, agentId, sessionKey, prompt, fileContext, toolChoiceContext, extraSystemPrompt, responseId, outputItemId, deps, streamParams, result, payloads, usage, meta, stopReason, pendingToolCalls, functionCall, functionCallItemId, response_1, content, response, err_2, response, accumulatedText, sawAssistantDelta, closed, unsubscribe, finalUsage, finalizeRequested, maybeFinalize, requestFinalize, initialResponse, outputItem;
        var _this = this;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    url = new URL((_d = req.url) !== null && _d !== void 0 ? _d : "/", "http://".concat(req.headers.host || "localhost"));
                    if (url.pathname !== "/v1/responses") {
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
                    authResult = _h.sent();
                    if (!authResult.ok) {
                        (0, http_common_js_1.sendUnauthorized)(res);
                        return [2 /*return*/, true];
                    }
                    limits = resolveResponsesLimits(opts.config);
                    maxBodyBytes = (_e = opts.maxBodyBytes) !== null && _e !== void 0 ? _e : (((_f = opts.config) === null || _f === void 0 ? void 0 : _f.maxBodyBytes)
                        ? limits.maxBodyBytes
                        : Math.max(limits.maxBodyBytes, limits.files.maxBytes * 2, limits.images.maxBytes * 2));
                    return [4 /*yield*/, (0, http_common_js_1.readJsonBodyOrError)(req, res, maxBodyBytes)];
                case 2:
                    body = _h.sent();
                    if (body === undefined) {
                        return [2 /*return*/, true];
                    }
                    parseResult = open_responses_schema_js_1.CreateResponseBodySchema.safeParse(body);
                    if (!parseResult.success) {
                        issue = parseResult.error.issues[0];
                        message = issue ? "".concat(issue.path.join("."), ": ").concat(issue.message) : "Invalid request body";
                        (0, http_common_js_1.sendJson)(res, 400, {
                            error: { message: message, type: "invalid_request_error" },
                        });
                        return [2 /*return*/, true];
                    }
                    payload = parseResult.data;
                    stream = Boolean(payload.stream);
                    model = payload.model;
                    user = payload.user;
                    images = [];
                    fileContexts = [];
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, 12, , 13]);
                    if (!Array.isArray(payload.input)) return [3 /*break*/, 11];
                    _i = 0, _a = payload.input;
                    _h.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    item = _a[_i];
                    if (!(item.type === "message" && typeof item.content !== "string")) return [3 /*break*/, 10];
                    _b = 0, _c = item.content;
                    _h.label = 5;
                case 5:
                    if (!(_b < _c.length)) return [3 /*break*/, 10];
                    part = _c[_b];
                    if (!(part.type === "input_image")) return [3 /*break*/, 7];
                    source = part.source;
                    sourceType = source.type === "base64" || source.type === "url" ? source.type : undefined;
                    if (!sourceType) {
                        throw new Error("input_image must have 'source.url' or 'source.data'");
                    }
                    imageSource = {
                        type: sourceType,
                        url: source.url,
                        data: source.data,
                        mediaType: source.media_type,
                    };
                    return [4 /*yield*/, (0, input_files_js_1.extractImageContentFromSource)(imageSource, limits.images)];
                case 6:
                    image = _h.sent();
                    images.push(image);
                    return [3 /*break*/, 9];
                case 7:
                    if (!(part.type === "input_file")) return [3 /*break*/, 9];
                    source = part.source;
                    sourceType = source.type === "base64" || source.type === "url" ? source.type : undefined;
                    if (!sourceType) {
                        throw new Error("input_file must have 'source.url' or 'source.data'");
                    }
                    return [4 /*yield*/, (0, input_files_js_1.extractFileContentFromSource)({
                            source: {
                                type: sourceType,
                                url: source.url,
                                data: source.data,
                                mediaType: source.media_type,
                                filename: source.filename,
                            },
                            limits: limits.files,
                        })];
                case 8:
                    file = _h.sent();
                    if ((_g = file.text) === null || _g === void 0 ? void 0 : _g.trim()) {
                        fileContexts.push("<file name=\"".concat(file.filename, "\">\n").concat(file.text, "\n</file>"));
                    }
                    else if (file.images && file.images.length > 0) {
                        fileContexts.push("<file name=\"".concat(file.filename, "\">[PDF content rendered to images]</file>"));
                    }
                    if (file.images && file.images.length > 0) {
                        images = images.concat(file.images);
                    }
                    _h.label = 9;
                case 9:
                    _b++;
                    return [3 /*break*/, 5];
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_1 = _h.sent();
                    (0, http_common_js_1.sendJson)(res, 400, {
                        error: { message: String(err_1), type: "invalid_request_error" },
                    });
                    return [2 /*return*/, true];
                case 13:
                    clientTools = extractClientTools(payload);
                    resolvedClientTools = clientTools;
                    try {
                        toolChoiceResult = applyToolChoice({
                            tools: clientTools,
                            toolChoice: payload.tool_choice,
                        });
                        resolvedClientTools = toolChoiceResult.tools;
                        toolChoicePrompt = toolChoiceResult.extraSystemPrompt;
                    }
                    catch (err) {
                        (0, http_common_js_1.sendJson)(res, 400, {
                            error: { message: String(err), type: "invalid_request_error" },
                        });
                        return [2 /*return*/, true];
                    }
                    agentId = (0, http_utils_js_1.resolveAgentIdForRequest)({ req: req, model: model });
                    sessionKey = resolveOpenResponsesSessionKey({ req: req, agentId: agentId, user: user });
                    prompt = buildAgentPrompt(payload.input);
                    fileContext = fileContexts.length > 0 ? fileContexts.join("\n\n") : undefined;
                    toolChoiceContext = toolChoicePrompt === null || toolChoicePrompt === void 0 ? void 0 : toolChoicePrompt.trim();
                    extraSystemPrompt = [
                        payload.instructions,
                        prompt.extraSystemPrompt,
                        toolChoiceContext,
                        fileContext,
                    ]
                        .filter(Boolean)
                        .join("\n\n");
                    if (!prompt.message) {
                        (0, http_common_js_1.sendJson)(res, 400, {
                            error: {
                                message: "Missing user message in `input`.",
                                type: "invalid_request_error",
                            },
                        });
                        return [2 /*return*/, true];
                    }
                    responseId = "resp_".concat((0, node_crypto_1.randomUUID)());
                    outputItemId = "msg_".concat((0, node_crypto_1.randomUUID)());
                    deps = (0, deps_js_1.createDefaultDeps)();
                    streamParams = typeof payload.max_output_tokens === "number"
                        ? { maxTokens: payload.max_output_tokens }
                        : undefined;
                    if (!!stream) return [3 /*break*/, 18];
                    _h.label = 14;
                case 14:
                    _h.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                            message: prompt.message,
                            images: images.length > 0 ? images : undefined,
                            clientTools: resolvedClientTools.length > 0 ? resolvedClientTools : undefined,
                            extraSystemPrompt: extraSystemPrompt || undefined,
                            streamParams: streamParams !== null && streamParams !== void 0 ? streamParams : undefined,
                            sessionKey: sessionKey,
                            runId: responseId,
                            deliver: false,
                            messageChannel: "webchat",
                            bestEffortDeliver: false,
                        }, runtime_js_1.defaultRuntime, deps)];
                case 15:
                    result = _h.sent();
                    payloads = result === null || result === void 0 ? void 0 : result.payloads;
                    usage = extractUsageFromResult(result);
                    meta = result === null || result === void 0 ? void 0 : result.meta;
                    stopReason = meta && typeof meta === "object" ? meta.stopReason : undefined;
                    pendingToolCalls = meta && typeof meta === "object"
                        ? meta
                            .pendingToolCalls
                        : undefined;
                    // If agent called a client tool, return function_call instead of text
                    if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
                        functionCall = pendingToolCalls[0];
                        functionCallItemId = "call_".concat((0, node_crypto_1.randomUUID)());
                        response_1 = createResponseResource({
                            id: responseId,
                            model: model,
                            status: "incomplete",
                            output: [
                                {
                                    type: "function_call",
                                    id: functionCallItemId,
                                    call_id: functionCall.id,
                                    name: functionCall.name,
                                    arguments: functionCall.arguments,
                                },
                            ],
                            usage: usage,
                        });
                        (0, http_common_js_1.sendJson)(res, 200, response_1);
                        return [2 /*return*/, true];
                    }
                    content = Array.isArray(payloads) && payloads.length > 0
                        ? payloads
                            .map(function (p) { return (typeof p.text === "string" ? p.text : ""); })
                            .filter(Boolean)
                            .join("\n\n")
                        : "No response from OpenClaw.";
                    response = createResponseResource({
                        id: responseId,
                        model: model,
                        status: "completed",
                        output: [
                            createAssistantOutputItem({ id: outputItemId, text: content, status: "completed" }),
                        ],
                        usage: usage,
                    });
                    (0, http_common_js_1.sendJson)(res, 200, response);
                    return [3 /*break*/, 17];
                case 16:
                    err_2 = _h.sent();
                    response = createResponseResource({
                        id: responseId,
                        model: model,
                        status: "failed",
                        output: [],
                        error: { code: "api_error", message: String(err_2) },
                    });
                    (0, http_common_js_1.sendJson)(res, 500, response);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/, true];
                case 18:
                    // ─────────────────────────────────────────────────────────────────────────
                    // Streaming mode
                    // ─────────────────────────────────────────────────────────────────────────
                    (0, http_common_js_1.setSseHeaders)(res);
                    accumulatedText = "";
                    sawAssistantDelta = false;
                    closed = false;
                    unsubscribe = function () { };
                    finalizeRequested = null;
                    maybeFinalize = function () {
                        if (closed) {
                            return;
                        }
                        if (!finalizeRequested) {
                            return;
                        }
                        if (!finalUsage) {
                            return;
                        }
                        var usage = finalUsage;
                        closed = true;
                        unsubscribe();
                        writeSseEvent(res, {
                            type: "response.output_text.done",
                            item_id: outputItemId,
                            output_index: 0,
                            content_index: 0,
                            text: finalizeRequested.text,
                        });
                        writeSseEvent(res, {
                            type: "response.content_part.done",
                            item_id: outputItemId,
                            output_index: 0,
                            content_index: 0,
                            part: { type: "output_text", text: finalizeRequested.text },
                        });
                        var completedItem = createAssistantOutputItem({
                            id: outputItemId,
                            text: finalizeRequested.text,
                            status: "completed",
                        });
                        writeSseEvent(res, {
                            type: "response.output_item.done",
                            output_index: 0,
                            item: completedItem,
                        });
                        var finalResponse = createResponseResource({
                            id: responseId,
                            model: model,
                            status: finalizeRequested.status,
                            output: [completedItem],
                            usage: usage,
                        });
                        writeSseEvent(res, { type: "response.completed", response: finalResponse });
                        (0, http_common_js_1.writeDone)(res);
                        res.end();
                    };
                    requestFinalize = function (status, text) {
                        if (finalizeRequested) {
                            return;
                        }
                        finalizeRequested = { status: status, text: text };
                        maybeFinalize();
                    };
                    initialResponse = createResponseResource({
                        id: responseId,
                        model: model,
                        status: "in_progress",
                        output: [],
                    });
                    writeSseEvent(res, { type: "response.created", response: initialResponse });
                    writeSseEvent(res, { type: "response.in_progress", response: initialResponse });
                    outputItem = createAssistantOutputItem({
                        id: outputItemId,
                        text: "",
                        status: "in_progress",
                    });
                    writeSseEvent(res, {
                        type: "response.output_item.added",
                        output_index: 0,
                        item: outputItem,
                    });
                    // Add content part
                    writeSseEvent(res, {
                        type: "response.content_part.added",
                        item_id: outputItemId,
                        output_index: 0,
                        content_index: 0,
                        part: { type: "output_text", text: "" },
                    });
                    unsubscribe = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                        var _a, _b, _c;
                        if (evt.runId !== responseId) {
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
                            sawAssistantDelta = true;
                            accumulatedText += content;
                            writeSseEvent(res, {
                                type: "response.output_text.delta",
                                item_id: outputItemId,
                                output_index: 0,
                                content_index: 0,
                                delta: content,
                            });
                            return;
                        }
                        if (evt.stream === "lifecycle") {
                            var phase = (_c = evt.data) === null || _c === void 0 ? void 0 : _c.phase;
                            if (phase === "end" || phase === "error") {
                                var finalText = accumulatedText || "No response from OpenClaw.";
                                var finalStatus = phase === "error" ? "failed" : "completed";
                                requestFinalize(finalStatus, finalText);
                            }
                        }
                    });
                    req.on("close", function () {
                        closed = true;
                        unsubscribe();
                    });
                    void (function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, resultAny, payloads, meta, stopReason, pendingToolCalls, functionCall, usage, completedItem, functionCallItemId, functionCallItem, incompleteResponse, content, err_3, errorResponse;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, 3, 4]);
                                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                                            message: prompt.message,
                                            images: images.length > 0 ? images : undefined,
                                            clientTools: resolvedClientTools.length > 0 ? resolvedClientTools : undefined,
                                            extraSystemPrompt: extraSystemPrompt || undefined,
                                            streamParams: streamParams !== null && streamParams !== void 0 ? streamParams : undefined,
                                            sessionKey: sessionKey,
                                            runId: responseId,
                                            deliver: false,
                                            messageChannel: "webchat",
                                            bestEffortDeliver: false,
                                        }, runtime_js_1.defaultRuntime, deps)];
                                case 1:
                                    result = _a.sent();
                                    finalUsage = extractUsageFromResult(result);
                                    maybeFinalize();
                                    if (closed) {
                                        return [2 /*return*/];
                                    }
                                    // Fallback: if no streaming deltas were received, send the full response
                                    if (!sawAssistantDelta) {
                                        resultAny = result;
                                        payloads = resultAny.payloads;
                                        meta = resultAny.meta;
                                        stopReason = meta && typeof meta === "object"
                                            ? meta.stopReason
                                            : undefined;
                                        pendingToolCalls = meta && typeof meta === "object"
                                            ? meta.pendingToolCalls
                                            : undefined;
                                        // If agent called a client tool, emit function_call instead of text
                                        if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
                                            functionCall = pendingToolCalls[0];
                                            usage = finalUsage !== null && finalUsage !== void 0 ? finalUsage : createEmptyUsage();
                                            writeSseEvent(res, {
                                                type: "response.output_text.done",
                                                item_id: outputItemId,
                                                output_index: 0,
                                                content_index: 0,
                                                text: "",
                                            });
                                            writeSseEvent(res, {
                                                type: "response.content_part.done",
                                                item_id: outputItemId,
                                                output_index: 0,
                                                content_index: 0,
                                                part: { type: "output_text", text: "" },
                                            });
                                            completedItem = createAssistantOutputItem({
                                                id: outputItemId,
                                                text: "",
                                                status: "completed",
                                            });
                                            writeSseEvent(res, {
                                                type: "response.output_item.done",
                                                output_index: 0,
                                                item: completedItem,
                                            });
                                            functionCallItemId = "call_".concat((0, node_crypto_1.randomUUID)());
                                            functionCallItem = {
                                                type: "function_call",
                                                id: functionCallItemId,
                                                call_id: functionCall.id,
                                                name: functionCall.name,
                                                arguments: functionCall.arguments,
                                            };
                                            writeSseEvent(res, {
                                                type: "response.output_item.added",
                                                output_index: 1,
                                                item: functionCallItem,
                                            });
                                            writeSseEvent(res, {
                                                type: "response.output_item.done",
                                                output_index: 1,
                                                item: __assign(__assign({}, functionCallItem), { status: "completed" }),
                                            });
                                            incompleteResponse = createResponseResource({
                                                id: responseId,
                                                model: model,
                                                status: "incomplete",
                                                output: [completedItem, functionCallItem],
                                                usage: usage,
                                            });
                                            closed = true;
                                            unsubscribe();
                                            writeSseEvent(res, { type: "response.completed", response: incompleteResponse });
                                            (0, http_common_js_1.writeDone)(res);
                                            res.end();
                                            return [2 /*return*/];
                                        }
                                        content = Array.isArray(payloads) && payloads.length > 0
                                            ? payloads
                                                .map(function (p) { return (typeof p.text === "string" ? p.text : ""); })
                                                .filter(Boolean)
                                                .join("\n\n")
                                            : "No response from OpenClaw.";
                                        accumulatedText = content;
                                        sawAssistantDelta = true;
                                        writeSseEvent(res, {
                                            type: "response.output_text.delta",
                                            item_id: outputItemId,
                                            output_index: 0,
                                            content_index: 0,
                                            delta: content,
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 2:
                                    err_3 = _a.sent();
                                    if (closed) {
                                        return [2 /*return*/];
                                    }
                                    finalUsage = finalUsage !== null && finalUsage !== void 0 ? finalUsage : createEmptyUsage();
                                    errorResponse = createResponseResource({
                                        id: responseId,
                                        model: model,
                                        status: "failed",
                                        output: [],
                                        error: { code: "api_error", message: String(err_3) },
                                        usage: finalUsage,
                                    });
                                    writeSseEvent(res, { type: "response.failed", response: errorResponse });
                                    (0, agent_events_js_1.emitAgentEvent)({
                                        runId: responseId,
                                        stream: "lifecycle",
                                        data: { phase: "error" },
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    if (!closed) {
                                        // Emit lifecycle end to trigger completion
                                        (0, agent_events_js_1.emitAgentEvent)({
                                            runId: responseId,
                                            stream: "lifecycle",
                                            data: { phase: "end" },
                                        });
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
