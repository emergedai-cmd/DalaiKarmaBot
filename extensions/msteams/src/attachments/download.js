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
exports.downloadMSTeamsImageAttachments = void 0;
exports.downloadMSTeamsAttachments = downloadMSTeamsAttachments;
var runtime_js_1 = require("../runtime.js");
var shared_js_1 = require("./shared.js");
function resolveDownloadCandidate(att) {
    var contentType = (0, shared_js_1.normalizeContentType)(att.contentType);
    var name = typeof att.name === "string" ? att.name.trim() : "";
    if (contentType === "application/vnd.microsoft.teams.file.download.info") {
        if (!(0, shared_js_1.isRecord)(att.content)) {
            return null;
        }
        var downloadUrl = typeof att.content.downloadUrl === "string" ? att.content.downloadUrl.trim() : "";
        if (!downloadUrl) {
            return null;
        }
        var fileType = typeof att.content.fileType === "string" ? att.content.fileType.trim() : "";
        var uniqueId = typeof att.content.uniqueId === "string" ? att.content.uniqueId.trim() : "";
        var fileName = typeof att.content.fileName === "string" ? att.content.fileName.trim() : "";
        var fileHint = name || fileName || (uniqueId && fileType ? "".concat(uniqueId, ".").concat(fileType) : "");
        return {
            url: downloadUrl,
            fileHint: fileHint || undefined,
            contentTypeHint: undefined,
            placeholder: (0, shared_js_1.inferPlaceholder)({
                contentType: contentType,
                fileName: fileHint,
                fileType: fileType,
            }),
        };
    }
    var contentUrl = typeof att.contentUrl === "string" ? att.contentUrl.trim() : "";
    if (!contentUrl) {
        return null;
    }
    return {
        url: contentUrl,
        fileHint: name || undefined,
        contentTypeHint: contentType,
        placeholder: (0, shared_js_1.inferPlaceholder)({ contentType: contentType, fileName: name }),
    };
}
function scopeCandidatesForUrl(url) {
    try {
        var host = new URL(url).hostname.toLowerCase();
        var looksLikeGraph = host.endsWith("graph.microsoft.com") ||
            host.endsWith("sharepoint.com") ||
            host.endsWith("1drv.ms") ||
            host.includes("sharepoint");
        return looksLikeGraph
            ? ["https://graph.microsoft.com", "https://api.botframework.com"]
            : ["https://api.botframework.com", "https://graph.microsoft.com"];
    }
    catch (_a) {
        return ["https://api.botframework.com", "https://graph.microsoft.com"];
    }
}
function fetchWithAuthFallback(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, firstAttempt, scopes, _i, scopes_1, scope, token, res, redirectUrl, redirectRes, redirectAuthRes, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchFn = (_b = params.fetchFn) !== null && _b !== void 0 ? _b : fetch;
                    return [4 /*yield*/, fetchFn(params.url)];
                case 1:
                    firstAttempt = _c.sent();
                    if (firstAttempt.ok) {
                        return [2 /*return*/, firstAttempt];
                    }
                    if (!params.tokenProvider) {
                        return [2 /*return*/, firstAttempt];
                    }
                    if (firstAttempt.status !== 401 && firstAttempt.status !== 403) {
                        return [2 /*return*/, firstAttempt];
                    }
                    if (!(0, shared_js_1.isUrlAllowed)(params.url, params.authAllowHosts)) {
                        return [2 /*return*/, firstAttempt];
                    }
                    scopes = scopeCandidatesForUrl(params.url);
                    _i = 0, scopes_1 = scopes;
                    _c.label = 2;
                case 2:
                    if (!(_i < scopes_1.length)) return [3 /*break*/, 11];
                    scope = scopes_1[_i];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 9, , 10]);
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(scope)];
                case 4:
                    token = _c.sent();
                    return [4 /*yield*/, fetchFn(params.url, {
                            headers: { Authorization: "Bearer ".concat(token) },
                            redirect: "manual",
                        })];
                case 5:
                    res = _c.sent();
                    if (res.ok) {
                        return [2 /*return*/, res];
                    }
                    redirectUrl = readRedirectUrl(params.url, res);
                    if (!(redirectUrl && (0, shared_js_1.isUrlAllowed)(redirectUrl, params.allowHosts))) return [3 /*break*/, 8];
                    return [4 /*yield*/, fetchFn(redirectUrl)];
                case 6:
                    redirectRes = _c.sent();
                    if (redirectRes.ok) {
                        return [2 /*return*/, redirectRes];
                    }
                    if (!((redirectRes.status === 401 || redirectRes.status === 403) &&
                        (0, shared_js_1.isUrlAllowed)(redirectUrl, params.authAllowHosts))) return [3 /*break*/, 8];
                    return [4 /*yield*/, fetchFn(redirectUrl, {
                            headers: { Authorization: "Bearer ".concat(token) },
                            redirect: "manual",
                        })];
                case 7:
                    redirectAuthRes = _c.sent();
                    if (redirectAuthRes.ok) {
                        return [2 /*return*/, redirectAuthRes];
                    }
                    _c.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    _a = _c.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 2];
                case 11: return [2 /*return*/, firstAttempt];
            }
        });
    });
}
function readRedirectUrl(baseUrl, res) {
    if (![301, 302, 303, 307, 308].includes(res.status)) {
        return null;
    }
    var location = res.headers.get("location");
    if (!location) {
        return null;
    }
    try {
        return new URL(location, baseUrl).toString();
    }
    catch (_a) {
        return null;
    }
}
/**
 * Download all file attachments from a Teams message (images, documents, etc.).
 * Renamed from downloadMSTeamsImageAttachments to support all file types.
 */
