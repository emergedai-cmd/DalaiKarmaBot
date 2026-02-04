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
exports.GatewayBrowserClient = void 0;
var device_auth_js_1 = require("../../../src/gateway/device-auth.js");
var client_info_js_1 = require("../../../src/gateway/protocol/client-info.js");
var device_auth_1 = require("./device-auth");
var device_identity_1 = require("./device-identity");
var uuid_1 = require("./uuid");
// 4008 = application-defined code (browser rejects 1008 "Policy Violation")
var CONNECT_FAILED_CLOSE_CODE = 4008;
var GatewayBrowserClient = /** @class */ (function () {
    function GatewayBrowserClient(opts) {
        this.opts = opts;
        this.ws = null;
        this.pending = new Map();
        this.closed = false;
        this.lastSeq = null;
        this.connectNonce = null;
        this.connectSent = false;
        this.connectTimer = null;
        this.backoffMs = 800;
    }
    GatewayBrowserClient.prototype.start = function () {
        this.closed = false;
        this.connect();
    };
    GatewayBrowserClient.prototype.stop = function () {
        var _a;
        this.closed = true;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        this.ws = null;
        this.flushPending(new Error("gateway client stopped"));
    };
    Object.defineProperty(GatewayBrowserClient.prototype, "connected", {
        get: function () {
            var _a;
            return ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN;
        },
        enumerable: false,
        configurable: true
    });
    GatewayBrowserClient.prototype.connect = function () {
        var _this = this;
        if (this.closed) {
            return;
        }
        this.ws = new WebSocket(this.opts.url);
        this.ws.addEventListener("open", function () { return _this.queueConnect(); });
        this.ws.addEventListener("message", function (ev) { var _a; return _this.handleMessage(String((_a = ev.data) !== null && _a !== void 0 ? _a : "")); });
        this.ws.addEventListener("close", function (ev) {
            var _a, _b, _c;
            var reason = String((_a = ev.reason) !== null && _a !== void 0 ? _a : "");
            _this.ws = null;
            _this.flushPending(new Error("gateway closed (".concat(ev.code, "): ").concat(reason)));
            (_c = (_b = _this.opts).onClose) === null || _c === void 0 ? void 0 : _c.call(_b, { code: ev.code, reason: reason });
            _this.scheduleReconnect();
        });
        this.ws.addEventListener("error", function () {
            // ignored; close handler will fire
        });
    };
    GatewayBrowserClient.prototype.scheduleReconnect = function () {
        var _this = this;
        if (this.closed) {
            return;
        }
        var delay = this.backoffMs;
        this.backoffMs = Math.min(this.backoffMs * 1.7, 15000);
        window.setTimeout(function () { return _this.connect(); }, delay);
    };
    GatewayBrowserClient.prototype.flushPending = function (err) {
        for (var _i = 0, _a = this.pending; _i < _a.length; _i++) {
            var _b = _a[_i], p = _b[1];
            p.reject(err);
        }
        this.pending.clear();
    };
    GatewayBrowserClient.prototype.sendConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isSecureContext, scopes, role, deviceIdentity, canFallbackToShared, authToken, storedToken, auth, device, signedAtMs, nonce, payload, signature, params;
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (this.connectSent) {
                            return [2 /*return*/];
                        }
                        this.connectSent = true;
                        if (this.connectTimer !== null) {
                            window.clearTimeout(this.connectTimer);
                            this.connectTimer = null;
                        }
                        isSecureContext = typeof crypto !== "undefined" && !!crypto.subtle;
                        scopes = ["operator.admin", "operator.approvals", "operator.pairing"];
                        role = "operator";
                        deviceIdentity = null;
                        canFallbackToShared = false;
                        authToken = this.opts.token;
                        if (!isSecureContext) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, device_identity_1.loadOrCreateDeviceIdentity)()];
                    case 1:
                        deviceIdentity = _k.sent();
                        storedToken = (_a = (0, device_auth_1.loadDeviceAuthToken)({
                            deviceId: deviceIdentity.deviceId,
                            role: role,
                        })) === null || _a === void 0 ? void 0 : _a.token;
                        authToken = storedToken !== null && storedToken !== void 0 ? storedToken : this.opts.token;
                        canFallbackToShared = Boolean(storedToken && this.opts.token);
                        _k.label = 2;
                    case 2:
                        auth = authToken || this.opts.password
                            ? {
                                token: authToken,
                                password: this.opts.password,
                            }
                            : undefined;
                        if (!(isSecureContext && deviceIdentity)) return [3 /*break*/, 4];
                        signedAtMs = Date.now();
                        nonce = (_b = this.connectNonce) !== null && _b !== void 0 ? _b : undefined;
                        payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
                            deviceId: deviceIdentity.deviceId,
                            clientId: (_c = this.opts.clientName) !== null && _c !== void 0 ? _c : client_info_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                            clientMode: (_d = this.opts.mode) !== null && _d !== void 0 ? _d : client_info_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                            role: role,
                            scopes: scopes,
                            signedAtMs: signedAtMs,
                            token: authToken !== null && authToken !== void 0 ? authToken : null,
                            nonce: nonce,
                        });
                        return [4 /*yield*/, (0, device_identity_1.signDevicePayload)(deviceIdentity.privateKey, payload)];
                    case 3:
                        signature = _k.sent();
                        device = {
                            id: deviceIdentity.deviceId,
                            publicKey: deviceIdentity.publicKey,
                            signature: signature,
                            signedAt: signedAtMs,
                            nonce: nonce,
                        };
                        _k.label = 4;
                    case 4:
                        params = {
                            minProtocol: 3,
                            maxProtocol: 3,
                            client: {
                                id: (_e = this.opts.clientName) !== null && _e !== void 0 ? _e : client_info_js_1.GATEWAY_CLIENT_NAMES.CONTROL_UI,
                                version: (_f = this.opts.clientVersion) !== null && _f !== void 0 ? _f : "dev",
                                platform: (_h = (_g = this.opts.platform) !== null && _g !== void 0 ? _g : navigator.platform) !== null && _h !== void 0 ? _h : "web",
                                mode: (_j = this.opts.mode) !== null && _j !== void 0 ? _j : client_info_js_1.GATEWAY_CLIENT_MODES.WEBCHAT,
                                instanceId: this.opts.instanceId,
                            },
                            role: role,
                            scopes: scopes,
                            device: device,
                            caps: [],
                            auth: auth,
                            userAgent: navigator.userAgent,
                            locale: navigator.language,
                        };
                        void this.request("connect", params)
                            .then(function (hello) {
                            var _a, _b, _c, _d, _e;
                            if (((_a = hello === null || hello === void 0 ? void 0 : hello.auth) === null || _a === void 0 ? void 0 : _a.deviceToken) && deviceIdentity) {
                                (0, device_auth_1.storeDeviceAuthToken)({
                                    deviceId: deviceIdentity.deviceId,
                                    role: (_b = hello.auth.role) !== null && _b !== void 0 ? _b : role,
                                    token: hello.auth.deviceToken,
                                    scopes: (_c = hello.auth.scopes) !== null && _c !== void 0 ? _c : [],
                                });
                            }
                            _this.backoffMs = 800;
                            (_e = (_d = _this.opts).onHello) === null || _e === void 0 ? void 0 : _e.call(_d, hello);
                        })
                            .catch(function () {
                            var _a;
                            if (canFallbackToShared && deviceIdentity) {
                                (0, device_auth_1.clearDeviceAuthToken)({ deviceId: deviceIdentity.deviceId, role: role });
                            }
                            (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.close(CONNECT_FAILED_CLOSE_CODE, "connect failed");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GatewayBrowserClient.prototype.handleMessage = function (raw) {
        var _a, _b, _c, _d, _e, _f;
        var parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch (_g) {
            return;
        }
        var frame = parsed;
        if (frame.type === "event") {
            var evt = parsed;
            if (evt.event === "connect.challenge") {
                var payload = evt.payload;
                var nonce = payload && typeof payload.nonce === "string" ? payload.nonce : null;
                if (nonce) {
                    this.connectNonce = nonce;
                    void this.sendConnect();
                }
                return;
            }
            var seq = typeof evt.seq === "number" ? evt.seq : null;
            if (seq !== null) {
                if (this.lastSeq !== null && seq > this.lastSeq + 1) {
                    (_b = (_a = this.opts).onGap) === null || _b === void 0 ? void 0 : _b.call(_a, { expected: this.lastSeq + 1, received: seq });
                }
                this.lastSeq = seq;
            }
            try {
                (_d = (_c = this.opts).onEvent) === null || _d === void 0 ? void 0 : _d.call(_c, evt);
            }
            catch (err) {
                console.error("[gateway] event handler error:", err);
            }
            return;
        }
        if (frame.type === "res") {
            var res = parsed;
            var pending = this.pending.get(res.id);
            if (!pending) {
                return;
            }
            this.pending.delete(res.id);
            if (res.ok) {
                pending.resolve(res.payload);
            }
            else {
                pending.reject(new Error((_f = (_e = res.error) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : "request failed"));
            }
            return;
        }
    };
    GatewayBrowserClient.prototype.request = function (method, params) {
        var _this = this;
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return Promise.reject(new Error("gateway not connected"));
        }
        var id = (0, uuid_1.generateUUID)();
        var frame = { type: "req", id: id, method: method, params: params };
        var p = new Promise(function (resolve, reject) {
            _this.pending.set(id, { resolve: function (v) { return resolve(v); }, reject: reject });
        });
        this.ws.send(JSON.stringify(frame));
        return p;
    };
    GatewayBrowserClient.prototype.queueConnect = function () {
        var _this = this;
        this.connectNonce = null;
        this.connectSent = false;
        if (this.connectTimer !== null) {
            window.clearTimeout(this.connectTimer);
        }
        this.connectTimer = window.setTimeout(function () {
            void _this.sendConnect();
        }, 750);
    };
    return GatewayBrowserClient;
}());
exports.GatewayBrowserClient = GatewayBrowserClient;
