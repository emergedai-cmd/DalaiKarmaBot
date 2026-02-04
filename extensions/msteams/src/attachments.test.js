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
var vitest_1 = require("vitest");
var runtime_js_1 = require("./runtime.js");
var detectMimeMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, "image/png"];
}); }); });
var saveMediaBufferMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ({
                path: "/tmp/saved.png",
                contentType: "image/png",
            })];
    });
}); });
var runtimeStub = {
    media: {
        detectMime: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return detectMimeMock.apply(void 0, args);
        },
    },
    channel: {
        media: {
            saveMediaBuffer: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return saveMediaBufferMock.apply(void 0, args);
            },
        },
    },
};
(0, vitest_1.describe)("msteams attachments", function () {
    var load = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./attachments.js"); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    (0, vitest_1.beforeEach)(function () {
        detectMimeMock.mockClear();
        saveMediaBufferMock.mockClear();
        (0, runtime_js_1.setMSTeamsRuntime)(runtimeStub);
    });
    (0, vitest_1.describe)("buildMSTeamsAttachmentPlaceholder", function () {
        (0, vitest_1.it)("returns empty string when no attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsAttachmentPlaceholder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsAttachmentPlaceholder = (_a.sent()).buildMSTeamsAttachmentPlaceholder;
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder(undefined)).toBe("");
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([])).toBe("");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns image placeholder for image attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsAttachmentPlaceholder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsAttachmentPlaceholder = (_a.sent()).buildMSTeamsAttachmentPlaceholder;
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            { contentType: "image/png", contentUrl: "https://x/img.png" },
                        ])).toBe("<media:image>");
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            { contentType: "image/png", contentUrl: "https://x/1.png" },
                            { contentType: "image/jpeg", contentUrl: "https://x/2.jpg" },
                        ])).toBe("<media:image> (2 images)");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("treats Teams file.download.info image attachments as images", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsAttachmentPlaceholder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsAttachmentPlaceholder = (_a.sent()).buildMSTeamsAttachmentPlaceholder;
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            {
                                contentType: "application/vnd.microsoft.teams.file.download.info",
                                content: { downloadUrl: "https://x/dl", fileType: "png" },
                            },
                        ])).toBe("<media:image>");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns document placeholder for non-image attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsAttachmentPlaceholder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsAttachmentPlaceholder = (_a.sent()).buildMSTeamsAttachmentPlaceholder;
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            { contentType: "application/pdf", contentUrl: "https://x/x.pdf" },
                        ])).toBe("<media:document>");
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            { contentType: "application/pdf", contentUrl: "https://x/1.pdf" },
                            { contentType: "application/pdf", contentUrl: "https://x/2.pdf" },
                        ])).toBe("<media:document> (2 files)");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("counts inline images in text/html attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsAttachmentPlaceholder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsAttachmentPlaceholder = (_a.sent()).buildMSTeamsAttachmentPlaceholder;
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            {
                                contentType: "text/html",
                                content: '<p>hi</p><img src="https://x/a.png" />',
                            },
                        ])).toBe("<media:image>");
                        (0, vitest_1.expect)(buildMSTeamsAttachmentPlaceholder([
                            {
                                contentType: "text/html",
                                content: '<img src="https://x/a.png" /><img src="https://x/b.png" />',
                            },
                        ])).toBe("<media:image> (2 images)");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("downloadMSTeamsAttachments", function () {
        (0, vitest_1.it)("downloads and stores image contentUrl attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, fetchMock, media;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_b.sent()).downloadMSTeamsAttachments;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Response(Buffer.from("png"), {
                                        status: 200,
                                        headers: { "content-type": "image/png" },
                                    })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [{ contentType: "image/png", contentUrl: "https://x/img" }],
                                maxBytes: 1024 * 1024,
                                allowHosts: ["x"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _b.sent();
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledWith("https://x/img");
                        (0, vitest_1.expect)(saveMediaBufferMock).toHaveBeenCalled();
                        (0, vitest_1.expect)(media).toHaveLength(1);
                        (0, vitest_1.expect)((_a = media[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("/tmp/saved.png");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("supports Teams file.download.info downloadUrl attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_a.sent()).downloadMSTeamsAttachments;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Response(Buffer.from("png"), {
                                        status: 200,
                                        headers: { "content-type": "image/png" },
                                    })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [
                                    {
                                        contentType: "application/vnd.microsoft.teams.file.download.info",
                                        content: { downloadUrl: "https://x/dl", fileType: "png" },
                                    },
                                ],
                                maxBytes: 1024 * 1024,
                                allowHosts: ["x"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledWith("https://x/dl");
                        (0, vitest_1.expect)(media).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("downloads non-image file attachments (PDF)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, fetchMock, media;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_c.sent()).downloadMSTeamsAttachments;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Response(Buffer.from("pdf"), {
                                        status: 200,
                                        headers: { "content-type": "application/pdf" },
                                    })];
                            });
                        }); });
                        detectMimeMock.mockResolvedValueOnce("application/pdf");
                        saveMediaBufferMock.mockResolvedValueOnce({
                            path: "/tmp/saved.pdf",
                            contentType: "application/pdf",
                        });
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [{ contentType: "application/pdf", contentUrl: "https://x/doc.pdf" }],
                                maxBytes: 1024 * 1024,
                                allowHosts: ["x"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _c.sent();
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledWith("https://x/doc.pdf");
                        (0, vitest_1.expect)(media).toHaveLength(1);
                        (0, vitest_1.expect)((_a = media[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("/tmp/saved.pdf");
                        (0, vitest_1.expect)((_b = media[0]) === null || _b === void 0 ? void 0 : _b.placeholder).toBe("<media:document>");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("downloads inline image URLs from html attachments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_a.sent()).downloadMSTeamsAttachments;
                        fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Response(Buffer.from("png"), {
                                        status: 200,
                                        headers: { "content-type": "image/png" },
                                    })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [
                                    {
                                        contentType: "text/html",
                                        content: '<img src="https://x/inline.png" />',
                                    },
                                ],
                                maxBytes: 1024 * 1024,
                                allowHosts: ["x"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(media).toHaveLength(1);
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledWith("https://x/inline.png");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("stores inline data:image base64 payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, base64, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_a.sent()).downloadMSTeamsAttachments;
                        base64 = Buffer.from("png").toString("base64");
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [
                                    {
                                        contentType: "text/html",
                                        content: "<img src=\"data:image/png;base64,".concat(base64, "\" />"),
                                    },
                                ],
                                maxBytes: 1024 * 1024,
                                allowHosts: ["x"],
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(media).toHaveLength(1);
                        (0, vitest_1.expect)(saveMediaBufferMock).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("retries with auth when the first request is unauthorized", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_a.sent()).downloadMSTeamsAttachments;
                        fetchMock = vitest_1.vi.fn(function (_url, opts) { return __awaiter(void 0, void 0, void 0, function () {
                            var hasAuth;
                            var _a;
                            return __generator(this, function (_b) {
                                hasAuth = Boolean(opts &&
                                    typeof opts === "object" &&
                                    "headers" in opts &&
                                    ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Authorization));
                                if (!hasAuth) {
                                    return [2 /*return*/, new Response("unauthorized", { status: 401 })];
                                }
                                return [2 /*return*/, new Response(Buffer.from("png"), {
                                        status: 200,
                                        headers: { "content-type": "image/png" },
                                    })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [{ contentType: "image/png", contentUrl: "https://x/img" }],
                                maxBytes: 1024 * 1024,
                                tokenProvider: { getAccessToken: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, "token"];
                                    }); }); }) },
                                allowHosts: ["x"],
                                authAllowHosts: ["x"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalled();
                        (0, vitest_1.expect)(media).toHaveLength(1);
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("skips auth retries when the host is not in auth allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, tokenProvider, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_a.sent()).downloadMSTeamsAttachments;
                        tokenProvider = { getAccessToken: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, "token"];
                            }); }); }) };
                        fetchMock = vitest_1.vi.fn(function (_url, opts) { return __awaiter(void 0, void 0, void 0, function () {
                            var hasAuth;
                            var _a;
                            return __generator(this, function (_b) {
                                hasAuth = Boolean(opts &&
                                    typeof opts === "object" &&
                                    "headers" in opts &&
                                    ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Authorization));
                                if (!hasAuth) {
                                    return [2 /*return*/, new Response("forbidden", { status: 403 })];
                                }
                                return [2 /*return*/, new Response(Buffer.from("png"), {
                                        status: 200,
                                        headers: { "content-type": "image/png" },
                                    })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [
                                    { contentType: "image/png", contentUrl: "https://attacker.azureedge.net/img" },
                                ],
                                maxBytes: 1024 * 1024,
                                tokenProvider: tokenProvider,
                                allowHosts: ["azureedge.net"],
                                authAllowHosts: ["graph.microsoft.com"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(media).toHaveLength(0);
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledTimes(1);
                        (0, vitest_1.expect)(tokenProvider.getAccessToken).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("skips urls outside the allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsAttachments, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsAttachments = (_a.sent()).downloadMSTeamsAttachments;
                        fetchMock = vitest_1.vi.fn();
                        return [4 /*yield*/, downloadMSTeamsAttachments({
                                attachments: [{ contentType: "image/png", contentUrl: "https://evil.test/img" }],
                                maxBytes: 1024 * 1024,
                                allowHosts: ["graph.microsoft.com"],
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(media).toHaveLength(0);
                        (0, vitest_1.expect)(fetchMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("buildMSTeamsGraphMessageUrls", function () {
        (0, vitest_1.it)("builds channel message urls", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsGraphMessageUrls, urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsGraphMessageUrls = (_a.sent()).buildMSTeamsGraphMessageUrls;
                        urls = buildMSTeamsGraphMessageUrls({
                            conversationType: "channel",
                            conversationId: "19:thread@thread.tacv2",
                            messageId: "123",
                            channelData: { team: { id: "team-id" }, channel: { id: "chan-id" } },
                        });
                        (0, vitest_1.expect)(urls[0]).toContain("/teams/team-id/channels/chan-id/messages/123");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("builds channel reply urls when replyToId is present", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsGraphMessageUrls, urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsGraphMessageUrls = (_a.sent()).buildMSTeamsGraphMessageUrls;
                        urls = buildMSTeamsGraphMessageUrls({
                            conversationType: "channel",
                            messageId: "reply-id",
                            replyToId: "root-id",
                            channelData: { team: { id: "team-id" }, channel: { id: "chan-id" } },
                        });
                        (0, vitest_1.expect)(urls[0]).toContain("/teams/team-id/channels/chan-id/messages/root-id/replies/reply-id");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("builds chat message urls", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsGraphMessageUrls, urls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsGraphMessageUrls = (_a.sent()).buildMSTeamsGraphMessageUrls;
                        urls = buildMSTeamsGraphMessageUrls({
                            conversationType: "groupChat",
                            conversationId: "19:chat@thread.v2",
                            messageId: "456",
                        });
                        (0, vitest_1.expect)(urls[0]).toContain("/chats/19%3Achat%40thread.v2/messages/456");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("downloadMSTeamsGraphMedia", function () {
        (0, vitest_1.it)("downloads hostedContents images", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsGraphMedia, base64, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsGraphMedia = (_a.sent()).downloadMSTeamsGraphMedia;
                        base64 = Buffer.from("png").toString("base64");
                        fetchMock = vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (url.endsWith("/hostedContents")) {
                                    return [2 /*return*/, new Response(JSON.stringify({
                                            value: [
                                                {
                                                    id: "1",
                                                    contentType: "image/png",
                                                    contentBytes: base64,
                                                },
                                            ],
                                        }), { status: 200 })];
                                }
                                if (url.endsWith("/attachments")) {
                                    return [2 /*return*/, new Response(JSON.stringify({ value: [] }), { status: 200 })];
                                }
                                return [2 /*return*/, new Response("not found", { status: 404 })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsGraphMedia({
                                messageUrl: "https://graph.microsoft.com/v1.0/chats/19%3Achat/messages/123",
                                tokenProvider: { getAccessToken: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, "token"];
                                    }); }); }) },
                                maxBytes: 1024 * 1024,
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(media.media).toHaveLength(1);
                        (0, vitest_1.expect)(fetchMock).toHaveBeenCalled();
                        (0, vitest_1.expect)(saveMediaBufferMock).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("merges SharePoint reference attachments with hosted content", function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadMSTeamsGraphMedia, hostedBase64, shareUrl, fetchMock, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        downloadMSTeamsGraphMedia = (_a.sent()).downloadMSTeamsGraphMedia;
                        hostedBase64 = Buffer.from("png").toString("base64");
                        shareUrl = "https://contoso.sharepoint.com/site/file";
                        fetchMock = vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (url.endsWith("/hostedContents")) {
                                    return [2 /*return*/, new Response(JSON.stringify({
                                            value: [
                                                {
                                                    id: "hosted-1",
                                                    contentType: "image/png",
                                                    contentBytes: hostedBase64,
                                                },
                                            ],
                                        }), { status: 200 })];
                                }
                                if (url.endsWith("/attachments")) {
                                    return [2 /*return*/, new Response(JSON.stringify({
                                            value: [
                                                {
                                                    id: "ref-1",
                                                    contentType: "reference",
                                                    contentUrl: shareUrl,
                                                    name: "report.pdf",
                                                },
                                            ],
                                        }), { status: 200 })];
                                }
                                if (url.startsWith("https://graph.microsoft.com/v1.0/shares/")) {
                                    return [2 /*return*/, new Response(Buffer.from("pdf"), {
                                            status: 200,
                                            headers: { "content-type": "application/pdf" },
                                        })];
                                }
                                if (url.endsWith("/messages/123")) {
                                    return [2 /*return*/, new Response(JSON.stringify({
                                            attachments: [
                                                {
                                                    id: "ref-1",
                                                    contentType: "reference",
                                                    contentUrl: shareUrl,
                                                    name: "report.pdf",
                                                },
                                            ],
                                        }), { status: 200 })];
                                }
                                return [2 /*return*/, new Response("not found", { status: 404 })];
                            });
                        }); });
                        return [4 /*yield*/, downloadMSTeamsGraphMedia({
                                messageUrl: "https://graph.microsoft.com/v1.0/chats/19%3Achat/messages/123",
                                tokenProvider: { getAccessToken: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, "token"];
                                    }); }); }) },
                                maxBytes: 1024 * 1024,
                                fetchFn: fetchMock,
                            })];
                    case 2:
                        media = _a.sent();
                        (0, vitest_1.expect)(media.media).toHaveLength(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("buildMSTeamsMediaPayload", function () {
        (0, vitest_1.it)("returns single and multi-file fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            var buildMSTeamsMediaPayload, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load()];
                    case 1:
                        buildMSTeamsMediaPayload = (_a.sent()).buildMSTeamsMediaPayload;
                        payload = buildMSTeamsMediaPayload([
                            { path: "/tmp/a.png", contentType: "image/png" },
                            { path: "/tmp/b.png", contentType: "image/png" },
                        ]);
                        (0, vitest_1.expect)(payload.MediaPath).toBe("/tmp/a.png");
                        (0, vitest_1.expect)(payload.MediaUrl).toBe("/tmp/a.png");
                        (0, vitest_1.expect)(payload.MediaPaths).toEqual(["/tmp/a.png", "/tmp/b.png"]);
                        (0, vitest_1.expect)(payload.MediaUrls).toEqual(["/tmp/a.png", "/tmp/b.png"]);
                        (0, vitest_1.expect)(payload.MediaTypes).toEqual(["image/png", "image/png"]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
