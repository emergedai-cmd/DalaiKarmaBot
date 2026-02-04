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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testing = void 0;
exports.default = compactionSafeguardExtension;
var compaction_js_1 = require("../compaction.js");
var compaction_safeguard_runtime_js_1 = require("./compaction-safeguard-runtime.js");
var FALLBACK_SUMMARY = "Summary unavailable due to context limits. Older messages were truncated.";
var TURN_PREFIX_INSTRUCTIONS = "This summary covers the prefix of a split turn. Focus on the original request," +
    " early progress, and any details needed to understand the retained suffix.";
var MAX_TOOL_FAILURES = 8;
var MAX_TOOL_FAILURE_CHARS = 240;
function normalizeFailureText(text) {
    return text.replace(/\s+/g, " ").trim();
}
function truncateFailureText(text, maxChars) {
    if (text.length <= maxChars) {
        return text;
    }
    return "".concat(text.slice(0, Math.max(0, maxChars - 3)), "...");
}
function formatToolFailureMeta(details) {
    if (!details || typeof details !== "object") {
        return undefined;
    }
    var record = details;
    var status = typeof record.status === "string" ? record.status : undefined;
    var exitCode = typeof record.exitCode === "number" && Number.isFinite(record.exitCode)
        ? record.exitCode
        : undefined;
    var parts = [];
    if (status) {
        parts.push("status=".concat(status));
    }
    if (exitCode !== undefined) {
        parts.push("exitCode=".concat(exitCode));
    }
    return parts.length > 0 ? parts.join(" ") : undefined;
}
function extractToolResultText(content) {
    if (!Array.isArray(content)) {
        return "";
    }
    var parts = [];
    for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
        var block = content_1[_i];
        if (!block || typeof block !== "object") {
            continue;
        }
        var rec = block;
        if (rec.type === "text" && typeof rec.text === "string") {
            parts.push(rec.text);
        }
    }
    return parts.join("\n");
}
function collectToolFailures(messages) {
    var failures = [];
    var seen = new Set();
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        if (!message || typeof message !== "object") {
            continue;
        }
        var role = message.role;
        if (role !== "toolResult") {
            continue;
        }
        var toolResult = message;
        if (toolResult.isError !== true) {
            continue;
        }
        var toolCallId = typeof toolResult.toolCallId === "string" ? toolResult.toolCallId : "";
        if (!toolCallId || seen.has(toolCallId)) {
            continue;
        }
        seen.add(toolCallId);
        var toolName = typeof toolResult.toolName === "string" && toolResult.toolName.trim()
            ? toolResult.toolName
            : "tool";
        var rawText = extractToolResultText(toolResult.content);
        var meta = formatToolFailureMeta(toolResult.details);
        var normalized = normalizeFailureText(rawText);
        var summary = truncateFailureText(normalized || (meta ? "failed" : "failed (no output)"), MAX_TOOL_FAILURE_CHARS);
        failures.push({ toolCallId: toolCallId, toolName: toolName, summary: summary, meta: meta });
    }
    return failures;
}
function formatToolFailuresSection(failures) {
    if (failures.length === 0) {
        return "";
    }
    var lines = failures.slice(0, MAX_TOOL_FAILURES).map(function (failure) {
        var meta = failure.meta ? " (".concat(failure.meta, ")") : "";
        return "- ".concat(failure.toolName).concat(meta, ": ").concat(failure.summary);
    });
    if (failures.length > MAX_TOOL_FAILURES) {
        lines.push("- ...and ".concat(failures.length - MAX_TOOL_FAILURES, " more"));
    }
    return "\n\n## Tool Failures\n".concat(lines.join("\n"));
}
function computeFileLists(fileOps) {
    var modified = new Set(__spreadArray(__spreadArray([], fileOps.edited, true), fileOps.written, true));
    var readFiles = __spreadArray([], fileOps.read, true).filter(function (f) { return !modified.has(f); }).toSorted();
    var modifiedFiles = __spreadArray([], modified, true).toSorted();
    return { readFiles: readFiles, modifiedFiles: modifiedFiles };
}
function formatFileOperations(readFiles, modifiedFiles) {
    var sections = [];
    if (readFiles.length > 0) {
        sections.push("<read-files>\n".concat(readFiles.join("\n"), "\n</read-files>"));
    }
    if (modifiedFiles.length > 0) {
        sections.push("<modified-files>\n".concat(modifiedFiles.join("\n"), "\n</modified-files>"));
    }
    if (sections.length === 0) {
        return "";
    }
    return "\n\n".concat(sections.join("\n\n"));
}
function compactionSafeguardExtension(api) {
    var _this = this;
    api.on("session_before_compact", function (event, ctx) { return __awaiter(_this, void 0, void 0, function () {
        var preparation, customInstructions, signal, _a, readFiles, modifiedFiles, fileOpsSummary, toolFailures, toolFailureSection, fallbackSummary, model, apiKey, runtime, modelContextWindow, contextWindowTokens, turnPrefixMessages, messagesToSummarize, maxHistoryShare, tokensBefore, droppedSummary, summarizableTokens, newContentTokens, maxHistoryTokens, pruned, newContentRatio, droppedChunkRatio, droppedMaxChunkTokens, droppedError_1, allMessages, adaptiveRatio, maxChunkTokens, reserveTokens, effectivePreviousSummary, historySummary, summary, prefixSummary, error_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    preparation = event.preparation, customInstructions = event.customInstructions, signal = event.signal;
                    _a = computeFileLists(preparation.fileOps), readFiles = _a.readFiles, modifiedFiles = _a.modifiedFiles;
                    fileOpsSummary = formatFileOperations(readFiles, modifiedFiles);
                    toolFailures = collectToolFailures(__spreadArray(__spreadArray([], preparation.messagesToSummarize, true), preparation.turnPrefixMessages, true));
                    toolFailureSection = formatToolFailuresSection(toolFailures);
                    fallbackSummary = "".concat(FALLBACK_SUMMARY).concat(toolFailureSection).concat(fileOpsSummary);
                    model = ctx.model;
                    if (!model) {
                        return [2 /*return*/, {
                                compaction: {
                                    summary: fallbackSummary,
                                    firstKeptEntryId: preparation.firstKeptEntryId,
                                    tokensBefore: preparation.tokensBefore,
                                    details: { readFiles: readFiles, modifiedFiles: modifiedFiles },
                                },
                            }];
                    }
                    return [4 /*yield*/, ctx.modelRegistry.getApiKey(model)];
                case 1:
                    apiKey = _e.sent();
                    if (!apiKey) {
                        return [2 /*return*/, {
                                compaction: {
                                    summary: fallbackSummary,
                                    firstKeptEntryId: preparation.firstKeptEntryId,
                                    tokensBefore: preparation.tokensBefore,
                                    details: { readFiles: readFiles, modifiedFiles: modifiedFiles },
                                },
                            }];
                    }
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 10, , 11]);
                    runtime = (0, compaction_safeguard_runtime_js_1.getCompactionSafeguardRuntime)(ctx.sessionManager);
                    modelContextWindow = (0, compaction_js_1.resolveContextWindowTokens)(model);
                    contextWindowTokens = (_b = runtime === null || runtime === void 0 ? void 0 : runtime.contextWindowTokens) !== null && _b !== void 0 ? _b : modelContextWindow;
                    turnPrefixMessages = (_c = preparation.turnPrefixMessages) !== null && _c !== void 0 ? _c : [];
                    messagesToSummarize = preparation.messagesToSummarize;
                    maxHistoryShare = (_d = runtime === null || runtime === void 0 ? void 0 : runtime.maxHistoryShare) !== null && _d !== void 0 ? _d : 0.5;
                    tokensBefore = typeof preparation.tokensBefore === "number" && Number.isFinite(preparation.tokensBefore)
                        ? preparation.tokensBefore
                        : undefined;
                    droppedSummary = void 0;
                    if (!(tokensBefore !== undefined)) return [3 /*break*/, 6];
                    summarizableTokens = (0, compaction_js_1.estimateMessagesTokens)(messagesToSummarize) + (0, compaction_js_1.estimateMessagesTokens)(turnPrefixMessages);
                    newContentTokens = Math.max(0, Math.floor(tokensBefore - summarizableTokens));
                    maxHistoryTokens = Math.floor(contextWindowTokens * maxHistoryShare * compaction_js_1.SAFETY_MARGIN);
                    if (!(newContentTokens > maxHistoryTokens)) return [3 /*break*/, 6];
                    pruned = (0, compaction_js_1.pruneHistoryForContextShare)({
                        messages: messagesToSummarize,
                        maxContextTokens: contextWindowTokens,
                        maxHistoryShare: maxHistoryShare,
                        parts: 2,
                    });
                    if (!(pruned.droppedChunks > 0)) return [3 /*break*/, 6];
                    newContentRatio = (newContentTokens / contextWindowTokens) * 100;
                    console.warn("Compaction safeguard: new content uses ".concat(newContentRatio.toFixed(1), "% of context; dropped ").concat(pruned.droppedChunks, " older chunk(s) ") +
                        "(".concat(pruned.droppedMessages, " messages) to fit history budget."));
                    messagesToSummarize = pruned.messages;
                    if (!(pruned.droppedMessagesList.length > 0)) return [3 /*break*/, 6];
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 5, , 6]);
                    droppedChunkRatio = (0, compaction_js_1.computeAdaptiveChunkRatio)(pruned.droppedMessagesList, contextWindowTokens);
                    droppedMaxChunkTokens = Math.max(1, Math.floor(contextWindowTokens * droppedChunkRatio));
                    return [4 /*yield*/, (0, compaction_js_1.summarizeInStages)({
                            messages: pruned.droppedMessagesList,
                            model: model,
                            apiKey: apiKey,
                            signal: signal,
                            reserveTokens: Math.max(1, Math.floor(preparation.settings.reserveTokens)),
                            maxChunkTokens: droppedMaxChunkTokens,
                            contextWindow: contextWindowTokens,
                            customInstructions: customInstructions,
                            previousSummary: preparation.previousSummary,
                        })];
                case 4:
                    droppedSummary = _e.sent();
                    return [3 /*break*/, 6];
                case 5:
                    droppedError_1 = _e.sent();
                    console.warn("Compaction safeguard: failed to summarize dropped messages, continuing without: ".concat(droppedError_1 instanceof Error ? droppedError_1.message : String(droppedError_1)));
                    return [3 /*break*/, 6];
                case 6:
                    allMessages = __spreadArray(__spreadArray([], messagesToSummarize, true), turnPrefixMessages, true);
                    adaptiveRatio = (0, compaction_js_1.computeAdaptiveChunkRatio)(allMessages, contextWindowTokens);
                    maxChunkTokens = Math.max(1, Math.floor(contextWindowTokens * adaptiveRatio));
                    reserveTokens = Math.max(1, Math.floor(preparation.settings.reserveTokens));
                    effectivePreviousSummary = droppedSummary !== null && droppedSummary !== void 0 ? droppedSummary : preparation.previousSummary;
                    return [4 /*yield*/, (0, compaction_js_1.summarizeInStages)({
                            messages: messagesToSummarize,
                            model: model,
                            apiKey: apiKey,
                            signal: signal,
                            reserveTokens: reserveTokens,
                            maxChunkTokens: maxChunkTokens,
                            contextWindow: contextWindowTokens,
                            customInstructions: customInstructions,
                            previousSummary: effectivePreviousSummary,
                        })];
                case 7:
                    historySummary = _e.sent();
                    summary = historySummary;
                    if (!(preparation.isSplitTurn && turnPrefixMessages.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, compaction_js_1.summarizeInStages)({
                            messages: turnPrefixMessages,
                            model: model,
                            apiKey: apiKey,
                            signal: signal,
                            reserveTokens: reserveTokens,
                            maxChunkTokens: maxChunkTokens,
                            contextWindow: contextWindowTokens,
                            customInstructions: TURN_PREFIX_INSTRUCTIONS,
                            previousSummary: undefined,
                        })];
                case 8:
                    prefixSummary = _e.sent();
                    summary = "".concat(historySummary, "\n\n---\n\n**Turn Context (split turn):**\n\n").concat(prefixSummary);
                    _e.label = 9;
                case 9:
                    summary += toolFailureSection;
                    summary += fileOpsSummary;
                    return [2 /*return*/, {
                            compaction: {
                                summary: summary,
                                firstKeptEntryId: preparation.firstKeptEntryId,
                                tokensBefore: preparation.tokensBefore,
                                details: { readFiles: readFiles, modifiedFiles: modifiedFiles },
                            },
                        }];
                case 10:
                    error_1 = _e.sent();
                    console.warn("Compaction summarization failed; truncating history: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    return [2 /*return*/, {
                            compaction: {
                                summary: fallbackSummary,
                                firstKeptEntryId: preparation.firstKeptEntryId,
                                tokensBefore: preparation.tokensBefore,
                                details: { readFiles: readFiles, modifiedFiles: modifiedFiles },
                            },
                        }];
                case 11: return [2 /*return*/];
            }
        });
    }); });
}
exports.__testing = {
    collectToolFailures: collectToolFailures,
    formatToolFailuresSection: formatToolFailuresSection,
    computeAdaptiveChunkRatio: compaction_js_1.computeAdaptiveChunkRatio,
    isOversizedForSummary: compaction_js_1.isOversizedForSummary,
    BASE_CHUNK_RATIO: compaction_js_1.BASE_CHUNK_RATIO,
    MIN_CHUNK_RATIO: compaction_js_1.MIN_CHUNK_RATIO,
    SAFETY_MARGIN: compaction_js_1.SAFETY_MARGIN,
};
