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
exports.markBlueBubblesChatRead = markBlueBubblesChatRead;
exports.sendBlueBubblesTyping = sendBlueBubblesTyping;
exports.editBlueBubblesMessage = editBlueBubblesMessage;
exports.unsendBlueBubblesMessage = unsendBlueBubblesMessage;
exports.renameBlueBubblesChat = renameBlueBubblesChat;
exports.addBlueBubblesParticipant = addBlueBubblesParticipant;
exports.removeBlueBubblesParticipant = removeBlueBubblesParticipant;
exports.leaveBlueBubblesChat = leaveBlueBubblesChat;
exports.setGroupIconBlueBubbles = setGroupIconBlueBubbles;
var node_crypto_1 = require("node:crypto");
var accounts_js_1 = require("./accounts.js");
var types_js_1 = require("./types.js");
function resolveAccount(params) {
    var _a, _b, _c, _d, _e;
    var account = (0, accounts_js_1.resolveBlueBubblesAccount)({
        cfg: (_a = params.cfg) !== null && _a !== void 0 ? _a : {},
        accountId: params.accountId,
    });
    var baseUrl = ((_b = params.serverUrl) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = account.config.serverUrl) === null || _c === void 0 ? void 0 : _c.trim());
    var password = ((_d = params.password) === null || _d === void 0 ? void 0 : _d.trim()) || ((_e = account.config.password) === null || _e === void 0 ? void 0 : _e.trim());
    if (!baseUrl) {
        throw new Error("BlueBubbles serverUrl is required");
    }
    if (!password) {
        throw new Error("BlueBubbles password is required");
    }
    return { baseUrl: baseUrl, password: password };
}
function markBlueBubblesChatRead(chatGuid_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, opts) {
        var trimmed, _a, baseUrl, password, url, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmed = chatGuid.trim();
                    if (!trimmed) {
                        return [2 /*return*/];
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmed), "/read"),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, { method: "POST" }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles read failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sendBlueBubblesTyping(chatGuid_1, typing_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, typing, opts) {
        var trimmed, _a, baseUrl, password, url, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmed = chatGuid.trim();
                    if (!trimmed) {
                        return [2 /*return*/];
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmed), "/typing"),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, { method: typing ? "POST" : "DELETE" }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles typing failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Edit a message via BlueBubbles API.
 * Requires macOS 13 (Ventura) or higher with Private API enabled.
 */
function editBlueBubblesMessage(messageGuid_1, newText_1) {
    return __awaiter(this, arguments, void 0, function (messageGuid, newText, opts) {
        var trimmedGuid, trimmedText, _a, baseUrl, password, url, payload, res, errorText;
        var _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    trimmedGuid = messageGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles edit requires messageGuid");
                    }
                    trimmedText = newText.trim();
                    if (!trimmedText) {
                        throw new Error("BlueBubbles edit requires newText");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/message/".concat(encodeURIComponent(trimmedGuid), "/edit"),
                        password: password,
                    });
                    payload = {
                        editedMessage: trimmedText,
                        backwardsCompatibilityMessage: (_b = opts.backwardsCompatMessage) !== null && _b !== void 0 ? _b : "Edited to: ".concat(trimmedText),
                        partIndex: typeof opts.partIndex === "number" ? opts.partIndex : 0,
                    };
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        }, opts.timeoutMs)];
                case 1:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _c.sent();
                    throw new Error("BlueBubbles edit failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Unsend (retract) a message via BlueBubbles API.
 * Requires macOS 13 (Ventura) or higher with Private API enabled.
 */
function unsendBlueBubblesMessage(messageGuid_1) {
    return __awaiter(this, arguments, void 0, function (messageGuid, opts) {
        var trimmedGuid, _a, baseUrl, password, url, payload, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedGuid = messageGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles unsend requires messageGuid");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/message/".concat(encodeURIComponent(trimmedGuid), "/unsend"),
                        password: password,
                    });
                    payload = {
                        partIndex: typeof opts.partIndex === "number" ? opts.partIndex : 0,
                    };
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles unsend failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Rename a group chat via BlueBubbles API.
 */
function renameBlueBubblesChat(chatGuid_1, displayName_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, displayName, opts) {
        var trimmedGuid, _a, baseUrl, password, url, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedGuid = chatGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles rename requires chatGuid");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmedGuid)),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ displayName: displayName }),
                        }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles rename failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Add a participant to a group chat via BlueBubbles API.
 */
function addBlueBubblesParticipant(chatGuid_1, address_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, address, opts) {
        var trimmedGuid, trimmedAddress, _a, baseUrl, password, url, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedGuid = chatGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles addParticipant requires chatGuid");
                    }
                    trimmedAddress = address.trim();
                    if (!trimmedAddress) {
                        throw new Error("BlueBubbles addParticipant requires address");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmedGuid), "/participant"),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ address: trimmedAddress }),
                        }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles addParticipant failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Remove a participant from a group chat via BlueBubbles API.
 */
