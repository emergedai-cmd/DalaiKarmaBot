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
exports.normalizeMattermostBaseUrl = normalizeMattermostBaseUrl;
exports.createMattermostClient = createMattermostClient;
exports.fetchMattermostMe = fetchMattermostMe;
exports.fetchMattermostUser = fetchMattermostUser;
exports.fetchMattermostUserByUsername = fetchMattermostUserByUsername;
exports.fetchMattermostChannel = fetchMattermostChannel;
exports.sendMattermostTyping = sendMattermostTyping;
exports.createMattermostDirectChannel = createMattermostDirectChannel;
exports.createMattermostPost = createMattermostPost;
exports.uploadMattermostFile = uploadMattermostFile;
function normalizeMattermostBaseUrl(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return undefined;
    }
    var withoutTrailing = trimmed.replace(/\/+$/, "");
    return withoutTrailing.replace(/\/api\/v4$/i, "");
}
function buildMattermostApiUrl(baseUrl, path) {
    var normalized = normalizeMattermostBaseUrl(baseUrl);
    if (!normalized) {
        throw new Error("Mattermost baseUrl is required");
    }
    var suffix = path.startsWith("/") ? path : "/".concat(path);
    return "".concat(normalized, "/api/v4").concat(suffix);
}
function readMattermostError(res) {
    return __awaiter(this, void 0, void 0, function () {
        var contentType, data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    contentType = (_a = res.headers.get("content-type")) !== null && _a !== void 0 ? _a : "";
                    if (!contentType.includes("application/json")) return [3 /*break*/, 2];
                    return [4 /*yield*/, res.json()];
                case 1:
                    data = (_b.sent());
                    if (data === null || data === void 0 ? void 0 : data.message) {
                        return [2 /*return*/, data.message];
                    }
                    return [2 /*return*/, JSON.stringify(data)];
                case 2: return [4 /*yield*/, res.text()];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function createMattermostClient(params) {
    var _this = this;
    var _a;
    var baseUrl = normalizeMattermostBaseUrl(params.baseUrl);
    if (!baseUrl) {
        throw new Error("Mattermost baseUrl is required");
    }
    var apiBaseUrl = "".concat(baseUrl, "/api/v4");
    var token = params.botToken.trim();
    var fetchImpl = (_a = params.fetchImpl) !== null && _a !== void 0 ? _a : fetch;
    var request = function (path, init) { return __awaiter(_this, void 0, void 0, function () {
        var url, headers, res, detail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = buildMattermostApiUrl(baseUrl, path);
                    headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
                    headers.set("Authorization", "Bearer ".concat(token));
                    if (typeof (init === null || init === void 0 ? void 0 : init.body) === "string" && !headers.has("Content-Type")) {
                        headers.set("Content-Type", "application/json");
                    }
                    return [4 /*yield*/, fetchImpl(url, __assign(__assign({}, init), { headers: headers }))];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, readMattermostError(res)];
                case 2:
                    detail = _a.sent();
                    throw new Error("Mattermost API ".concat(res.status, " ").concat(res.statusText, ": ").concat(detail || "unknown error"));
                case 3: return [4 /*yield*/, res.json()];
                case 4: return [2 /*return*/, (_a.sent())];
            }
        });
    }); };
    return { baseUrl: baseUrl, apiBaseUrl: apiBaseUrl, token: token, request: request };
}
function fetchMattermostMe(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.request("/users/me")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchMattermostUser(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.request("/users/".concat(userId))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchMattermostUserByUsername(client, username) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.request("/users/username/".concat(encodeURIComponent(username)))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchMattermostChannel(client, channelId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.request("/channels/".concat(channelId))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function sendMattermostTyping(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, parentId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = {
                        channel_id: params.channelId,
                    };
                    parentId = (_a = params.parentId) === null || _a === void 0 ? void 0 : _a.trim();
                    if (parentId) {
                        payload.parent_id = parentId;
                    }
                    return [4 /*yield*/, client.request("/users/me/typing", {
                            method: "POST",
                            body: JSON.stringify(payload),
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createMattermostDirectChannel(client, userIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.request("/channels/direct", {
                        method: "POST",
                        body: JSON.stringify(userIds),
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function createMattermostPost(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = {
                        channel_id: params.channelId,
                        message: params.message,
                    };
                    if (params.rootId) {
                        payload.root_id = params.rootId;
                    }
                    if ((_a = params.fileIds) === null || _a === void 0 ? void 0 : _a.length) {
                        payload.file_ids = params.fileIds;
                    }
                    return [4 /*yield*/, client.request("/posts", {
                            method: "POST",
                            body: JSON.stringify(payload),
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function uploadMattermostFile(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var form, fileName, bytes, blob, res, detail, data, info;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    form = new FormData();
                    fileName = ((_a = params.fileName) === null || _a === void 0 ? void 0 : _a.trim()) || "upload";
                    bytes = Uint8Array.from(params.buffer);
                    blob = params.contentType
                        ? new Blob([bytes], { type: params.contentType })
                        : new Blob([bytes]);
                    form.append("files", blob, fileName);
                    form.append("channel_id", params.channelId);
                    return [4 /*yield*/, fetch("".concat(client.apiBaseUrl, "/files"), {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(client.token),
                            },
                            body: form,
                        })];
                case 1:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, readMattermostError(res)];
                case 2:
                    detail = _c.sent();
                    throw new Error("Mattermost API ".concat(res.status, " ").concat(res.statusText, ": ").concat(detail || "unknown error"));
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = (_c.sent());
                    info = (_b = data.file_infos) === null || _b === void 0 ? void 0 : _b[0];
                    if (!(info === null || info === void 0 ? void 0 : info.id)) {
                        throw new Error("Mattermost file upload failed");
                    }
                    return [2 /*return*/, info];
            }
        });
    });
}
