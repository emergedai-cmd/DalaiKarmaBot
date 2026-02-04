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
exports.getHookChannelError = void 0;
exports.resolveHooksConfig = resolveHooksConfig;
exports.extractHookToken = extractHookToken;
exports.readJsonBody = readJsonBody;
exports.normalizeHookHeaders = normalizeHookHeaders;
exports.normalizeWakePayload = normalizeWakePayload;
exports.resolveHookChannel = resolveHookChannel;
exports.resolveHookDeliver = resolveHookDeliver;
exports.normalizeAgentPayload = normalizeAgentPayload;
var node_crypto_1 = require("node:crypto");
var index_js_1 = require("../channels/plugins/index.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var hooks_mapping_js_1 = require("./hooks-mapping.js");
var DEFAULT_HOOKS_PATH = "/hooks";
var DEFAULT_HOOKS_MAX_BODY_BYTES = 256 * 1024;
function resolveHooksConfig(cfg) {
    var _a, _b, _c, _d, _e, _f;
    if (((_a = cfg.hooks) === null || _a === void 0 ? void 0 : _a.enabled) !== true) {
        return null;
    }
    var token = (_c = (_b = cfg.hooks) === null || _b === void 0 ? void 0 : _b.token) === null || _c === void 0 ? void 0 : _c.trim();
    if (!token) {
        throw new Error("hooks.enabled requires hooks.token");
    }
    var rawPath = ((_e = (_d = cfg.hooks) === null || _d === void 0 ? void 0 : _d.path) === null || _e === void 0 ? void 0 : _e.trim()) || DEFAULT_HOOKS_PATH;
    var withSlash = rawPath.startsWith("/") ? rawPath : "/".concat(rawPath);
    var trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
    if (trimmed === "/") {
        throw new Error("hooks.path may not be '/'");
    }
    var maxBodyBytes = ((_f = cfg.hooks) === null || _f === void 0 ? void 0 : _f.maxBodyBytes) && cfg.hooks.maxBodyBytes > 0
        ? cfg.hooks.maxBodyBytes
        : DEFAULT_HOOKS_MAX_BODY_BYTES;
    var mappings = (0, hooks_mapping_js_1.resolveHookMappings)(cfg.hooks);
    return {
        basePath: trimmed,
        token: token,
        maxBodyBytes: maxBodyBytes,
        mappings: mappings,
    };
}
function extractHookToken(req, url) {
    var auth = typeof req.headers.authorization === "string" ? req.headers.authorization.trim() : "";
    if (auth.toLowerCase().startsWith("bearer ")) {
        var token = auth.slice(7).trim();
        if (token) {
            return { token: token, fromQuery: false };
        }
    }
    var headerToken = typeof req.headers["x-openclaw-token"] === "string"
        ? req.headers["x-openclaw-token"].trim()
        : "";
    if (headerToken) {
        return { token: headerToken, fromQuery: false };
    }
    var queryToken = url.searchParams.get("token");
    if (queryToken) {
        return { token: queryToken.trim(), fromQuery: true };
    }
    return { token: undefined, fromQuery: false };
}
function readJsonBody(req, maxBytes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        var done = false;
                        var total = 0;
                        var chunks = [];
                        req.on("data", function (chunk) {
                            if (done) {
                                return;
                            }
                            total += chunk.length;
                            if (total > maxBytes) {
                                done = true;
                                resolve({ ok: false, error: "payload too large" });
                                req.destroy();
                                return;
                            }
                            chunks.push(chunk);
                        });
                        req.on("end", function () {
                            if (done) {
                                return;
                            }
                            done = true;
                            var raw = Buffer.concat(chunks).toString("utf-8").trim();
                            if (!raw) {
                                resolve({ ok: true, value: {} });
                                return;
                            }
                            try {
                                var parsed = JSON.parse(raw);
                                resolve({ ok: true, value: parsed });
                            }
                            catch (err) {
                                resolve({ ok: false, error: String(err) });
                            }
                        });
                        req.on("error", function (err) {
                            if (done) {
                                return;
                            }
                            done = true;
                            resolve({ ok: false, error: String(err) });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function normalizeHookHeaders(req) {
    var headers = {};
    for (var _i = 0, _a = Object.entries(req.headers); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof value === "string") {
            headers[key.toLowerCase()] = value;
        }
        else if (Array.isArray(value) && value.length > 0) {
            headers[key.toLowerCase()] = value.join(", ");
        }
    }
    return headers;
}
function normalizeWakePayload(payload) {
    var text = typeof payload.text === "string" ? payload.text.trim() : "";
    if (!text) {
        return { ok: false, error: "text required" };
    }
    var mode = payload.mode === "next-heartbeat" ? "next-heartbeat" : "now";
    return { ok: true, value: { text: text, mode: mode } };
}
var listHookChannelValues = function () { return __spreadArray(["last"], (0, index_js_1.listChannelPlugins)().map(function (plugin) { return plugin.id; }), true); };
var getHookChannelSet = function () { return new Set(listHookChannelValues()); };
var getHookChannelError = function () { return "channel must be ".concat(listHookChannelValues().join("|")); };
exports.getHookChannelError = getHookChannelError;
function resolveHookChannel(raw) {
    if (raw === undefined) {
        return "last";
    }
    if (typeof raw !== "string") {
        return null;
    }
    var normalized = (0, message_channel_js_1.normalizeMessageChannel)(raw);
    if (!normalized || !getHookChannelSet().has(normalized)) {
        return null;
    }
    return normalized;
}
function resolveHookDeliver(raw) {
    return raw !== false;
}
function normalizeAgentPayload(payload, opts) {
    var _a;
    var message = typeof payload.message === "string" ? payload.message.trim() : "";
    if (!message) {
        return { ok: false, error: "message required" };
    }
    var nameRaw = payload.name;
    var name = typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : "Hook";
    var wakeMode = payload.wakeMode === "next-heartbeat" ? "next-heartbeat" : "now";
    var sessionKeyRaw = payload.sessionKey;
    var idFactory = (_a = opts === null || opts === void 0 ? void 0 : opts.idFactory) !== null && _a !== void 0 ? _a : node_crypto_1.randomUUID;
    var sessionKey = typeof sessionKeyRaw === "string" && sessionKeyRaw.trim()
        ? sessionKeyRaw.trim()
        : "hook:".concat(idFactory());
    var channel = resolveHookChannel(payload.channel);
    if (!channel) {
        return { ok: false, error: (0, exports.getHookChannelError)() };
    }
    var toRaw = payload.to;
    var to = typeof toRaw === "string" && toRaw.trim() ? toRaw.trim() : undefined;
    var modelRaw = payload.model;
    var model = typeof modelRaw === "string" && modelRaw.trim() ? modelRaw.trim() : undefined;
    if (modelRaw !== undefined && !model) {
        return { ok: false, error: "model required" };
    }
    var deliver = resolveHookDeliver(payload.deliver);
    var thinkingRaw = payload.thinking;
    var thinking = typeof thinkingRaw === "string" && thinkingRaw.trim() ? thinkingRaw.trim() : undefined;
    var timeoutRaw = payload.timeoutSeconds;
    var timeoutSeconds = typeof timeoutRaw === "number" && Number.isFinite(timeoutRaw) && timeoutRaw > 0
        ? Math.floor(timeoutRaw)
        : undefined;
    return {
        ok: true,
        value: {
            message: message,
            name: name,
            wakeMode: wakeMode,
            sessionKey: sessionKey,
            deliver: deliver,
            channel: channel,
            to: to,
            model: model,
            thinking: thinking,
            timeoutSeconds: timeoutSeconds,
        },
    };
}
