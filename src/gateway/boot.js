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
exports.runBootOnce = runBootOnce;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var tokens_js_1 = require("../auto-reply/tokens.js");
var agent_js_1 = require("../commands/agent.js");
var main_session_js_1 = require("../config/sessions/main-session.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var runtime_js_1 = require("../runtime.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("gateway/boot");
var BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
    return [
        "You are running a boot check. Follow BOOT.md instructions exactly.",
        "",
        "BOOT.md:",
        content,
        "",
        "If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
        "Use the `target` field (not `to`) for message tool destinations.",
        "After sending with the message tool, reply with ONLY: ".concat(tokens_js_1.SILENT_REPLY_TOKEN, "."),
        "If nothing needs attention, reply with ONLY: ".concat(tokens_js_1.SILENT_REPLY_TOKEN, "."),
    ].join("\n");
}
function loadBootFile(workspaceDir) {
    return __awaiter(this, void 0, void 0, function () {
        var bootPath, content, trimmed, err_1, anyErr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bootPath = node_path_1.default.join(workspaceDir, BOOT_FILENAME);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(bootPath, "utf-8")];
                case 2:
                    content = _a.sent();
                    trimmed = content.trim();
                    if (!trimmed) {
                        return [2 /*return*/, { status: "empty" }];
                    }
                    return [2 /*return*/, { status: "ok", content: trimmed }];
                case 3:
                    err_1 = _a.sent();
                    anyErr = err_1;
                    if (anyErr.code === "ENOENT") {
                        return [2 /*return*/, { status: "missing" }];
                    }
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function runBootOnce(params) {
    return __awaiter(this, void 0, void 0, function () {
        var bootRuntime, result, err_2, message_1, sessionKey, message, err_3, messageText;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    bootRuntime = {
                        log: function () { },
                        error: function (message) { return log.error(String(message)); },
                        exit: runtime_js_1.defaultRuntime.exit,
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadBootFile(params.workspaceDir)];
                case 2:
                    result = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    message_1 = err_2 instanceof Error ? err_2.message : String(err_2);
                    log.error("boot: failed to read ".concat(BOOT_FILENAME, ": ").concat(message_1));
                    return [2 /*return*/, { status: "failed", reason: message_1 }];
                case 4:
                    if (result.status === "missing" || result.status === "empty") {
                        return [2 /*return*/, { status: "skipped", reason: result.status }];
                    }
                    sessionKey = (0, main_session_js_1.resolveMainSessionKey)(params.cfg);
                    message = buildBootPrompt((_a = result.content) !== null && _a !== void 0 ? _a : "");
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                            message: message,
                            sessionKey: sessionKey,
                            deliver: false,
                        }, bootRuntime, params.deps)];
                case 6:
                    _b.sent();
                    return [2 /*return*/, { status: "ran" }];
                case 7:
                    err_3 = _b.sent();
                    messageText = err_3 instanceof Error ? err_3.message : String(err_3);
                    log.error("boot: agent run failed: ".concat(messageText));
                    return [2 /*return*/, { status: "failed", reason: messageText }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
