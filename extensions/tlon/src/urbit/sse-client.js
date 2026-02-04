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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrbitSSEClient = void 0;
var node_stream_1 = require("node:stream");
var UrbitSSEClient = /** @class */ (function () {
    function UrbitSSEClient(url, cookie, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e, _f, _g;
        this.subscriptions = [];
        this.eventHandlers = new Map();
        this.aborted = false;
        this.streamController = null;
        this.reconnectAttempts = 0;
        this.isConnected = false;
        this.url = url;
        this.cookie = cookie.split(";")[0];
        this.ship = (_b = (_a = options.ship) === null || _a === void 0 ? void 0 : _a.replace(/^~/, "")) !== null && _b !== void 0 ? _b : this.resolveShipFromUrl(url);
        this.channelId = "".concat(Math.floor(Date.now() / 1000), "-").concat(Math.random().toString(36).substring(2, 8));
        this.channelUrl = "".concat(url, "/~/channel/").concat(this.channelId);
        this.onReconnect = (_c = options.onReconnect) !== null && _c !== void 0 ? _c : null;
        this.autoReconnect = options.autoReconnect !== false;
        this.maxReconnectAttempts = (_d = options.maxReconnectAttempts) !== null && _d !== void 0 ? _d : 10;
        this.reconnectDelay = (_e = options.reconnectDelay) !== null && _e !== void 0 ? _e : 1000;
        this.maxReconnectDelay = (_f = options.maxReconnectDelay) !== null && _f !== void 0 ? _f : 30000;
        this.logger = (_g = options.logger) !== null && _g !== void 0 ? _g : {};
    }
    UrbitSSEClient.prototype.resolveShipFromUrl = function (url) {
        var _a;
        try {
            var parsed = new URL(url);
            var host = parsed.hostname;
            if (host.includes(".")) {
                return (_a = host.split(".")[0]) !== null && _a !== void 0 ? _a : host;
            }
            return host;
        }
        catch (_b) {
            return "";
        }
    };
    UrbitSSEClient.prototype.subscribe = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var subId, subscription, error_1, handler;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        subId = this.subscriptions.length + 1;
                        subscription = {
                            id: subId,
                            action: "subscribe",
                            ship: this.ship,
                            app: params.app,
                            path: params.path,
                        };
                        this.subscriptions.push(subscription);
                        this.eventHandlers.set(subId, { event: params.event, err: params.err, quit: params.quit });
                        if (!this.isConnected) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sendSubscription(subscription)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        handler = this.eventHandlers.get(subId);
                        (_a = handler === null || handler === void 0 ? void 0 : handler.err) === null || _a === void 0 ? void 0 : _a.call(handler, error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, subId];
                }
            });
        });
    };
    UrbitSSEClient.prototype.sendSubscription = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var response, errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.channelUrl, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Cookie: this.cookie,
                            },
                            body: JSON.stringify([subscription]),
                            signal: AbortSignal.timeout(30000),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!(!response.ok && response.status !== 204)) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("Subscribe failed: ".concat(response.status, " - ").concat(errorText));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UrbitSSEClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var createResp, pokeResp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.channelUrl, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Cookie: this.cookie,
                            },
                            body: JSON.stringify(this.subscriptions),
                            signal: AbortSignal.timeout(30000),
                        })];
                    case 1:
                        createResp = _a.sent();
                        if (!createResp.ok && createResp.status !== 204) {
                            throw new Error("Channel creation failed: ".concat(createResp.status));
                        }
                        return [4 /*yield*/, fetch(this.channelUrl, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Cookie: this.cookie,
                                },
                                body: JSON.stringify([
                                    {
                                        id: Date.now(),
                                        action: "poke",
                                        ship: this.ship,
                                        app: "hood",
                                        mark: "helm-hi",
                                        json: "Opening API channel",
                                    },
                                ]),
                                signal: AbortSignal.timeout(30000),
                            })];
                    case 2:
                        pokeResp = _a.sent();
                        if (!pokeResp.ok && pokeResp.status !== 204) {
                            throw new Error("Channel activation failed: ".concat(pokeResp.status));
                        }
                        return [4 /*yield*/, this.openStream()];
                    case 3:
                        _a.sent();
                        this.isConnected = true;
                        this.reconnectAttempts = 0;
                        return [2 /*return*/];
                }
            });
        });
    };
    UrbitSSEClient.prototype.openStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var controller, timeoutId, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controller = new AbortController();
                        timeoutId = setTimeout(function () { return controller.abort(); }, 60000);
                        return [4 /*yield*/, fetch(this.channelUrl, {
                                method: "GET",
                                headers: {
                                    Accept: "text/event-stream",
                                    Cookie: this.cookie,
                                },
                                signal: controller.signal,
                            })];
                    case 1:
                        response = _a.sent();
                        // Clear timeout once connection established (headers received)
                        clearTimeout(timeoutId);
                        if (!response.ok) {
                            throw new Error("Stream connection failed: ".concat(response.status));
                        }
                        this.processStream(response.body).catch(function (error) {
                            var _a, _b;
                            if (!_this.aborted) {
                                (_b = (_a = _this.logger).error) === null || _b === void 0 ? void 0 : _b.call(_a, "Stream error: ".concat(String(error)));
                                for (var _i = 0, _c = _this.eventHandlers.values(); _i < _c.length; _i++) {
                                    var err = _c[_i].err;
                                    if (err) {
                                        err(error);
                                    }
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UrbitSSEClient.prototype.processStream = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, buffer, _a, stream_1, stream_1_1, chunk, eventEnd, eventData, e_1_1;
            var _b, e_1, _c, _d;
            var _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!body) {
                            return [2 /*return*/];
                        }
                        stream = body instanceof ReadableStream ? node_stream_1.Readable.fromWeb(body) : body;
                        buffer = "";
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, , 14, 17]);
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 7, 8, 13]);
                        _a = true, stream_1 = __asyncValues(stream);
                        _g.label = 3;
                    case 3: return [4 /*yield*/, stream_1.next()];
                    case 4:
                        if (!(stream_1_1 = _g.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 6];
                        _d = stream_1_1.value;
                        _a = false;
                        chunk = _d;
                        if (this.aborted) {
                            return [3 /*break*/, 6];
                        }
                        buffer += chunk.toString();
                        eventEnd = void 0;
                        while ((eventEnd = buffer.indexOf("\n\n")) !== -1) {
                            eventData = buffer.substring(0, eventEnd);
                            buffer = buffer.substring(eventEnd + 2);
                            this.processEvent(eventData);
                        }
                        _g.label = 5;
                    case 5:
                        _a = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _g.trys.push([8, , 11, 12]);
                        if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _c.call(stream_1)];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 17];
                    case 14:
                        if (!(!this.aborted && this.autoReconnect)) return [3 /*break*/, 16];
                        this.isConnected = false;
                        (_f = (_e = this.logger).log) === null || _f === void 0 ? void 0 : _f.call(_e, "[SSE] Stream ended, attempting reconnection...");
                        return [4 /*yield*/, this.attemptReconnect()];
                    case 15:
                        _g.sent();
                        _g.label = 16;
                    case 16: return [7 /*endfinally*/];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    UrbitSSEClient.prototype.processEvent = function (eventData) {
        var _a, _b, _c;
        var lines = eventData.split("\n");
        var data = null;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.startsWith("data: ")) {
                data = line.substring(6);
            }
        }
        if (!data) {
            return;
        }
        try {
            var parsed = JSON.parse(data);
            if (parsed.response === "quit") {
                if (parsed.id) {
                    var handlers = this.eventHandlers.get(parsed.id);
                    if (handlers === null || handlers === void 0 ? void 0 : handlers.quit) {
                        handlers.quit();
                    }
                }
                return;
            }
            if (parsed.id && this.eventHandlers.has(parsed.id)) {
                var event_1 = ((_a = this.eventHandlers.get(parsed.id)) !== null && _a !== void 0 ? _a : {}).event;
                if (event_1 && parsed.json) {
                    event_1(parsed.json);
                }
            }
            else if (parsed.json) {
                for (var _d = 0, _e = this.eventHandlers.values(); _d < _e.length; _d++) {
                    var event_2 = _e[_d].event;
                    if (event_2) {
                        event_2(parsed.json);
                    }
                }
            }
        }
        catch (error) {
            (_c = (_b = this.logger).error) === null || _c === void 0 ? void 0 : _c.call(_b, "Error parsing SSE event: ".concat(String(error)));
        }
    };
    UrbitSSEClient.prototype.poke = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var pokeId, pokeData, response, errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pokeId = Date.now();
                        pokeData = {
                            id: pokeId,
                            action: "poke",
                            ship: this.ship,
                            app: params.app,
                            mark: params.mark,
                            json: params.json,
                        };
                        return [4 /*yield*/, fetch(this.channelUrl, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Cookie: this.cookie,
                                },
                                body: JSON.stringify([pokeData]),
                                signal: AbortSignal.timeout(30000),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!(!response.ok && response.status !== 204)) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("Poke failed: ".concat(response.status, " - ").concat(errorText));
                    case 3: return [2 /*return*/, pokeId];
                }
            });
        });
    };
    UrbitSSEClient.prototype.scry = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var scryUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scryUrl = "".concat(this.url, "/~/scry").concat(path);
                        return [4 /*yield*/, fetch(scryUrl, {
                                method: "GET",
                                headers: {
                                    Cookie: this.cookie,
                                },
                                signal: AbortSignal.timeout(30000),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Scry failed: ".concat(response.status, " for path ").concat(path));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UrbitSSEClient.prototype.attemptReconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delay, error_2;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        if (this.aborted || !this.autoReconnect) {
                            (_b = (_a = this.logger).log) === null || _b === void 0 ? void 0 : _b.call(_a, "[SSE] Reconnection aborted or disabled");
                            return [2 /*return*/];
                        }
                        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                            (_d = (_c = this.logger).error) === null || _d === void 0 ? void 0 : _d.call(_c, "[SSE] Max reconnection attempts (".concat(this.maxReconnectAttempts, ") reached. Giving up."));
                            return [2 /*return*/];
                        }
                        this.reconnectAttempts += 1;
                        delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
                        (_f = (_e = this.logger).log) === null || _f === void 0 ? void 0 : _f.call(_e, "[SSE] Reconnection attempt ".concat(this.reconnectAttempts, "/").concat(this.maxReconnectAttempts, " in ").concat(delay, "ms..."));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                    case 1:
                        _l.sent();
                        _l.label = 2;
                    case 2:
                        _l.trys.push([2, 6, , 8]);
                        this.channelId = "".concat(Math.floor(Date.now() / 1000), "-").concat(Math.random().toString(36).substring(2, 8));
                        this.channelUrl = "".concat(this.url, "/~/channel/").concat(this.channelId);
                        if (!this.onReconnect) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.onReconnect(this)];
                    case 3:
                        _l.sent();
                        _l.label = 4;
                    case 4: return [4 /*yield*/, this.connect()];
                    case 5:
                        _l.sent();
                        (_h = (_g = this.logger).log) === null || _h === void 0 ? void 0 : _h.call(_g, "[SSE] Reconnection successful!");
                        return [3 /*break*/, 8];
                    case 6:
                        error_2 = _l.sent();
                        (_k = (_j = this.logger).error) === null || _k === void 0 ? void 0 : _k.call(_j, "[SSE] Reconnection failed: ".concat(String(error_2)));
                        return [4 /*yield*/, this.attemptReconnect()];
                    case 7:
                        _l.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UrbitSSEClient.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unsubscribes, error_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.aborted = true;
                        this.isConnected = false;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        unsubscribes = this.subscriptions.map(function (sub) { return ({
                            id: sub.id,
                            action: "unsubscribe",
                            subscription: sub.id,
                        }); });
                        return [4 /*yield*/, fetch(this.channelUrl, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Cookie: this.cookie,
                                },
                                body: JSON.stringify(unsubscribes),
                                signal: AbortSignal.timeout(30000),
                            })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, fetch(this.channelUrl, {
                                method: "DELETE",
                                headers: {
                                    Cookie: this.cookie,
                                },
                                signal: AbortSignal.timeout(30000),
                            })];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _c.sent();
                        (_b = (_a = this.logger).error) === null || _b === void 0 ? void 0 : _b.call(_a, "Error closing channel: ".concat(String(error_3)));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return UrbitSSEClient;
}());
exports.UrbitSSEClient = UrbitSSEClient;
