"use strict";
/**
 * OneDrive/SharePoint upload utilities for MS Teams file sending.
 *
 * For group chats and channels, files are uploaded to SharePoint and shared via a link.
 * This module provides utilities for:
 * - Uploading files to OneDrive (personal scope - now deprecated for bot use)
 * - Uploading files to SharePoint (group/channel scope)
 * - Creating sharing links (organization-wide or per-user)
 * - Getting chat members for per-user sharing
 */
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
exports.uploadToOneDrive = uploadToOneDrive;
exports.createSharingLink = createSharingLink;
exports.uploadAndShareOneDrive = uploadAndShareOneDrive;
exports.uploadToSharePoint = uploadToSharePoint;
exports.getDriveItemProperties = getDriveItemProperties;
exports.getChatMembers = getChatMembers;
exports.createSharePointSharingLink = createSharePointSharingLink;
exports.uploadAndShareSharePoint = uploadAndShareSharePoint;
var GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
var GRAPH_BETA = "https://graph.microsoft.com/beta";
var GRAPH_SCOPE = "https://graph.microsoft.com";
/**
 * Upload a file to the user's OneDrive root folder.
 * For larger files, this uses the simple upload endpoint (up to 4MB).
 * TODO: For files >4MB, implement resumable upload session.
 */
function uploadToOneDrive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, token, uploadPath, res, body, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(GRAPH_SCOPE)];
                case 1:
                    token = _c.sent();
                    uploadPath = "/OpenClawShared/".concat(encodeURIComponent(params.filename));
                    return [4 /*yield*/, fetchFn("".concat(GRAPH_ROOT, "/me/drive/root:").concat(uploadPath, ":/content"), {
                            method: "PUT",
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                "Content-Type": (_b = params.contentType) !== null && _b !== void 0 ? _b : "application/octet-stream",
                            },
                            body: new Uint8Array(params.buffer),
                        })];
                case 2:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    body = _c.sent();
                    throw new Error("OneDrive upload failed: ".concat(res.status, " ").concat(res.statusText, " - ").concat(body));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = (_c.sent());
                    if (!data.id || !data.webUrl || !data.name) {
                        throw new Error("OneDrive upload response missing required fields");
                    }
                    return [2 /*return*/, {
                            id: data.id,
                            webUrl: data.webUrl,
                            name: data.name,
                        }];
            }
        });
    });
}
/**
 * Create a sharing link for a OneDrive file.
 * The link allows organization members to view the file.
 */
function createSharingLink(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, token, res, body, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(GRAPH_SCOPE)];
                case 1:
                    token = _d.sent();
                    return [4 /*yield*/, fetchFn("".concat(GRAPH_ROOT, "/me/drive/items/").concat(params.itemId, "/createLink"), {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                type: "view",
                                scope: (_b = params.scope) !== null && _b !== void 0 ? _b : "organization",
                            }),
                        })];
                case 2:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    body = _d.sent();
                    throw new Error("Create sharing link failed: ".concat(res.status, " ").concat(res.statusText, " - ").concat(body));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = (_d.sent());
                    if (!((_c = data.link) === null || _c === void 0 ? void 0 : _c.webUrl)) {
                        throw new Error("Create sharing link response missing webUrl");
                    }
                    return [2 /*return*/, {
                            webUrl: data.link.webUrl,
                        }];
            }
        });
    });
}
/**
 * Upload a file to OneDrive and create a sharing link.
 * Convenience function for the common case.
 */
