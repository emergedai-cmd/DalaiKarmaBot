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
exports.createHooksRequestHandler = createHooksRequestHandler;
exports.createGatewayHttpServer = createGatewayHttpServer;
exports.attachGatewayUpgradeHandler = attachGatewayUpgradeHandler;
var node_http_1 = require("node:http");
var node_https_1 = require("node:https");
var identity_avatar_js_1 = require("../agents/identity-avatar.js");
var a2ui_js_1 = require("../canvas-host/a2ui.js");
var config_js_1 = require("../config/config.js");
var index_js_1 = require("../slack/http/index.js");
var control_ui_js_1 = require("./control-ui.js");
var hooks_mapping_js_1 = require("./hooks-mapping.js");
var hooks_js_1 = require("./hooks.js");
var openai_http_js_1 = require("./openai-http.js");
var openresponses_http_js_1 = require("./openresponses-http.js");
var tools_invoke_http_js_1 = require("./tools-invoke-http.js");
function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body));
}
function createHooksRequestHandler(opts) {
    var _this = this;
    var getHooksConfig = opts.getHooksConfig, bindHost = opts.bindHost, port = opts.port, logHooks = opts.logHooks, dispatchAgentHook = opts.dispatchAgentHook, dispatchWakeHook = opts.dispatchWakeHook;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var hooksConfig, url, basePath, _a, token, fromQuery, subPath, body, status_1, payload, headers, normalized, normalized, runId, mapped, channel, runId, err_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    hooksConfig = getHooksConfig();
                    if (!hooksConfig) {
                        return [2 /*return*/, false];
                    }
                    url = new URL((_b = req.url) !== null && _b !== void 0 ? _b : "/", "http://".concat(bindHost, ":").concat(port));
                    basePath = hooksConfig.basePath;
                    if (url.pathname !== basePath && !url.pathname.startsWith("".concat(basePath, "/"))) {
                        return [2 /*return*/, false];
                    }
                    _a = (0, hooks_js_1.extractHookToken)(req, url), token = _a.token, fromQuery = _a.fromQuery;
                    if (!token || token !== hooksConfig.token) {
                        res.statusCode = 401;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Unauthorized");
                        return [2 /*return*/, true];
                    }
                    if (fromQuery) {
                        logHooks.warn("Hook token provided via query parameter is deprecated for security reasons. " +
                            "Tokens in URLs appear in logs, browser history, and referrer headers. " +
                            "Use Authorization: Bearer <token> or X-OpenClaw-Token header instead.");
                    }
                    if (req.method !== "POST") {
                        res.statusCode = 405;
                        res.setHeader("Allow", "POST");
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Method Not Allowed");
                        return [2 /*return*/, true];
                    }
                    subPath = url.pathname.slice(basePath.length).replace(/^\/+/, "");
                    if (!subPath) {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Not Found");
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, hooks_js_1.readJsonBody)(req, hooksConfig.maxBodyBytes)];
                case 1:
                    body = _e.sent();
                    if (!body.ok) {
                        status_1 = body.error === "payload too large" ? 413 : 400;
                        sendJson(res, status_1, { ok: false, error: body.error });
                        return [2 /*return*/, true];
                    }
                    payload = typeof body.value === "object" && body.value !== null ? body.value : {};
                    headers = (0, hooks_js_1.normalizeHookHeaders)(req);
                    if (subPath === "wake") {
                        normalized = (0, hooks_js_1.normalizeWakePayload)(payload);
                        if (!normalized.ok) {
                            sendJson(res, 400, { ok: false, error: normalized.error });
                            return [2 /*return*/, true];
                        }
                        dispatchWakeHook(normalized.value);
                        sendJson(res, 200, { ok: true, mode: normalized.value.mode });
                        return [2 /*return*/, true];
                    }
                    if (subPath === "agent") {
                        normalized = (0, hooks_js_1.normalizeAgentPayload)(payload);
                        if (!normalized.ok) {
                            sendJson(res, 400, { ok: false, error: normalized.error });
                            return [2 /*return*/, true];
                        }
                        runId = dispatchAgentHook(normalized.value);
                        sendJson(res, 202, { ok: true, runId: runId });
                        return [2 /*return*/, true];
                    }
                    if (!(hooksConfig.mappings.length > 0)) return [3 /*break*/, 5];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, hooks_mapping_js_1.applyHookMappings)(hooksConfig.mappings, {
                            payload: payload,
                            headers: headers,
                            url: url,
                            path: subPath,
                        })];
                case 3:
                    mapped = _e.sent();
                    if (mapped) {
                        if (!mapped.ok) {
                            sendJson(res, 400, { ok: false, error: mapped.error });
                            return [2 /*return*/, true];
                        }
                        if (mapped.action === null) {
                            res.statusCode = 204;
                            res.end();
                            return [2 /*return*/, true];
                        }
                        if (mapped.action.kind === "wake") {
                            dispatchWakeHook({
                                text: mapped.action.text,
                                mode: mapped.action.mode,
                            });
                            sendJson(res, 200, { ok: true, mode: mapped.action.mode });
                            return [2 /*return*/, true];
                        }
                        channel = (0, hooks_js_1.resolveHookChannel)(mapped.action.channel);
                        if (!channel) {
                            sendJson(res, 400, { ok: false, error: (0, hooks_js_1.getHookChannelError)() });
                            return [2 /*return*/, true];
                        }
                        runId = dispatchAgentHook({
                            message: mapped.action.message,
                            name: (_c = mapped.action.name) !== null && _c !== void 0 ? _c : "Hook",
                            wakeMode: mapped.action.wakeMode,
                            sessionKey: (_d = mapped.action.sessionKey) !== null && _d !== void 0 ? _d : "",
                            deliver: (0, hooks_js_1.resolveHookDeliver)(mapped.action.deliver),
                            channel: channel,
                            to: mapped.action.to,
                            model: mapped.action.model,
                            thinking: mapped.action.thinking,
                            timeoutSeconds: mapped.action.timeoutSeconds,
                            allowUnsafeExternalContent: mapped.action.allowUnsafeExternalContent,
                        });
                        sendJson(res, 202, { ok: true, runId: runId });
                        return [2 /*return*/, true];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _e.sent();
                    logHooks.warn("hook mapping failed: ".concat(String(err_1)));
                    sendJson(res, 500, { ok: false, error: "hook mapping failed" });
                    return [2 /*return*/, true];
                case 5:
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/plain; charset=utf-8");
                    res.end("Not Found");
                    return [2 /*return*/, true];
            }
        });
    }); };
}
function createGatewayHttpServer(opts) {
    var canvasHost = opts.canvasHost, controlUiEnabled = opts.controlUiEnabled, controlUiBasePath = opts.controlUiBasePath, openAiChatCompletionsEnabled = opts.openAiChatCompletionsEnabled, openResponsesEnabled = opts.openResponsesEnabled, openResponsesConfig = opts.openResponsesConfig, handleHooksRequest = opts.handleHooksRequest, handlePluginRequest = opts.handlePluginRequest, resolvedAuth = opts.resolvedAuth;
    var httpServer = opts.tlsOptions
        ? (0, node_https_1.createServer)(opts.tlsOptions, function (req, res) {
            void handleRequest(req, res);
        })
        : (0, node_http_1.createServer)(function (req, res) {
            void handleRequest(req, res);
        });
    function handleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var configSnapshot_1, trustedProxies, _a, _b;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        // Don't interfere with WebSocket upgrades; ws handles the 'upgrade' event.
                        if (String((_c = req.headers.upgrade) !== null && _c !== void 0 ? _c : "").toLowerCase() === "websocket") {
                            return [2 /*return*/];
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 14, , 15]);
                        configSnapshot_1 = (0, config_js_1.loadConfig)();
                        trustedProxies = (_e = (_d = configSnapshot_1.gateway) === null || _d === void 0 ? void 0 : _d.trustedProxies) !== null && _e !== void 0 ? _e : [];
                        return [4 /*yield*/, handleHooksRequest(req, res)];
                    case 2:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, tools_invoke_http_js_1.handleToolsInvokeHttpRequest)(req, res, {
                                auth: resolvedAuth,
                                trustedProxies: trustedProxies,
                            })];
                    case 3:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, index_js_1.handleSlackHttpRequest)(req, res)];
                    case 4:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        _a = handlePluginRequest;
                        if (!_a) return [3 /*break*/, 6];
                        return [4 /*yield*/, handlePluginRequest(req, res)];
                    case 5:
                        _a = (_f.sent());
                        _f.label = 6;
                    case 6:
                        if (_a) {
                            return [2 /*return*/];
                        }
                        if (!openResponsesEnabled) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, openresponses_http_js_1.handleOpenResponsesHttpRequest)(req, res, {
                                auth: resolvedAuth,
                                config: openResponsesConfig,
                                trustedProxies: trustedProxies,
                            })];
                    case 7:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        _f.label = 8;
                    case 8:
                        if (!openAiChatCompletionsEnabled) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, openai_http_js_1.handleOpenAiHttpRequest)(req, res, {
                                auth: resolvedAuth,
                                trustedProxies: trustedProxies,
                            })];
                    case 9:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        _f.label = 10;
                    case 10:
                        if (!canvasHost) return [3 /*break*/, 13];
                        return [4 /*yield*/, (0, a2ui_js_1.handleA2uiHttpRequest)(req, res)];
                    case 11:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, canvasHost.handleHttpRequest(req, res)];
                    case 12:
                        if (_f.sent()) {
                            return [2 /*return*/];
                        }
                        _f.label = 13;
                    case 13:
                        if (controlUiEnabled) {
                            if ((0, control_ui_js_1.handleControlUiAvatarRequest)(req, res, {
                                basePath: controlUiBasePath,
                                resolveAvatar: function (agentId) { return (0, identity_avatar_js_1.resolveAgentAvatar)(configSnapshot_1, agentId); },
                            })) {
                                return [2 /*return*/];
                            }
                            if ((0, control_ui_js_1.handleControlUiHttpRequest)(req, res, {
                                basePath: controlUiBasePath,
                                config: configSnapshot_1,
                            })) {
                                return [2 /*return*/];
                            }
                        }
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Not Found");
                        return [3 /*break*/, 15];
                    case 14:
                        _b = _f.sent();
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                        res.end("Internal Server Error");
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    }
    return httpServer;
}
function attachGatewayUpgradeHandler(opts) {
    var httpServer = opts.httpServer, wss = opts.wss, canvasHost = opts.canvasHost;
    httpServer.on("upgrade", function (req, socket, head) {
        if (canvasHost === null || canvasHost === void 0 ? void 0 : canvasHost.handleUpgrade(req, socket, head)) {
            return;
        }
        wss.handleUpgrade(req, socket, head, function (ws) {
            wss.emit("connection", ws, req);
        });
    });
}
