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
exports.buildMSTeamsGraphMessageUrls = buildMSTeamsGraphMessageUrls;
exports.downloadMSTeamsGraphMedia = downloadMSTeamsGraphMedia;
var runtime_js_1 = require("../runtime.js");
var download_js_1 = require("./download.js");
var shared_js_1 = require("./shared.js");
function readNestedString(value, keys) {
    var current = value;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!(0, shared_js_1.isRecord)(current)) {
            return undefined;
        }
        current = current[key];
    }
    return typeof current === "string" && current.trim() ? current.trim() : undefined;
}
function buildMSTeamsGraphMessageUrls(params) {
    var _a, _b, _c, _d, _e, _f;
    var conversationType = (_b = (_a = params.conversationType) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : "";
    var messageIdCandidates = new Set();
    var pushCandidate = function (value) {
        var trimmed = typeof value === "string" ? value.trim() : "";
        if (trimmed) {
            messageIdCandidates.add(trimmed);
        }
    };
    pushCandidate(params.messageId);
    pushCandidate(params.conversationMessageId);
    pushCandidate(readNestedString(params.channelData, ["messageId"]));
    pushCandidate(readNestedString(params.channelData, ["teamsMessageId"]));
    var replyToId = typeof params.replyToId === "string" ? params.replyToId.trim() : "";
    if (conversationType === "channel") {
        var teamId = (_c = readNestedString(params.channelData, ["team", "id"])) !== null && _c !== void 0 ? _c : readNestedString(params.channelData, ["teamId"]);
        var channelId = (_e = (_d = readNestedString(params.channelData, ["channel", "id"])) !== null && _d !== void 0 ? _d : readNestedString(params.channelData, ["channelId"])) !== null && _e !== void 0 ? _e : readNestedString(params.channelData, ["teamsChannelId"]);
        if (!teamId || !channelId) {
            return [];
        }
        var urls_1 = [];
        if (replyToId) {
            for (var _i = 0, messageIdCandidates_1 = messageIdCandidates; _i < messageIdCandidates_1.length; _i++) {
                var candidate = messageIdCandidates_1[_i];
                if (candidate === replyToId) {
                    continue;
                }
                urls_1.push("".concat(shared_js_1.GRAPH_ROOT, "/teams/").concat(encodeURIComponent(teamId), "/channels/").concat(encodeURIComponent(channelId), "/messages/").concat(encodeURIComponent(replyToId), "/replies/").concat(encodeURIComponent(candidate)));
            }
        }
        if (messageIdCandidates.size === 0 && replyToId) {
            messageIdCandidates.add(replyToId);
        }
        for (var _g = 0, messageIdCandidates_2 = messageIdCandidates; _g < messageIdCandidates_2.length; _g++) {
            var candidate = messageIdCandidates_2[_g];
            urls_1.push("".concat(shared_js_1.GRAPH_ROOT, "/teams/").concat(encodeURIComponent(teamId), "/channels/").concat(encodeURIComponent(channelId), "/messages/").concat(encodeURIComponent(candidate)));
        }
        return Array.from(new Set(urls_1));
    }
    var chatId = ((_f = params.conversationId) === null || _f === void 0 ? void 0 : _f.trim()) || readNestedString(params.channelData, ["chatId"]);
    if (!chatId) {
        return [];
    }
    if (messageIdCandidates.size === 0 && replyToId) {
        messageIdCandidates.add(replyToId);
    }
    var urls = Array.from(messageIdCandidates).map(function (candidate) {
        return "".concat(shared_js_1.GRAPH_ROOT, "/chats/").concat(encodeURIComponent(chatId), "/messages/").concat(encodeURIComponent(candidate));
    });
    return Array.from(new Set(urls));
}
function fetchGraphCollection(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, res, status, data, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchFn = (_b = params.fetchFn) !== null && _b !== void 0 ? _b : fetch;
                    return [4 /*yield*/, fetchFn(params.url, {
                            headers: { Authorization: "Bearer ".concat(params.accessToken) },
                        })];
                case 1:
                    res = _c.sent();
                    status = res.status;
                    if (!res.ok) {
                        return [2 /*return*/, { status: status, items: [] }];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_c.sent());
                    return [2 /*return*/, { status: status, items: Array.isArray(data.value) ? data.value : [] }];
                case 4:
                    _a = _c.sent();
                    return [2 /*return*/, { status: status, items: [] }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function normalizeGraphAttachment(att) {
    var _a, _b, _c, _d;
    var content = att.content;
    if (typeof content === "string") {
        try {
            content = JSON.parse(content);
        }
        catch (_e) {
            // Keep as raw string if it's not JSON.
        }
    }
    return {
        contentType: (_a = (0, shared_js_1.normalizeContentType)(att.contentType)) !== null && _a !== void 0 ? _a : undefined,
        contentUrl: (_b = att.contentUrl) !== null && _b !== void 0 ? _b : undefined,
        name: (_c = att.name) !== null && _c !== void 0 ? _c : undefined,
        thumbnailUrl: (_d = att.thumbnailUrl) !== null && _d !== void 0 ? _d : undefined,
        content: content,
    };
}
/**
 * Download all hosted content from a Teams message (images, documents, etc.).
 * Renamed from downloadGraphHostedImages to support all file types.
 */
function downloadGraphHostedContent(params) {
    return __awaiter(this, void 0, void 0, function () {
        var hosted, out, _i, _a, item, contentBytes, buffer, mime, saved, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fetchGraphCollection({
                        url: "".concat(params.messageUrl, "/hostedContents"),
                        accessToken: params.accessToken,
                        fetchFn: params.fetchFn,
                    })];
                case 1:
                    hosted = _e.sent();
                    if (hosted.items.length === 0) {
                        return [2 /*return*/, { media: [], status: hosted.status, count: 0 }];
                    }
                    out = [];
                    _i = 0, _a = hosted.items;
                    _e.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    item = _a[_i];
                    contentBytes = typeof item.contentBytes === "string" ? item.contentBytes : "";
                    if (!contentBytes) {
                        return [3 /*break*/, 7];
                    }
                    buffer = void 0;
                    try {
                        buffer = Buffer.from(contentBytes, "base64");
                    }
                    catch (_f) {
                        return [3 /*break*/, 7];
                    }
                    if (buffer.byteLength > params.maxBytes) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().media.detectMime({
                            buffer: buffer,
                            headerMime: (_c = item.contentType) !== null && _c !== void 0 ? _c : undefined,
                        })];
                case 3:
                    mime = _e.sent();
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().channel.media.saveMediaBuffer(buffer, (_d = mime !== null && mime !== void 0 ? mime : item.contentType) !== null && _d !== void 0 ? _d : undefined, "inbound", params.maxBytes)];
                case 5:
                    saved = _e.sent();
                    out.push({
                        path: saved.path,
                        contentType: saved.contentType,
                        placeholder: (0, shared_js_1.inferPlaceholder)({ contentType: saved.contentType }),
                    });
                    return [3 /*break*/, 7];
                case 6:
                    _b = _e.sent();
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, { media: out, status: hosted.status, count: hosted.items.length }];
            }
        });
    });
}
function downloadMSTeamsGraphMedia(params) {
    return __awaiter(this, void 0, void 0, function () {
        var allowHosts, messageUrl, accessToken, _a, fetchFn, sharePointMedia, downloadedReferenceUrls, msgRes, msgData, spAttachments, _i, spAttachments_1, att, name_1, shareUrl, encodedUrl, sharesUrl, spRes, buffer, _b, _c, mime, originalFilename, saved, _d, _e, hosted, attachments, normalizedAttachments, filteredAttachments, attachmentMedia;
        var _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!params.messageUrl || !params.tokenProvider) {
                        return [2 /*return*/, { media: [] }];
                    }
                    allowHosts = (0, shared_js_1.resolveAllowedHosts)(params.allowHosts);
                    messageUrl = params.messageUrl;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, params.tokenProvider.getAccessToken("https://graph.microsoft.com")];
                case 2:
                    accessToken = _k.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _k.sent();
                    return [2 /*return*/, { media: [], messageUrl: messageUrl, tokenError: true }];
                case 4:
                    fetchFn = (_f = params.fetchFn) !== null && _f !== void 0 ? _f : fetch;
                    sharePointMedia = [];
                    downloadedReferenceUrls = new Set();
                    _k.label = 5;
                case 5:
                    _k.trys.push([5, 18, , 19]);
                    return [4 /*yield*/, fetchFn(messageUrl, {
                            headers: { Authorization: "Bearer ".concat(accessToken) },
                        })];
                case 6:
                    msgRes = _k.sent();
                    if (!msgRes.ok) return [3 /*break*/, 17];
                    return [4 /*yield*/, msgRes.json()];
                case 7:
                    msgData = (_k.sent());
                    spAttachments = ((_g = msgData.attachments) !== null && _g !== void 0 ? _g : []).filter(function (a) { return a.contentType === "reference" && a.contentUrl && a.name; });
                    _i = 0, spAttachments_1 = spAttachments;
                    _k.label = 8;
                case 8:
                    if (!(_i < spAttachments_1.length)) return [3 /*break*/, 17];
                    att = spAttachments_1[_i];
                    name_1 = (_h = att.name) !== null && _h !== void 0 ? _h : "file";
                    _k.label = 9;
                case 9:
                    _k.trys.push([9, 15, , 16]);
                    shareUrl = att.contentUrl;
                    encodedUrl = Buffer.from(shareUrl).toString("base64url");
                    sharesUrl = "".concat(shared_js_1.GRAPH_ROOT, "/shares/u!").concat(encodedUrl, "/driveItem/content");
                    return [4 /*yield*/, fetchFn(sharesUrl, {
                            headers: { Authorization: "Bearer ".concat(accessToken) },
                            redirect: "follow",
                        })];
                case 10:
                    spRes = _k.sent();
                    if (!spRes.ok) return [3 /*break*/, 14];
                    _c = (_b = Buffer).from;
                    return [4 /*yield*/, spRes.arrayBuffer()];
                case 11:
                    buffer = _c.apply(_b, [_k.sent()]);
                    if (!(buffer.byteLength <= params.maxBytes)) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().media.detectMime({
                            buffer: buffer,
                            headerMime: (_j = spRes.headers.get("content-type")) !== null && _j !== void 0 ? _j : undefined,
                            filePath: name_1,
                        })];
                case 12:
                    mime = _k.sent();
                    originalFilename = params.preserveFilenames ? name_1 : undefined;
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().channel.media.saveMediaBuffer(buffer, mime !== null && mime !== void 0 ? mime : "application/octet-stream", "inbound", params.maxBytes, originalFilename)];
                case 13:
                    saved = _k.sent();
                    sharePointMedia.push({
                        path: saved.path,
                        contentType: saved.contentType,
                        placeholder: (0, shared_js_1.inferPlaceholder)({ contentType: saved.contentType, fileName: name_1 }),
                    });
                    downloadedReferenceUrls.add(shareUrl);
                    _k.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    _d = _k.sent();
                    return [3 /*break*/, 16];
                case 16:
                    _i++;
                    return [3 /*break*/, 8];
                case 17: return [3 /*break*/, 19];
                case 18:
                    _e = _k.sent();
                    return [3 /*break*/, 19];
                case 19: return [4 /*yield*/, downloadGraphHostedContent({
                        accessToken: accessToken,
                        messageUrl: messageUrl,
                        maxBytes: params.maxBytes,
                        fetchFn: params.fetchFn,
                        preserveFilenames: params.preserveFilenames,
                    })];
                case 20:
                    hosted = _k.sent();
                    return [4 /*yield*/, fetchGraphCollection({
                            url: "".concat(messageUrl, "/attachments"),
                            accessToken: accessToken,
                            fetchFn: params.fetchFn,
                        })];
                case 21:
                    attachments = _k.sent();
                    normalizedAttachments = attachments.items.map(normalizeGraphAttachment);
                    filteredAttachments = sharePointMedia.length > 0
                        ? normalizedAttachments.filter(function (att) {
                            var _a;
                            var contentType = (_a = att.contentType) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                            if (contentType !== "reference") {
                                return true;
                            }
                            var url = typeof att.contentUrl === "string" ? att.contentUrl : "";
                            if (!url) {
                                return true;
                            }
                            return !downloadedReferenceUrls.has(url);
                        })
                        : normalizedAttachments;
                    return [4 /*yield*/, (0, download_js_1.downloadMSTeamsAttachments)({
                            attachments: filteredAttachments,
                            maxBytes: params.maxBytes,
                            tokenProvider: params.tokenProvider,
                            allowHosts: allowHosts,
                            authAllowHosts: params.authAllowHosts,
                            fetchFn: params.fetchFn,
                            preserveFilenames: params.preserveFilenames,
                        })];
                case 22:
                    attachmentMedia = _k.sent();
                    return [2 /*return*/, {
                            media: __spreadArray(__spreadArray(__spreadArray([], sharePointMedia, true), hosted.media, true), attachmentMedia, true),
                            hostedCount: hosted.count,
                            attachmentCount: filteredAttachments.length + sharePointMedia.length,
                            hostedStatus: hosted.status,
                            attachmentStatus: attachments.status,
                            messageUrl: messageUrl,
                        }];
            }
        });
    });
}