function removeBlueBubblesParticipant(chatGuid_1, address_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, address, opts) {
        var trimmedGuid, trimmedAddress, _a, baseUrl, password, url, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedGuid = chatGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles removeParticipant requires chatGuid");
                    }
                    trimmedAddress = address.trim();
                    if (!trimmedAddress) {
                        throw new Error("BlueBubbles removeParticipant requires address");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmedGuid), "/participant"),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ address: trimmedAddress }),
                        }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles removeParticipant failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Leave a group chat via BlueBubbles API.
 */
function leaveBlueBubblesChat(chatGuid_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, opts) {
        var trimmedGuid, _a, baseUrl, password, url, res, errorText;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedGuid = chatGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles leaveChat requires chatGuid");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmedGuid), "/leave"),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, { method: "POST" }, opts.timeoutMs)];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _b.sent();
                    throw new Error("BlueBubbles leaveChat failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Set a group chat's icon/photo via BlueBubbles API.
 * Requires Private API to be enabled.
 */
function setGroupIconBlueBubbles(chatGuid_1, buffer_1, filename_1) {
    return __awaiter(this, arguments, void 0, function (chatGuid, buffer, filename, opts) {
        var trimmedGuid, _a, baseUrl, password, url, boundary, parts, encoder, totalLength, body, offset, _i, parts_1, part, res, errorText;
        var _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    trimmedGuid = chatGuid.trim();
                    if (!trimmedGuid) {
                        throw new Error("BlueBubbles setGroupIcon requires chatGuid");
                    }
                    if (!buffer || buffer.length === 0) {
                        throw new Error("BlueBubbles setGroupIcon requires image buffer");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/chat/".concat(encodeURIComponent(trimmedGuid), "/icon"),
                        password: password,
                    });
                    boundary = "----BlueBubblesFormBoundary".concat(node_crypto_1.default.randomUUID().replace(/-/g, ""));
                    parts = [];
                    encoder = new TextEncoder();
                    // Add file field named "icon" as per API spec
                    parts.push(encoder.encode("--".concat(boundary, "\r\n")));
                    parts.push(encoder.encode("Content-Disposition: form-data; name=\"icon\"; filename=\"".concat(filename, "\"\r\n")));
                    parts.push(encoder.encode("Content-Type: ".concat((_b = opts.contentType) !== null && _b !== void 0 ? _b : "application/octet-stream", "\r\n\r\n")));
                    parts.push(buffer);
                    parts.push(encoder.encode("\r\n"));
                    // Close multipart body
                    parts.push(encoder.encode("--".concat(boundary, "--\r\n")));
                    totalLength = parts.reduce(function (acc, part) { return acc + part.length; }, 0);
                    body = new Uint8Array(totalLength);
                    offset = 0;
                    for (_i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                        part = parts_1[_i];
                        body.set(part, offset);
                        offset += part.length;
                    }
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "multipart/form-data; boundary=".concat(boundary),
                            },
                            body: body,
                        }, (_c = opts.timeoutMs) !== null && _c !== void 0 ? _c : 60000)];
                case 1:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _d.sent();
                    throw new Error("BlueBubbles setGroupIcon failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
