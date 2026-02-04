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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGoogleChatMessage = sendGoogleChatMessage;
exports.updateGoogleChatMessage = updateGoogleChatMessage;
exports.deleteGoogleChatMessage = deleteGoogleChatMessage;
exports.uploadGoogleChatAttachment = uploadGoogleChatAttachment;
exports.downloadGoogleChatMedia = downloadGoogleChatMedia;
exports.createGoogleChatReaction = createGoogleChatReaction;
exports.listGoogleChatReactions = listGoogleChatReactions;
exports.deleteGoogleChatReaction = deleteGoogleChatReaction;
exports.findGoogleChatDirectMessage = findGoogleChatDirectMessage;
exports.probeGoogleChat = probeGoogleChat;
var node_crypto_1 = require("node:crypto");
var auth_js_1 = require("./auth.js");
var CHAT_API_BASE = "https://chat.googleapis.com/v1";
var CHAT_UPLOAD_BASE = "https://chat.googleapis.com/upload/v1";
var headersToObject = function (headers) {
    return headers instanceof Headers
        ? Object.fromEntries(headers.entries())
        : Array.isArray(headers)
            ? Object.fromEntries(headers)
            : headers || {};
};
function fetchJson(account, url, init) {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.getGoogleChatAccessToken)(account)];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, init), { headers: __assign(__assign({}, headersToObject(init.headers)), { Authorization: "Bearer ".concat(token), "Content-Type": "application/json" }) }))];
                case 2:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    text = _a.sent();
                    throw new Error("Google Chat API ".concat(res.status, ": ").concat(text || res.statusText));
                case 4: return [4 /*yield*/, res.json()];
                case 5: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
