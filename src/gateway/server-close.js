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
exports.createGatewayCloseHandler = createGatewayCloseHandler;
var index_js_1 = require("../channels/plugins/index.js");
var gmail_watcher_js_1 = require("../hooks/gmail-watcher.js");
function createGatewayCloseHandler(params) {
    var _this = this;
    return function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var reasonRaw, reason, restartExpectedMs, _a, _b, _c, _i, _d, plugin, _e, _f, timer, _g, _h, c, servers, _loop_1, _j, servers_1, server;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    reasonRaw = typeof (opts === null || opts === void 0 ? void 0 : opts.reason) === "string" ? opts.reason.trim() : "";
                    reason = reasonRaw || "gateway stopping";
                    restartExpectedMs = typeof (opts === null || opts === void 0 ? void 0 : opts.restartExpectedMs) === "number" && Number.isFinite(opts.restartExpectedMs)
                        ? Math.max(0, Math.floor(opts.restartExpectedMs))
                        : null;
                    if (!params.bonjourStop) return [3 /*break*/, 4];
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, params.bonjourStop()];
                case 2:
                    _k.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _k.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (!params.tailscaleCleanup) return [3 /*break*/, 6];
                    return [4 /*yield*/, params.tailscaleCleanup()];
                case 5:
                    _k.sent();
                    _k.label = 6;
                case 6:
                    if (!params.canvasHost) return [3 /*break*/, 10];
                    _k.label = 7;
                case 7:
                    _k.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, params.canvasHost.close()];
                case 8:
                    _k.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _b = _k.sent();
                    return [3 /*break*/, 10];
                case 10:
                    if (!params.canvasHostServer) return [3 /*break*/, 14];
                    _k.label = 11;
                case 11:
                    _k.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, params.canvasHostServer.close()];
                case 12:
                    _k.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _c = _k.sent();
                    return [3 /*break*/, 14];
                case 14:
                    _i = 0, _d = (0, index_js_1.listChannelPlugins)();
                    _k.label = 15;
                case 15:
                    if (!(_i < _d.length)) return [3 /*break*/, 18];
                    plugin = _d[_i];
                    return [4 /*yield*/, params.stopChannel(plugin.id)];
                case 16:
                    _k.sent();
                    _k.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 15];
                case 18:
                    if (!params.pluginServices) return [3 /*break*/, 20];
                    return [4 /*yield*/, params.pluginServices.stop().catch(function () { })];
                case 19:
                    _k.sent();
                    _k.label = 20;
                case 20: return [4 /*yield*/, (0, gmail_watcher_js_1.stopGmailWatcher)()];
                case 21:
                    _k.sent();
                    params.cron.stop();
                    params.heartbeatRunner.stop();
                    for (_e = 0, _f = params.nodePresenceTimers.values(); _e < _f.length; _e++) {
                        timer = _f[_e];
                        clearInterval(timer);
                    }
                    params.nodePresenceTimers.clear();
                    params.broadcast("shutdown", {
                        reason: reason,
                        restartExpectedMs: restartExpectedMs,
                    });
                    clearInterval(params.tickInterval);
                    clearInterval(params.healthInterval);
                    clearInterval(params.dedupeCleanup);
                    if (params.agentUnsub) {
                        try {
                            params.agentUnsub();
                        }
                        catch (_l) {
                            /* ignore */
                        }
                    }
                    if (params.heartbeatUnsub) {
                        try {
                            params.heartbeatUnsub();
                        }
                        catch (_m) {
                            /* ignore */
                        }
                    }
                    params.chatRunState.clear();
                    for (_g = 0, _h = params.clients; _g < _h.length; _g++) {
                        c = _h[_g];
                        try {
                            c.socket.close(1012, "service restart");
                        }
                        catch (_o) {
                            /* ignore */
                        }
                    }
                    params.clients.clear();
                    return [4 /*yield*/, params.configReloader.stop().catch(function () { })];
                case 22:
                    _k.sent();
                    if (!params.browserControl) return [3 /*break*/, 24];
                    return [4 /*yield*/, params.browserControl.stop().catch(function () { })];
                case 23:
                    _k.sent();
                    _k.label = 24;
                case 24: return [4 /*yield*/, new Promise(function (resolve) { return params.wss.close(function () { return resolve(); }); })];
                case 25:
                    _k.sent();
                    servers = params.httpServers && params.httpServers.length > 0
                        ? params.httpServers
                        : [params.httpServer];
                    _loop_1 = function (server) {
                        var httpServer;
                        return __generator(this, function (_p) {
                            switch (_p.label) {
                                case 0:
                                    httpServer = server;
                                    if (typeof httpServer.closeIdleConnections === "function") {
                                        httpServer.closeIdleConnections();
                                    }
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            return httpServer.close(function (err) { return (err ? reject(err) : resolve()); });
                                        })];
                                case 1:
                                    _p.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _j = 0, servers_1 = servers;
                    _k.label = 26;
                case 26:
                    if (!(_j < servers_1.length)) return [3 /*break*/, 29];
                    server = servers_1[_j];
                    return [5 /*yield**/, _loop_1(server)];
                case 27:
                    _k.sent();
                    _k.label = 28;
                case 28:
                    _j++;
                    return [3 /*break*/, 26];
                case 29: return [2 /*return*/];
            }
        });
    }); };
}
