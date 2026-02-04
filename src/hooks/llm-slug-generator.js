"use strict";
/**
 * LLM-based slug generator for session memory filenames
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
exports.generateSlugViaLLM = generateSlugViaLLM;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
/**
 * Generate a short 1-2 word filename slug from session content using LLM
 */
function generateSlugViaLLM(params) {
    return __awaiter(this, void 0, void 0, function () {
        var tempSessionFile, agentId, workspaceDir, agentDir, tempDir, prompt_1, result, text, slug, err_1, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tempSessionFile = null;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 10]);
                    agentId = (0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg);
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, agentId);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(params.cfg, agentId);
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-slug-"))];
                case 2:
                    tempDir = _c.sent();
                    tempSessionFile = node_path_1.default.join(tempDir, "session.jsonl");
                    prompt_1 = "Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).\n\nConversation summary:\n".concat(params.sessionContent.slice(0, 2000), "\n\nReply with ONLY the slug, nothing else. Examples: \"vendor-pitch\", \"api-design\", \"bug-fix\"");
                    return [4 /*yield*/, (0, pi_embedded_js_1.runEmbeddedPiAgent)({
                            sessionId: "slug-generator-".concat(Date.now()),
                            sessionKey: "temp:slug-generator",
                            sessionFile: tempSessionFile,
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: params.cfg,
                            prompt: prompt_1,
                            timeoutMs: 15000, // 15 second timeout
                            runId: "slug-gen-".concat(Date.now()),
                        })];
                case 3:
                    result = _c.sent();
                    // Extract text from payloads
                    if (result.payloads && result.payloads.length > 0) {
                        text = (_b = result.payloads[0]) === null || _b === void 0 ? void 0 : _b.text;
                        if (text) {
                            slug = text
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "-")
                                .replace(/-+/g, "-")
                                .replace(/^-|-$/g, "")
                                .slice(0, 30);
                            return [2 /*return*/, slug || null];
                        }
                    }
                    return [2 /*return*/, null];
                case 4:
                    err_1 = _c.sent();
                    console.error("[llm-slug-generator] Failed to generate slug:", err_1);
                    return [2 /*return*/, null];
                case 5:
                    if (!tempSessionFile) return [3 /*break*/, 9];
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.rm(node_path_1.default.dirname(tempSessionFile), { recursive: true, force: true })];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _a = _c.sent();
                    return [3 /*break*/, 9];
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