function fetchOk(account, url, init) {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.getGoogleChatAccessToken)(account)];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, init), { headers: __assign(__assign({}, headersToObject(init.headers)), { Authorization: "Bearer ".concat(token) }) }))];
                case 2:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    text = _a.sent();
                    throw new Error("Google Chat API ".concat(res.status, ": ").concat(text || res.statusText));
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchBuffer(account, url, init, options) {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, text, maxBytes, lengthHeader, length_1, buffer_1, _a, _b, contentType_1, reader, chunks, total, _c, done, value, buffer, contentType;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.getGoogleChatAccessToken)(account)];
                case 1:
                    token = _f.sent();
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, init), { headers: __assign(__assign({}, headersToObject(init === null || init === void 0 ? void 0 : init.headers)), { Authorization: "Bearer ".concat(token) }) }))];
                case 2:
                    res = _f.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    text = _f.sent();
                    throw new Error("Google Chat API ".concat(res.status, ": ").concat(text || res.statusText));
                case 4:
                    maxBytes = options === null || options === void 0 ? void 0 : options.maxBytes;
                    lengthHeader = res.headers.get("content-length");
                    if (maxBytes && lengthHeader) {
                        length_1 = Number(lengthHeader);
                        if (Number.isFinite(length_1) && length_1 > maxBytes) {
                            throw new Error("Google Chat media exceeds max bytes (".concat(maxBytes, ")"));
                        }
                    }
                    if (!(!maxBytes || !res.body)) return [3 /*break*/, 6];
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, res.arrayBuffer()];
                case 5:
                    buffer_1 = _b.apply(_a, [_f.sent()]);
                    contentType_1 = (_d = res.headers.get("content-type")) !== null && _d !== void 0 ? _d : undefined;
                    return [2 /*return*/, { buffer: buffer_1, contentType: contentType_1 }];
                case 6:
                    reader = res.body.getReader();
                    chunks = [];
                    total = 0;
                    _f.label = 7;
                case 7:
                    if (!true) return [3 /*break*/, 11];
                    return [4 /*yield*/, reader.read()];
                case 8:
                    _c = _f.sent(), done = _c.done, value = _c.value;
                    if (done) {
                        return [3 /*break*/, 11];
                    }
                    if (!value) {
                        return [3 /*break*/, 7];
                    }
                    total += value.length;
                    if (!(total > maxBytes)) return [3 /*break*/, 10];
                    return [4 /*yield*/, reader.cancel()];
                case 9:
                    _f.sent();
                    throw new Error("Google Chat media exceeds max bytes (".concat(maxBytes, ")"));
                case 10:
                    chunks.push(Buffer.from(value));
                    return [3 /*break*/, 7];
                case 11:
                    buffer = Buffer.concat(chunks, total);
                    contentType = (_e = res.headers.get("content-type")) !== null && _e !== void 0 ? _e : undefined;
                    return [2 /*return*/, { buffer: buffer, contentType: contentType }];
            }
        });
    });
}
function sendGoogleChatMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, space, text, thread, attachments, body, url, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, space = params.space, text = params.text, thread = params.thread, attachments = params.attachments;
                    body = {};
                    if (text) {
                        body.text = text;
                    }
                    if (thread) {
                        body.thread = { name: thread };
                    }
                    if (attachments && attachments.length > 0) {
                        body.attachment = attachments.map(function (item) { return (__assign({ attachmentDataRef: { attachmentUploadToken: item.attachmentUploadToken } }, (item.contentName ? { contentName: item.contentName } : {}))); });
                    }
                    url = "".concat(CHAT_API_BASE, "/").concat(space, "/messages");
                    return [4 /*yield*/, fetchJson(account, url, {
                            method: "POST",
                            body: JSON.stringify(body),
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result ? { messageName: result.name } : null];
            }
        });
    });
}
function updateGoogleChatMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, messageName, text, url, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, messageName = params.messageName, text = params.text;
                    url = "".concat(CHAT_API_BASE, "/").concat(messageName, "?updateMask=text");
                    return [4 /*yield*/, fetchJson(account, url, {
                            method: "PATCH",
                            body: JSON.stringify({ text: text }),
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, { messageName: result.name }];
            }
        });
    });
}
function deleteGoogleChatMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, messageName, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, messageName = params.messageName;
                    url = "".concat(CHAT_API_BASE, "/").concat(messageName);
                    return [4 /*yield*/, fetchOk(account, url, { method: "DELETE" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function uploadGoogleChatAttachment(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, space, filename, buffer, contentType, boundary, metadata, header, mediaHeader, footer, body, token, url, res, text, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    account = params.account, space = params.space, filename = params.filename, buffer = params.buffer, contentType = params.contentType;
                    boundary = "openclaw-".concat(node_crypto_1.default.randomUUID());
                    metadata = JSON.stringify({ filename: filename });
                    header = "--".concat(boundary, "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n").concat(metadata, "\r\n");
                    mediaHeader = "--".concat(boundary, "\r\nContent-Type: ").concat(contentType !== null && contentType !== void 0 ? contentType : "application/octet-stream", "\r\n\r\n");
                    footer = "\r\n--".concat(boundary, "--\r\n");
                    body = Buffer.concat([
                        Buffer.from(header, "utf8"),
                        Buffer.from(mediaHeader, "utf8"),
                        buffer,
                        Buffer.from(footer, "utf8"),
                    ]);
                    return [4 /*yield*/, (0, auth_js_1.getGoogleChatAccessToken)(account)];
                case 1:
                    token = _b.sent();
                    url = "".concat(CHAT_UPLOAD_BASE, "/").concat(space, "/attachments:upload?uploadType=multipart");
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                "Content-Type": "multipart/related; boundary=".concat(boundary),
                            },
                            body: body,
                        })];
                case 2:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    text = _b.sent();
                    throw new Error("Google Chat upload ".concat(res.status, ": ").concat(text || res.statusText));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    payload = (_b.sent());
                    return [2 /*return*/, {
                            attachmentUploadToken: (_a = payload.attachmentDataRef) === null || _a === void 0 ? void 0 : _a.attachmentUploadToken,
                        }];
            }
        });
    });
}
function downloadGoogleChatMedia(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, resourceName, maxBytes, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, resourceName = params.resourceName, maxBytes = params.maxBytes;
                    url = "".concat(CHAT_API_BASE, "/media/").concat(resourceName, "?alt=media");
                    return [4 /*yield*/, fetchBuffer(account, url, undefined, { maxBytes: maxBytes })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function createGoogleChatReaction(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, messageName, emoji, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, messageName = params.messageName, emoji = params.emoji;
                    url = "".concat(CHAT_API_BASE, "/").concat(messageName, "/reactions");
                    return [4 /*yield*/, fetchJson(account, url, {
                            method: "POST",
                            body: JSON.stringify({ emoji: { unicode: emoji } }),
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function listGoogleChatReactions(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, messageName, limit, url, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    account = params.account, messageName = params.messageName, limit = params.limit;
                    url = new URL("".concat(CHAT_API_BASE, "/").concat(messageName, "/reactions"));
                    if (limit && limit > 0) {
                        url.searchParams.set("pageSize", String(limit));
                    }
                    return [4 /*yield*/, fetchJson(account, url.toString(), {
                            method: "GET",
                        })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, (_a = result.reactions) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
}
function deleteGoogleChatReaction(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, reactionName, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, reactionName = params.reactionName;
                    url = "".concat(CHAT_API_BASE, "/").concat(reactionName);
                    return [4 /*yield*/, fetchOk(account, url, { method: "DELETE" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function findGoogleChatDirectMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, userName, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, userName = params.userName;
                    url = new URL("".concat(CHAT_API_BASE, "/spaces:findDirectMessage"));
                    url.searchParams.set("name", userName);
                    return [4 /*yield*/, fetchJson(account, url.toString(), {
                            method: "GET",
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function probeGoogleChat(account) {
    return __awaiter(this, void 0, void 0, function () {
        var url, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = new URL("".concat(CHAT_API_BASE, "/spaces"));
                    url.searchParams.set("pageSize", "1");
                    return [4 /*yield*/, fetchJson(account, url.toString(), {
                            method: "GET",
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { ok: true }];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, {
                            ok: false,
                            error: err_1 instanceof Error ? err_1.message : String(err_1),
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
