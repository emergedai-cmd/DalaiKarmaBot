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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var transcript_js_1 = require("./transcript.js");
(0, vitest_1.describe)("resolveMirroredTranscriptText", function () {
    (0, vitest_1.it)("prefers media filenames over text", function () {
        var result = (0, transcript_js_1.resolveMirroredTranscriptText)({
            text: "caption here",
            mediaUrls: ["https://example.com/files/report.pdf?sig=123"],
        });
        (0, vitest_1.expect)(result).toBe("report.pdf");
    });
    (0, vitest_1.it)("returns trimmed text when no media", function () {
        var result = (0, transcript_js_1.resolveMirroredTranscriptText)({ text: "  hello  " });
        (0, vitest_1.expect)(result).toBe("hello");
    });
});
(0, vitest_1.describe)("appendAssistantMessageToSessionTranscript", function () {
    var tempDir;
    var storePath;
    var sessionsDir;
    (0, vitest_1.beforeEach)(function () {
        tempDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "transcript-test-"));
        sessionsDir = node_path_1.default.join(tempDir, "agents", "main", "sessions");
        node_fs_1.default.mkdirSync(sessionsDir, { recursive: true });
        storePath = node_path_1.default.join(sessionsDir, "sessions.json");
    });
    (0, vitest_1.afterEach)(function () {
        node_fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("returns error for missing sessionKey", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transcript_js_1.appendAssistantMessageToSessionTranscript)({
                        sessionKey: "",
                        text: "test",
                        storePath: storePath,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    if (!result.ok) {
                        (0, vitest_1.expect)(result.reason).toBe("missing sessionKey");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error for empty text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transcript_js_1.appendAssistantMessageToSessionTranscript)({
                        sessionKey: "test-session",
                        text: "   ",
                        storePath: storePath,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    if (!result.ok) {
                        (0, vitest_1.expect)(result.reason).toBe("empty text");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error for unknown sessionKey", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node_fs_1.default.writeFileSync(storePath, JSON.stringify({}), "utf-8");
                    return [4 /*yield*/, (0, transcript_js_1.appendAssistantMessageToSessionTranscript)({
                            sessionKey: "nonexistent",
                            text: "test message",
                            storePath: storePath,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.ok).toBe(false);
                    if (!result.ok) {
                        (0, vitest_1.expect)(result.reason).toContain("unknown sessionKey");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("creates transcript file and appends message for valid session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, sessionKey, store, result, lines, header, messageLine;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sessionId = "test-session-id";
                    sessionKey = "test-session";
                    store = (_a = {},
                        _a[sessionKey] = {
                            sessionId: sessionId,
                            chatType: "direct",
                            channel: "discord",
                        },
                        _a);
                    node_fs_1.default.writeFileSync(storePath, JSON.stringify(store), "utf-8");
                    return [4 /*yield*/, (0, transcript_js_1.appendAssistantMessageToSessionTranscript)({
                            sessionKey: sessionKey,
                            text: "Hello from delivery mirror!",
                            storePath: storePath,
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    if (result.ok) {
                        (0, vitest_1.expect)(node_fs_1.default.existsSync(result.sessionFile)).toBe(true);
                        lines = node_fs_1.default.readFileSync(result.sessionFile, "utf-8").trim().split("\n");
                        (0, vitest_1.expect)(lines.length).toBe(2); // header + message
                        header = JSON.parse(lines[0]);
                        (0, vitest_1.expect)(header.type).toBe("session");
                        (0, vitest_1.expect)(header.id).toBe(sessionId);
                        messageLine = JSON.parse(lines[1]);
                        (0, vitest_1.expect)(messageLine.type).toBe("message");
                        (0, vitest_1.expect)(messageLine.message.role).toBe("assistant");
                        (0, vitest_1.expect)(messageLine.message.content[0].type).toBe("text");
                        (0, vitest_1.expect)(messageLine.message.content[0].text).toBe("Hello from delivery mirror!");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