function uploadAndShareOneDrive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var uploaded, shareLink;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadToOneDrive({
                        buffer: params.buffer,
                        filename: params.filename,
                        contentType: params.contentType,
                        tokenProvider: params.tokenProvider,
                        fetchFn: params.fetchFn,
                    })];
                case 1:
                    uploaded = _a.sent();
                    return [4 /*yield*/, createSharingLink({
                            itemId: uploaded.id,
                            tokenProvider: params.tokenProvider,
                            scope: params.scope,
                            fetchFn: params.fetchFn,
                        })];
                case 2:
                    shareLink = _a.sent();
                    return [2 /*return*/, {
                            itemId: uploaded.id,
                            webUrl: uploaded.webUrl,
                            shareUrl: shareLink.webUrl,
                            name: uploaded.name,
                        }];
            }
        });
    });
}
// ============================================================================
// SharePoint upload functions for group chats and channels
// ============================================================================
/**
 * Upload a file to a SharePoint site.
 * This is used for group chats and channels where /me/drive doesn't work for bots.
 *
 * @param params.siteId - SharePoint site ID (e.g., "contoso.sharepoint.com,guid1,guid2")
 */
function uploadToSharePoint(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, token, uploadPath, res, body, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(GRAPH_SCOPE)];
                case 1:
                    token = _c.sent();
                    uploadPath = "/OpenClawShared/".concat(encodeURIComponent(params.filename));
                    return [4 /*yield*/, fetchFn("".concat(GRAPH_ROOT, "/sites/").concat(params.siteId, "/drive/root:").concat(uploadPath, ":/content"), {
                            method: "PUT",
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                "Content-Type": (_b = params.contentType) !== null && _b !== void 0 ? _b : "application/octet-stream",
                            },
                            body: new Uint8Array(params.buffer),
                        })];
                case 2:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    body = _c.sent();
                    throw new Error("SharePoint upload failed: ".concat(res.status, " ").concat(res.statusText, " - ").concat(body));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = (_c.sent());
                    if (!data.id || !data.webUrl || !data.name) {
                        throw new Error("SharePoint upload response missing required fields");
                    }
                    return [2 /*return*/, {
                            id: data.id,
                            webUrl: data.webUrl,
                            name: data.name,
                        }];
            }
        });
    });
}
/**
 * Get driveItem properties needed for native Teams file card attachments.
 * This fetches the eTag and webDavUrl which are required for "reference" type attachments.
 *
 * @param params.siteId - SharePoint site ID
 * @param params.itemId - The driveItem ID (returned from upload)
 */
function getDriveItemProperties(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, token, res, body, data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(GRAPH_SCOPE)];
                case 1:
                    token = _b.sent();
                    return [4 /*yield*/, fetchFn("".concat(GRAPH_ROOT, "/sites/").concat(params.siteId, "/drive/items/").concat(params.itemId, "?$select=eTag,webDavUrl,name"), { headers: { Authorization: "Bearer ".concat(token) } })];
                case 2:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    body = _b.sent();
                    throw new Error("Get driveItem properties failed: ".concat(res.status, " ").concat(res.statusText, " - ").concat(body));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = (_b.sent());
                    if (!data.eTag || !data.webDavUrl || !data.name) {
                        throw new Error("DriveItem response missing required properties (eTag, webDavUrl, or name)");
                    }
                    return [2 /*return*/, {
                            eTag: data.eTag,
                            webDavUrl: data.webDavUrl,
                            name: data.name,
                        }];
            }
        });
    });
}
/**
 * Get members of a Teams chat for per-user sharing.
 * Used to create sharing links scoped to only the chat participants.
 */
function getChatMembers(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, token, res, body, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(GRAPH_SCOPE)];
                case 1:
                    token = _c.sent();
                    return [4 /*yield*/, fetchFn("".concat(GRAPH_ROOT, "/chats/").concat(params.chatId, "/members"), {
                            headers: { Authorization: "Bearer ".concat(token) },
                        })];
                case 2:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    body = _c.sent();
                    throw new Error("Get chat members failed: ".concat(res.status, " ").concat(res.statusText, " - ").concat(body));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = (_c.sent());
                    return [2 /*return*/, ((_b = data.value) !== null && _b !== void 0 ? _b : [])
                            .map(function (m) {
                            var _a;
                            return ({
                                aadObjectId: (_a = m.userId) !== null && _a !== void 0 ? _a : "",
                                displayName: m.displayName,
                            });
                        })
                            .filter(function (m) { return m.aadObjectId; })];
            }
        });
    });
}
/**
 * Create a sharing link for a SharePoint drive item.
 * For organization scope (default), uses v1.0 API.
 * For per-user scope, uses beta API with recipients.
 */