function downloadMSTeamsAttachments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var list, allowHosts, authAllowHosts, downloadable, candidates, inlineCandidates, seenUrls, _i, inlineCandidates_1, inline, out, _a, inlineCandidates_2, inline, saved, _b, _c, candidates_1, candidate, res, buffer, _d, _e, mime, originalFilename, saved, _f;
        var _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    list = Array.isArray(params.attachments) ? params.attachments : [];
                    if (list.length === 0) {
                        return [2 /*return*/, []];
                    }
                    allowHosts = (0, shared_js_1.resolveAllowedHosts)(params.allowHosts);
                    authAllowHosts = (0, shared_js_1.resolveAuthAllowedHosts)(params.authAllowHosts);
                    downloadable = list.filter(shared_js_1.isDownloadableAttachment);
                    candidates = downloadable
                        .map(resolveDownloadCandidate)
                        .filter(Boolean);
                    inlineCandidates = (0, shared_js_1.extractInlineImageCandidates)(list);
                    seenUrls = new Set();
                    for (_i = 0, inlineCandidates_1 = inlineCandidates; _i < inlineCandidates_1.length; _i++) {
                        inline = inlineCandidates_1[_i];
                        if (inline.kind === "url") {
                            if (!(0, shared_js_1.isUrlAllowed)(inline.url, allowHosts)) {
                                continue;
                            }
                            if (seenUrls.has(inline.url)) {
                                continue;
                            }
                            seenUrls.add(inline.url);
                            candidates.push({
                                url: inline.url,
                                fileHint: inline.fileHint,
                                contentTypeHint: inline.contentType,
                                placeholder: inline.placeholder,
                            });
                        }
                    }
                    if (candidates.length === 0 && inlineCandidates.length === 0) {
                        return [2 /*return*/, []];
                    }
                    out = [];
                    _a = 0, inlineCandidates_2 = inlineCandidates;
                    _h.label = 1;
                case 1:
                    if (!(_a < inlineCandidates_2.length)) return [3 /*break*/, 6];
                    inline = inlineCandidates_2[_a];
                    if (inline.kind !== "data") {
                        return [3 /*break*/, 5];
                    }
                    if (inline.data.byteLength > params.maxBytes) {
                        return [3 /*break*/, 5];
                    }
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().channel.media.saveMediaBuffer(inline.data, inline.contentType, "inbound", params.maxBytes)];
                case 3:
                    saved = _h.sent();
                    out.push({
                        path: saved.path,
                        contentType: saved.contentType,
                        placeholder: inline.placeholder,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    _b = _h.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _a++;
                    return [3 /*break*/, 1];
                case 6:
                    _c = 0, candidates_1 = candidates;
                    _h.label = 7;
                case 7:
                    if (!(_c < candidates_1.length)) return [3 /*break*/, 15];
                    candidate = candidates_1[_c];
                    if (!(0, shared_js_1.isUrlAllowed)(candidate.url, allowHosts)) {
                        return [3 /*break*/, 14];
                    }
                    _h.label = 8;
                case 8:
                    _h.trys.push([8, 13, , 14]);
                    return [4 /*yield*/, fetchWithAuthFallback({
                            url: candidate.url,
                            tokenProvider: params.tokenProvider,
                            fetchFn: params.fetchFn,
                            allowHosts: allowHosts,
                            authAllowHosts: authAllowHosts,
                        })];
                case 9:
                    res = _h.sent();
                    if (!res.ok) {
                        return [3 /*break*/, 14];
                    }
                    _e = (_d = Buffer).from;
                    return [4 /*yield*/, res.arrayBuffer()];
                case 10:
                    buffer = _e.apply(_d, [_h.sent()]);
                    if (buffer.byteLength > params.maxBytes) {
                        return [3 /*break*/, 14];
                    }
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().media.detectMime({
                            buffer: buffer,
                            headerMime: res.headers.get("content-type"),
                            filePath: (_g = candidate.fileHint) !== null && _g !== void 0 ? _g : candidate.url,
                        })];
                case 11:
                    mime = _h.sent();
                    originalFilename = params.preserveFilenames ? candidate.fileHint : undefined;
                    return [4 /*yield*/, (0, runtime_js_1.getMSTeamsRuntime)().channel.media.saveMediaBuffer(buffer, mime !== null && mime !== void 0 ? mime : candidate.contentTypeHint, "inbound", params.maxBytes, originalFilename)];
                case 12:
                    saved = _h.sent();
                    out.push({
                        path: saved.path,
                        contentType: saved.contentType,
                        placeholder: candidate.placeholder,
                    });
                    return [3 /*break*/, 14];
                case 13:
                    _f = _h.sent();
                    return [3 /*break*/, 14];
                case 14:
                    _c++;
                    return [3 /*break*/, 7];
                case 15: return [2 /*return*/, out];
            }
        });
    });
}
/**
 * @deprecated Use `downloadMSTeamsAttachments` instead (supports all file types).
 */
exports.downloadMSTeamsImageAttachments = downloadMSTeamsAttachments;
