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
exports.createGatewayRuntimeState = createGatewayRuntimeState;
var ws_1 = require("ws");
var a2ui_js_1 = require("../canvas-host/a2ui.js");
var server_js_1 = require("../canvas-host/server.js");
var net_js_1 = require("./net.js");
var server_broadcast_js_1 = require("./server-broadcast.js");
var server_chat_js_1 = require("./server-chat.js");
var server_constants_js_1 = require("./server-constants.js");
var server_http_js_1 = require("./server-http.js");
var hooks_js_1 = require("./server/hooks.js");
var http_listen_js_1 = require("./server/http-listen.js");
var plugins_http_js_1 = require("./server/plugins-http.js");
function createGatewayRuntimeState(params) {
    return __awaiter(this, void 0, void 0, function () {
        var canvasHost, handler, err_1, handleHooksRequest, handlePluginRequest, bindHosts, httpServers, httpBindHosts, _i, bindHosts_1, host, httpServer_1, err_2, httpServer, wss, _a, httpServers_1, server, clients, broadcast, agentRunSeq, dedupe, chatRunState, chatRunRegistry, chatRunBuffers, chatDeltaSentAt, addChatRun, removeChatRun, chatAbortControllers;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    canvasHost = null;
                    if (!params.canvasHostEnabled) return [3 /*break*/, 4];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, server_js_1.createCanvasHostHandler)({
                            runtime: params.canvasRuntime,
                            rootDir: (_b = params.cfg.canvasHost) === null || _b === void 0 ? void 0 : _b.root,
                            basePath: a2ui_js_1.CANVAS_HOST_PATH,
                            allowInTests: params.allowCanvasHostInTests,
                            liveReload: (_c = params.cfg.canvasHost) === null || _c === void 0 ? void 0 : _c.liveReload,
                        })];
                case 2:
                    handler = _e.sent();
                    if (handler.rootDir) {
                        canvasHost = handler;
                        params.logCanvas.info("canvas host mounted at http://".concat(params.bindHost, ":").concat(params.port).concat(a2ui_js_1.CANVAS_HOST_PATH, "/ (root ").concat(handler.rootDir, ")"));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _e.sent();
                    params.logCanvas.warn("canvas host failed to start: ".concat(String(err_1)));
                    return [3 /*break*/, 4];
                case 4:
                    handleHooksRequest = (0, hooks_js_1.createGatewayHooksRequestHandler)({
                        deps: params.deps,
                        getHooksConfig: params.hooksConfig,
                        bindHost: params.bindHost,
                        port: params.port,
                        logHooks: params.logHooks,
                    });
                    handlePluginRequest = (0, plugins_http_js_1.createGatewayPluginRequestHandler)({
                        registry: params.pluginRegistry,
                        log: params.logPlugins,
                    });
                    return [4 /*yield*/, (0, net_js_1.resolveGatewayListenHosts)(params.bindHost)];
                case 5:
                    bindHosts = _e.sent();
                    httpServers = [];
                    httpBindHosts = [];
                    _i = 0, bindHosts_1 = bindHosts;
                    _e.label = 6;
                case 6:
                    if (!(_i < bindHosts_1.length)) return [3 /*break*/, 11];
                    host = bindHosts_1[_i];
                    httpServer_1 = (0, server_http_js_1.createGatewayHttpServer)({
                        canvasHost: canvasHost,
                        controlUiEnabled: params.controlUiEnabled,
                        controlUiBasePath: params.controlUiBasePath,
                        openAiChatCompletionsEnabled: params.openAiChatCompletionsEnabled,
                        openResponsesEnabled: params.openResponsesEnabled,
                        openResponsesConfig: params.openResponsesConfig,
                        handleHooksRequest: handleHooksRequest,
                        handlePluginRequest: handlePluginRequest,
                        resolvedAuth: params.resolvedAuth,
                        tlsOptions: ((_d = params.gatewayTls) === null || _d === void 0 ? void 0 : _d.enabled) ? params.gatewayTls.tlsOptions : undefined,
                    });
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, http_listen_js_1.listenGatewayHttpServer)({
                            httpServer: httpServer_1,
                            bindHost: host,
                            port: params.port,
                        })];
                case 8:
                    _e.sent();
                    httpServers.push(httpServer_1);
                    httpBindHosts.push(host);
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _e.sent();
                    if (host === bindHosts[0]) {
                        throw err_2;
                    }
                    params.log.warn("gateway: failed to bind loopback alias ".concat(host, ":").concat(params.port, " (").concat(String(err_2), ")"));
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11:
                    httpServer = httpServers[0];
                    if (!httpServer) {
                        throw new Error("Gateway HTTP server failed to start");
                    }
                    wss = new ws_1.WebSocketServer({
                        noServer: true,
                        maxPayload: server_constants_js_1.MAX_PAYLOAD_BYTES,
                    });
                    for (_a = 0, httpServers_1 = httpServers; _a < httpServers_1.length; _a++) {
                        server = httpServers_1[_a];
                        (0, server_http_js_1.attachGatewayUpgradeHandler)({ httpServer: server, wss: wss, canvasHost: canvasHost });
                    }
                    clients = new Set();
                    broadcast = (0, server_broadcast_js_1.createGatewayBroadcaster)({ clients: clients }).broadcast;
                    agentRunSeq = new Map();
                    dedupe = new Map();
                    chatRunState = (0, server_chat_js_1.createChatRunState)();
                    chatRunRegistry = chatRunState.registry;
                    chatRunBuffers = chatRunState.buffers;
                    chatDeltaSentAt = chatRunState.deltaSentAt;
                    addChatRun = chatRunRegistry.add;
                    removeChatRun = chatRunRegistry.remove;
                    chatAbortControllers = new Map();
                    return [2 /*return*/, {
                            canvasHost: canvasHost,
                            httpServer: httpServer,
                            httpServers: httpServers,
                            httpBindHosts: httpBindHosts,
                            wss: wss,
                            clients: clients,
                            broadcast: broadcast,
                            agentRunSeq: agentRunSeq,
                            dedupe: dedupe,
                            chatRunState: chatRunState,
                            chatRunBuffers: chatRunBuffers,
                            chatDeltaSentAt: chatDeltaSentAt,
                            addChatRun: addChatRun,
                            removeChatRun: removeChatRun,
                            chatAbortControllers: chatAbortControllers,
                        }];
            }
        });
    });
}