function createSharePointSharingLink(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFn, token, scope, apiRoot, body, res, respBody, data;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    fetchFn = (_a = params.fetchFn) !== null && _a !== void 0 ? _a : fetch;
                    return [4 /*yield*/, params.tokenProvider.getAccessToken(GRAPH_SCOPE)];
                case 1:
                    token = _e.sent();
                    scope = (_b = params.scope) !== null && _b !== void 0 ? _b : "organization";
                    apiRoot = scope === "users" ? GRAPH_BETA : GRAPH_ROOT;
                    body = {
                        type: "view",
                        scope: scope === "users" ? "users" : "organization",
                    };
                    // Add recipients for per-user sharing
                    if (scope === "users" && ((_c = params.recipientObjectIds) === null || _c === void 0 ? void 0 : _c.length)) {
                        body.recipients = params.recipientObjectIds.map(function (id) { return ({ objectId: id }); });
                    }
                    return [4 /*yield*/, fetchFn("".concat(apiRoot, "/sites/").concat(params.siteId, "/drive/items/").concat(params.itemId, "/createLink"), {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })];
                case 2:
                    res = _e.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 3:
                    respBody = _e.sent();
                    throw new Error("Create SharePoint sharing link failed: ".concat(res.status, " ").concat(res.statusText, " - ").concat(respBody));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = (_e.sent());
                    if (!((_d = data.link) === null || _d === void 0 ? void 0 : _d.webUrl)) {
                        throw new Error("Create SharePoint sharing link response missing webUrl");
                    }
                    return [2 /*return*/, {
                            webUrl: data.link.webUrl,
                        }];
            }
        });
    });
}
/**
 * Upload a file to SharePoint and create a sharing link.
 *
 * For group chats, this creates a per-user sharing link scoped to chat members.
 * For channels, this creates an organization-wide sharing link.
 *
 * @param params.siteId - SharePoint site ID
 * @param params.chatId - Optional chat ID for per-user sharing (group chats)
 * @param params.usePerUserSharing - Whether to use per-user sharing (requires beta API + Chat.Read.All)
 */
function uploadAndShareSharePoint(params) {
    return __awaiter(this, void 0, void 0, function () {
        var uploaded, scope, recipientObjectIds, members, _a, shareLink;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, uploadToSharePoint({
                        buffer: params.buffer,
                        filename: params.filename,
                        contentType: params.contentType,
                        tokenProvider: params.tokenProvider,
                        siteId: params.siteId,
                        fetchFn: params.fetchFn,
                    })];
                case 1:
                    uploaded = _b.sent();
                    scope = "organization";
                    if (!(params.usePerUserSharing && params.chatId)) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getChatMembers({
                            chatId: params.chatId,
                            tokenProvider: params.tokenProvider,
                            fetchFn: params.fetchFn,
                        })];
                case 3:
                    members = _b.sent();
                    if (members.length > 0) {
                        scope = "users";
                        recipientObjectIds = members.map(function (m) { return m.aadObjectId; });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, createSharePointSharingLink({
                        siteId: params.siteId,
                        itemId: uploaded.id,
                        tokenProvider: params.tokenProvider,
                        scope: scope,
                        recipientObjectIds: recipientObjectIds,
                        fetchFn: params.fetchFn,
                    })];
                case 6:
                    shareLink = _b.sent();
                    return [2 /*return*/, {
                            itemId: uploaded.id,
                            webUrl: uploaded.webUrl,
                            shareUrl: shareLink.webUrl,
                            name: uploaded.name,
                        }];
            }
        });
    });
}
