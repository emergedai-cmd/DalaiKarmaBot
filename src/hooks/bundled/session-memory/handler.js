"use strict";
/**
 * Session memory hook handler
 *
 * Saves session context to memory when /new command is triggered
 * Creates a new dated memory file with LLM-generated slug
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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var agent_scope_js_1 = require("../../../agents/agent-scope.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var config_js_1 = require("../../config.js");
/**
 * Read recent messages from session file for slug generation
 */
function getRecentSessionContent(sessionFilePath_1) {
    return __awaiter(this, arguments, void 0, function (sessionFilePath, messageCount) {
        var content, lines, allMessages, _i, lines_1, line, entry, msg, role, text, recentMessages, _a;
        var _b;
        if (messageCount === void 0) { messageCount = 15; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(sessionFilePath, "utf-8")];
                case 1:
                    content = _c.sent();
                    lines = content.trim().split("\n");
                    allMessages = [];
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        try {
                            entry = JSON.parse(line);
                            // Session files have entries with type="message" containing a nested message object
                            if (entry.type === "message" && entry.message) {
                                msg = entry.message;
                                role = msg.role;
                                if ((role === "user" || role === "assistant") && msg.content) {
                                    text = Array.isArray(msg.content)
                                        ? // oxlint-disable-next-line typescript/no-explicit-any
                                            (_b = msg.content.find(function (c) { return c.type === "text"; })) === null || _b === void 0 ? void 0 : _b.text
                                        : msg.content;
                                    if (text && !text.startsWith("/")) {
                                        allMessages.push("".concat(role, ": ").concat(text));
                                    }
                                }
                            }
                        }
                        catch (_d) {
                            // Skip invalid JSON lines
                        }
                    }
                    recentMessages = allMessages.slice(-messageCount);
                    return [2 /*return*/, recentMessages.join("\n")];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Save session context to memory when /new command is triggered
 */
var saveSessionToMemory = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var context, cfg, agentId, workspaceDir, memoryDir, now, dateStr, sessionEntry, currentSessionId, currentSessionFile, sessionFile, hookConfig, messageCount, slug, sessionContent, openclawRoot, slugGenPath, generateSlugViaLLM, timeSlug, filename, memoryFilePath, timeStr, sessionId, source, entryParts, entry, relPath, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Only trigger on 'new' command
                if (event.type !== "command" || event.action !== "new") {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                console.log("[session-memory] Hook triggered for /new command");
                context = event.context || {};
                cfg = context.cfg;
                agentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)(event.sessionKey);
                workspaceDir = cfg
                    ? (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId)
                    : node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "workspace");
                memoryDir = node_path_1.default.join(workspaceDir, "memory");
                return [4 /*yield*/, promises_1.default.mkdir(memoryDir, { recursive: true })];
            case 2:
                _a.sent();
                now = new Date(event.timestamp);
                dateStr = now.toISOString().split("T")[0];
                sessionEntry = (context.previousSessionEntry || context.sessionEntry || {});
                currentSessionId = sessionEntry.sessionId;
                currentSessionFile = sessionEntry.sessionFile;
                console.log("[session-memory] Current sessionId:", currentSessionId);
                console.log("[session-memory] Current sessionFile:", currentSessionFile);
                console.log("[session-memory] cfg present:", !!cfg);
                sessionFile = currentSessionFile || undefined;
                hookConfig = (0, config_js_1.resolveHookConfig)(cfg, "session-memory");
                messageCount = typeof (hookConfig === null || hookConfig === void 0 ? void 0 : hookConfig.messages) === "number" && hookConfig.messages > 0
                    ? hookConfig.messages
                    : 15;
                slug = null;
                sessionContent = null;
                if (!sessionFile) return [3 /*break*/, 6];
                return [4 /*yield*/, getRecentSessionContent(sessionFile, messageCount)];
            case 3:
                // Get recent conversation content
                sessionContent = _a.sent();
                console.log("[session-memory] sessionContent length:", (sessionContent === null || sessionContent === void 0 ? void 0 : sessionContent.length) || 0);
                if (!(sessionContent && cfg)) return [3 /*break*/, 6];
                console.log("[session-memory] Calling generateSlugViaLLM...");
                openclawRoot = node_path_1.default.resolve(node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url)), "../..");
                slugGenPath = node_path_1.default.join(openclawRoot, "llm-slug-generator.js");
                return [4 /*yield*/, Promise.resolve("".concat(slugGenPath)).then(function (s) { return require(s); })];
            case 4:
                generateSlugViaLLM = (_a.sent()).generateSlugViaLLM;
                return [4 /*yield*/, generateSlugViaLLM({ sessionContent: sessionContent, cfg: cfg })];
            case 5:
                // Use LLM to generate a descriptive slug
                slug = _a.sent();
                console.log("[session-memory] Generated slug:", slug);
                _a.label = 6;
            case 6:
                // If no slug, use timestamp
                if (!slug) {
                    timeSlug = now.toISOString().split("T")[1].split(".")[0].replace(/:/g, "");
                    slug = timeSlug.slice(0, 4); // HHMM
                    console.log("[session-memory] Using fallback timestamp slug:", slug);
                }
                filename = "".concat(dateStr, "-").concat(slug, ".md");
                memoryFilePath = node_path_1.default.join(memoryDir, filename);
                console.log("[session-memory] Generated filename:", filename);
                console.log("[session-memory] Full path:", memoryFilePath);
                timeStr = now.toISOString().split("T")[1].split(".")[0];
                sessionId = sessionEntry.sessionId || "unknown";
                source = context.commandSource || "unknown";
                entryParts = [
                    "# Session: ".concat(dateStr, " ").concat(timeStr, " UTC"),
                    "",
                    "- **Session Key**: ".concat(event.sessionKey),
                    "- **Session ID**: ".concat(sessionId),
                    "- **Source**: ".concat(source),
                    "",
                ];
                // Include conversation content if available
                if (sessionContent) {
                    entryParts.push("## Conversation Summary", "", sessionContent, "");
                }
                entry = entryParts.join("\n");
                // Write to new memory file
                return [4 /*yield*/, promises_1.default.writeFile(memoryFilePath, entry, "utf-8")];
            case 7:
                // Write to new memory file
                _a.sent();
                console.log("[session-memory] Memory file written successfully");
                relPath = memoryFilePath.replace(node_os_1.default.homedir(), "~");
                console.log("[session-memory] Session context saved to ".concat(relPath));
                return [3 /*break*/, 9];
            case 8:
                err_1 = _a.sent();
                console.error("[session-memory] Failed to save session memory:", err_1 instanceof Error ? err_1.message : String(err_1));
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.default = saveSessionToMemory;
