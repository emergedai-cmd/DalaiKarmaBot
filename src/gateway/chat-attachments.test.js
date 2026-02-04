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
var chat_attachments_js_1 = require("./chat-attachments.js");
var PNG_1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/woAAn8B9FD5fHAAAAAASUVORK5CYII=";
(0, vitest_1.describe)("buildMessageWithAttachments", function () {
    (0, vitest_1.it)("embeds a single image as data URL", function () {
        var msg = (0, chat_attachments_js_1.buildMessageWithAttachments)("see this", [
            {
                type: "image",
                mimeType: "image/png",
                fileName: "dot.png",
                content: PNG_1x1,
            },
        ]);
        (0, vitest_1.expect)(msg).toContain("see this");
        (0, vitest_1.expect)(msg).toContain("data:image/png;base64,".concat(PNG_1x1));
        (0, vitest_1.expect)(msg).toContain("![dot.png]");
    });
    (0, vitest_1.it)("rejects non-image mime types", function () {
        var bad = {
            type: "file",
            mimeType: "application/pdf",
            fileName: "a.pdf",
            content: "AAA",
        };
        (0, vitest_1.expect)(function () { return (0, chat_attachments_js_1.buildMessageWithAttachments)("x", [bad]); }).toThrow(/image/);
    });
    (0, vitest_1.it)("rejects invalid base64 content", function () {
        var bad = {
            type: "image",
            mimeType: "image/png",
            fileName: "dot.png",
            content: "%not-base64%",
        };
        (0, vitest_1.expect)(function () { return (0, chat_attachments_js_1.buildMessageWithAttachments)("x", [bad]); }).toThrow(/base64/);
    });
    (0, vitest_1.it)("rejects images over limit", function () {
        var big = Buffer.alloc(6000000, 0).toString("base64");
        var att = {
            type: "image",
            mimeType: "image/png",
            fileName: "big.png",
            content: big,
        };
        (0, vitest_1.expect)(function () { return (0, chat_attachments_js_1.buildMessageWithAttachments)("x", [att], { maxBytes: 5000000 }); }).toThrow(/exceeds size limit/i);
    });
});
(0, vitest_1.describe)("parseMessageWithAttachments", function () {
    (0, vitest_1.it)("strips data URL prefix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)("see this", [
                        {
                            type: "image",
                            mimeType: "image/png",
                            fileName: "dot.png",
                            content: "data:image/png;base64,".concat(PNG_1x1),
                        },
                    ], { log: { warn: function () { } } })];
                case 1:
                    parsed = _c.sent();
                    (0, vitest_1.expect)(parsed.images).toHaveLength(1);
                    (0, vitest_1.expect)((_a = parsed.images[0]) === null || _a === void 0 ? void 0 : _a.mimeType).toBe("image/png");
                    (0, vitest_1.expect)((_b = parsed.images[0]) === null || _b === void 0 ? void 0 : _b.data).toBe(PNG_1x1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects invalid base64 content", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, chat_attachments_js_1.parseMessageWithAttachments)("x", [
                        {
                            type: "image",
                            mimeType: "image/png",
                            fileName: "dot.png",
                            content: "%not-base64%",
                        },
                    ], { log: { warn: function () { } } })).rejects.toThrow(/base64/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects images over limit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var big;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    big = Buffer.alloc(6000000, 0).toString("base64");
                    return [4 /*yield*/, (0, vitest_1.expect)((0, chat_attachments_js_1.parseMessageWithAttachments)("x", [
                            {
                                type: "image",
                                mimeType: "image/png",
                                fileName: "big.png",
                                content: big,
                            },
                        ], { maxBytes: 5000000, log: { warn: function () { } } })).rejects.toThrow(/exceeds size limit/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sniffs mime when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs, parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logs = [];
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)("see this", [
                            {
                                type: "image",
                                fileName: "dot.png",
                                content: PNG_1x1,
                            },
                        ], { log: { warn: function (message) { return logs.push(message); } } })];
                case 1:
                    parsed = _c.sent();
                    (0, vitest_1.expect)(parsed.message).toBe("see this");
                    (0, vitest_1.expect)(parsed.images).toHaveLength(1);
                    (0, vitest_1.expect)((_a = parsed.images[0]) === null || _a === void 0 ? void 0 : _a.mimeType).toBe("image/png");
                    (0, vitest_1.expect)((_b = parsed.images[0]) === null || _b === void 0 ? void 0 : _b.data).toBe(PNG_1x1);
                    (0, vitest_1.expect)(logs).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops non-image payloads and logs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs, pdf, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logs = [];
                    pdf = Buffer.from("%PDF-1.4\n").toString("base64");
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)("x", [
                            {
                                type: "file",
                                mimeType: "image/png",
                                fileName: "not-image.pdf",
                                content: pdf,
                            },
                        ], { log: { warn: function (message) { return logs.push(message); } } })];
                case 1:
                    parsed = _a.sent();
                    (0, vitest_1.expect)(parsed.images).toHaveLength(0);
                    (0, vitest_1.expect)(logs).toHaveLength(1);
                    (0, vitest_1.expect)(logs[0]).toMatch(/non-image/i);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers sniffed mime type and logs mismatch", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs, parsed;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logs = [];
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)("x", [
                            {
                                type: "image",
                                mimeType: "image/jpeg",
                                fileName: "dot.png",
                                content: PNG_1x1,
                            },
                        ], { log: { warn: function (message) { return logs.push(message); } } })];
                case 1:
                    parsed = _b.sent();
                    (0, vitest_1.expect)(parsed.images).toHaveLength(1);
                    (0, vitest_1.expect)((_a = parsed.images[0]) === null || _a === void 0 ? void 0 : _a.mimeType).toBe("image/png");
                    (0, vitest_1.expect)(logs).toHaveLength(1);
                    (0, vitest_1.expect)(logs[0]).toMatch(/mime mismatch/i);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops unknown mime when sniff fails and logs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs, unknown, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logs = [];
                    unknown = Buffer.from("not an image").toString("base64");
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)("x", [{ type: "file", fileName: "unknown.bin", content: unknown }], { log: { warn: function (message) { return logs.push(message); } } })];
                case 1:
                    parsed = _a.sent();
                    (0, vitest_1.expect)(parsed.images).toHaveLength(0);
                    (0, vitest_1.expect)(logs).toHaveLength(1);
                    (0, vitest_1.expect)(logs[0]).toMatch(/unable to detect image mime type/i);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps valid images and drops invalid ones", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logs, pdf, parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logs = [];
                    pdf = Buffer.from("%PDF-1.4\n").toString("base64");
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)("x", [
                            {
                                type: "image",
                                mimeType: "image/png",
                                fileName: "dot.png",
                                content: PNG_1x1,
                            },
                            {
                                type: "file",
                                mimeType: "image/png",
                                fileName: "not-image.pdf",
                                content: pdf,
                            },
                        ], { log: { warn: function (message) { return logs.push(message); } } })];
                case 1:
                    parsed = _c.sent();
                    (0, vitest_1.expect)(parsed.images).toHaveLength(1);
                    (0, vitest_1.expect)((_a = parsed.images[0]) === null || _a === void 0 ? void 0 : _a.mimeType).toBe("image/png");
                    (0, vitest_1.expect)((_b = parsed.images[0]) === null || _b === void 0 ? void 0 : _b.data).toBe(PNG_1x1);
                    (0, vitest_1.expect)(logs.some(function (l) { return /non-image/i.test(l); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
