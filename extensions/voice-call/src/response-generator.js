"use strict";
/**
 * Voice call response generator - uses the embedded Pi agent for tool support.
 * Routes voice responses through the same agent infrastructure as messaging.
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
exports.generateVoiceResponse = generateVoiceResponse;
var node_crypto_1 = require("node:crypto");
var core_bridge_js_1 = require("./core-bridge.js");
/**
 * Generate a voice response using the embedded Pi agent with full tool support.
 * Uses the same agent infrastructure as messaging for consistent behavior.
 */
function generateVoiceResponse(params) {
    return __awaiter(this, void 0, void 0, function () {
        var voiceConfig, callId, from, transcript, userMessage, coreConfig, deps, err_1, cfg, normalizedPhone, sessionKey, agentId, storePath, agentDir, workspaceDir, sessionStore, now, sessionEntry, sessionId, sessionFile, modelRef, slashIndex, provider, model, thinkLevel, identity, agentName, basePrompt, extraSystemPrompt, history_1, timeoutMs, runId, result, texts, text, err_2;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    voiceConfig = params.voiceConfig, callId = params.callId, from = params.from, transcript = params.transcript, userMessage = params.userMessage, coreConfig = params.coreConfig;
                    if (!coreConfig) {
                        return [2 /*return*/, { text: null, error: "Core config unavailable for voice response" }];
                    }
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, core_bridge_js_1.loadCoreAgentDeps)()];
                case 2:
                    deps = _f.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _f.sent();
                    return [2 /*return*/, {
                            text: null,
                            error: err_1 instanceof Error ? err_1.message : "Unable to load core agent dependencies",
                        }];
                case 4:
                    cfg = coreConfig;
                    normalizedPhone = from.replace(/\D/g, "");
                    sessionKey = "voice:".concat(normalizedPhone);
                    agentId = "main";
                    storePath = deps.resolveStorePath((_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store, { agentId: agentId });
                    agentDir = deps.resolveAgentDir(cfg, agentId);
                    workspaceDir = deps.resolveAgentWorkspaceDir(cfg, agentId);
                    // Ensure workspace exists
                    return [4 /*yield*/, deps.ensureAgentWorkspace({ dir: workspaceDir })];
                case 5:
                    // Ensure workspace exists
                    _f.sent();
                    sessionStore = deps.loadSessionStore(storePath);
                    now = Date.now();
                    sessionEntry = sessionStore[sessionKey];
                    if (!!sessionEntry) return [3 /*break*/, 7];
                    sessionEntry = {
                        sessionId: node_crypto_1.default.randomUUID(),
                        updatedAt: now,
                    };
                    sessionStore[sessionKey] = sessionEntry;
                    return [4 /*yield*/, deps.saveSessionStore(storePath, sessionStore)];
                case 6:
                    _f.sent();
                    _f.label = 7;
                case 7:
                    sessionId = sessionEntry.sessionId;
                    sessionFile = deps.resolveSessionFilePath(sessionId, sessionEntry, {
                        agentId: agentId,
                    });
                    modelRef = voiceConfig.responseModel || "".concat(deps.DEFAULT_PROVIDER, "/").concat(deps.DEFAULT_MODEL);
                    slashIndex = modelRef.indexOf("/");
                    provider = slashIndex === -1 ? deps.DEFAULT_PROVIDER : modelRef.slice(0, slashIndex);
                    model = slashIndex === -1 ? modelRef : modelRef.slice(slashIndex + 1);
                    thinkLevel = deps.resolveThinkingDefault({ cfg: cfg, provider: provider, model: model });
                    identity = deps.resolveAgentIdentity(cfg, agentId);
                    agentName = ((_b = identity === null || identity === void 0 ? void 0 : identity.name) === null || _b === void 0 ? void 0 : _b.trim()) || "assistant";
                    basePrompt = (_c = voiceConfig.responseSystemPrompt) !== null && _c !== void 0 ? _c : "You are ".concat(agentName, ", a helpful voice assistant on a phone call. Keep responses brief and conversational (1-2 sentences max). Be natural and friendly. The caller's phone number is ").concat(from, ". You have access to tools - use them when helpful.");
                    extraSystemPrompt = basePrompt;
                    if (transcript.length > 0) {
                        history_1 = transcript
                            .map(function (entry) { return "".concat(entry.speaker === "bot" ? "You" : "Caller", ": ").concat(entry.text); })
                            .join("\n");
                        extraSystemPrompt = "".concat(basePrompt, "\n\nConversation so far:\n").concat(history_1);
                    }
                    timeoutMs = (_d = voiceConfig.responseTimeoutMs) !== null && _d !== void 0 ? _d : deps.resolveAgentTimeoutMs({ cfg: cfg });
                    runId = "voice:".concat(callId, ":").concat(Date.now());
                    _f.label = 8;
                case 8:
                    _f.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, deps.runEmbeddedPiAgent({
                            sessionId: sessionId,
                            sessionKey: sessionKey,
                            messageProvider: "voice",
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            config: cfg,
                            prompt: userMessage,
                            provider: provider,
                            model: model,
                            thinkLevel: thinkLevel,
                            verboseLevel: "off",
                            timeoutMs: timeoutMs,
                            runId: runId,
                            lane: "voice",
                            extraSystemPrompt: extraSystemPrompt,
                            agentDir: agentDir,
                        })];
                case 9:
                    result = _f.sent();
                    texts = ((_e = result.payloads) !== null && _e !== void 0 ? _e : [])
                        .filter(function (p) { return p.text && !p.isError; })
                        .map(function (p) { var _a; return (_a = p.text) === null || _a === void 0 ? void 0 : _a.trim(); })
                        .filter(Boolean);
                    text = texts.join(" ") || null;
                    if (!text && result.meta.aborted) {
                        return [2 /*return*/, { text: null, error: "Response generation was aborted" }];
                    }
                    return [2 /*return*/, { text: text }];
                case 10:
                    err_2 = _f.sent();
                    console.error("[voice-call] Response generation failed:", err_2);
                    return [2 /*return*/, { text: null, error: String(err_2) }];
                case 11: return [2 /*return*/];
            }
        });
    });
}
