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
exports.SAFETY_MARGIN = exports.MIN_CHUNK_RATIO = exports.BASE_CHUNK_RATIO = void 0;
exports.estimateMessagesTokens = estimateMessagesTokens;
exports.splitMessagesByTokenShare = splitMessagesByTokenShare;
exports.chunkMessagesByMaxTokens = chunkMessagesByMaxTokens;
exports.computeAdaptiveChunkRatio = computeAdaptiveChunkRatio;
exports.isOversizedForSummary = isOversizedForSummary;
exports.summarizeWithFallback = summarizeWithFallback;
exports.summarizeInStages = summarizeInStages;
exports.pruneHistoryForContextShare = pruneHistoryForContextShare;
exports.resolveContextWindowTokens = resolveContextWindowTokens;
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var defaults_js_1 = require("./defaults.js");
exports.BASE_CHUNK_RATIO = 0.4;
exports.MIN_CHUNK_RATIO = 0.15;
exports.SAFETY_MARGIN = 1.2; // 20% buffer for estimateTokens() inaccuracy
var DEFAULT_SUMMARY_FALLBACK = "No prior history.";
var DEFAULT_PARTS = 2;
var MERGE_SUMMARIES_INSTRUCTIONS = "Merge these partial summaries into a single cohesive summary. Preserve decisions," +
    " TODOs, open questions, and any constraints.";
function estimateMessagesTokens(messages) {
    return messages.reduce(function (sum, message) { return sum + (0, pi_coding_agent_1.estimateTokens)(message); }, 0);
}
function normalizeParts(parts, messageCount) {
    if (!Number.isFinite(parts) || parts <= 1) {
        return 1;
    }
    return Math.min(Math.max(1, Math.floor(parts)), Math.max(1, messageCount));
}
function splitMessagesByTokenShare(messages, parts) {
    if (parts === void 0) { parts = DEFAULT_PARTS; }
    if (messages.length === 0) {
        return [];
    }
    var normalizedParts = normalizeParts(parts, messages.length);
    if (normalizedParts <= 1) {
        return [messages];
    }
    var totalTokens = estimateMessagesTokens(messages);
    var targetTokens = totalTokens / normalizedParts;
    var chunks = [];
    var current = [];
    var currentTokens = 0;
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        var messageTokens = (0, pi_coding_agent_1.estimateTokens)(message);
        if (chunks.length < normalizedParts - 1 &&
            current.length > 0 &&
            currentTokens + messageTokens > targetTokens) {
            chunks.push(current);
            current = [];
            currentTokens = 0;
        }
        current.push(message);
        currentTokens += messageTokens;
    }
    if (current.length > 0) {
        chunks.push(current);
    }
    return chunks;
}
function chunkMessagesByMaxTokens(messages, maxTokens) {
    if (messages.length === 0) {
        return [];
    }
    var chunks = [];
    var currentChunk = [];
    var currentTokens = 0;
    for (var _i = 0, messages_2 = messages; _i < messages_2.length; _i++) {
        var message = messages_2[_i];
        var messageTokens = (0, pi_coding_agent_1.estimateTokens)(message);
        if (currentChunk.length > 0 && currentTokens + messageTokens > maxTokens) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentTokens = 0;
        }
        currentChunk.push(message);
        currentTokens += messageTokens;
        if (messageTokens > maxTokens) {
            // Split oversized messages to avoid unbounded chunk growth.
            chunks.push(currentChunk);
            currentChunk = [];
            currentTokens = 0;
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }
    return chunks;
}
/**
 * Compute adaptive chunk ratio based on average message size.
 * When messages are large, we use smaller chunks to avoid exceeding model limits.
 */
function computeAdaptiveChunkRatio(messages, contextWindow) {
    if (messages.length === 0) {
        return exports.BASE_CHUNK_RATIO;
    }
    var totalTokens = estimateMessagesTokens(messages);
    var avgTokens = totalTokens / messages.length;
    // Apply safety margin to account for estimation inaccuracy
    var safeAvgTokens = avgTokens * exports.SAFETY_MARGIN;
    var avgRatio = safeAvgTokens / contextWindow;
    // If average message is > 10% of context, reduce chunk ratio
    if (avgRatio > 0.1) {
        var reduction = Math.min(avgRatio * 2, exports.BASE_CHUNK_RATIO - exports.MIN_CHUNK_RATIO);
        return Math.max(exports.MIN_CHUNK_RATIO, exports.BASE_CHUNK_RATIO - reduction);
    }
    return exports.BASE_CHUNK_RATIO;
}
/**
 * Check if a single message is too large to summarize.
 * If single message > 50% of context, it can't be summarized safely.
 */
function isOversizedForSummary(msg, contextWindow) {
    var tokens = (0, pi_coding_agent_1.estimateTokens)(msg) * exports.SAFETY_MARGIN;
    return tokens > contextWindow * 0.5;
}
function summarizeChunks(params) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, summary, _i, chunks_1, chunk;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (params.messages.length === 0) {
                        return [2 /*return*/, (_a = params.previousSummary) !== null && _a !== void 0 ? _a : DEFAULT_SUMMARY_FALLBACK];
                    }
                    chunks = chunkMessagesByMaxTokens(params.messages, params.maxChunkTokens);
                    summary = params.previousSummary;
                    _i = 0, chunks_1 = chunks;
                    _b.label = 1;
                case 1:
                    if (!(_i < chunks_1.length)) return [3 /*break*/, 4];
                    chunk = chunks_1[_i];
                    return [4 /*yield*/, (0, pi_coding_agent_1.generateSummary)(chunk, params.model, params.reserveTokens, params.apiKey, params.signal, params.customInstructions, summary)];
                case 2:
                    summary = _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, summary !== null && summary !== void 0 ? summary : DEFAULT_SUMMARY_FALLBACK];
            }
        });
    });
}
/**
 * Summarize with progressive fallback for handling oversized messages.
 * If full summarization fails, tries partial summarization excluding oversized messages.
 */
function summarizeWithFallback(params) {
    return __awaiter(this, void 0, void 0, function () {
        var messages, contextWindow, fullError_1, smallMessages, oversizedNotes, _i, messages_3, msg, role, tokens, partialSummary, notes, partialError_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    messages = params.messages, contextWindow = params.contextWindow;
                    if (messages.length === 0) {
                        return [2 /*return*/, (_a = params.previousSummary) !== null && _a !== void 0 ? _a : DEFAULT_SUMMARY_FALLBACK];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, summarizeChunks(params)];
                case 2: return [2 /*return*/, _c.sent()];
                case 3:
                    fullError_1 = _c.sent();
                    console.warn("Full summarization failed, trying partial: ".concat(fullError_1 instanceof Error ? fullError_1.message : String(fullError_1)));
                    return [3 /*break*/, 4];
                case 4:
                    smallMessages = [];
                    oversizedNotes = [];
                    for (_i = 0, messages_3 = messages; _i < messages_3.length; _i++) {
                        msg = messages_3[_i];
                        if (isOversizedForSummary(msg, contextWindow)) {
                            role = (_b = msg.role) !== null && _b !== void 0 ? _b : "message";
                            tokens = (0, pi_coding_agent_1.estimateTokens)(msg);
                            oversizedNotes.push("[Large ".concat(role, " (~").concat(Math.round(tokens / 1000), "K tokens) omitted from summary]"));
                        }
                        else {
                            smallMessages.push(msg);
                        }
                    }
                    if (!(smallMessages.length > 0)) return [3 /*break*/, 8];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, summarizeChunks(__assign(__assign({}, params), { messages: smallMessages }))];
                case 6:
                    partialSummary = _c.sent();
                    notes = oversizedNotes.length > 0 ? "\n\n".concat(oversizedNotes.join("\n")) : "";
                    return [2 /*return*/, partialSummary + notes];
                case 7:
                    partialError_1 = _c.sent();
                    console.warn("Partial summarization also failed: ".concat(partialError_1 instanceof Error ? partialError_1.message : String(partialError_1)));
                    return [3 /*break*/, 8];
                case 8: 
                // Final fallback: Just note what was there
                return [2 /*return*/, ("Context contained ".concat(messages.length, " messages (").concat(oversizedNotes.length, " oversized). ") +
                        "Summary unavailable due to size limits.")];
            }
        });
    });
}
function summarizeInStages(params) {
    return __awaiter(this, void 0, void 0, function () {
        var messages, minMessagesForSplit, parts, totalTokens, splits, partialSummaries, _i, splits_1, chunk, _a, _b, summaryMessages, mergeInstructions;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    messages = params.messages;
                    if (messages.length === 0) {
                        return [2 /*return*/, (_c = params.previousSummary) !== null && _c !== void 0 ? _c : DEFAULT_SUMMARY_FALLBACK];
                    }
                    minMessagesForSplit = Math.max(2, (_d = params.minMessagesForSplit) !== null && _d !== void 0 ? _d : 4);
                    parts = normalizeParts((_e = params.parts) !== null && _e !== void 0 ? _e : DEFAULT_PARTS, messages.length);
                    totalTokens = estimateMessagesTokens(messages);
                    if (parts <= 1 || messages.length < minMessagesForSplit || totalTokens <= params.maxChunkTokens) {
                        return [2 /*return*/, summarizeWithFallback(params)];
                    }
                    splits = splitMessagesByTokenShare(messages, parts).filter(function (chunk) { return chunk.length > 0; });
                    if (splits.length <= 1) {
                        return [2 /*return*/, summarizeWithFallback(params)];
                    }
                    partialSummaries = [];
                    _i = 0, splits_1 = splits;
                    _f.label = 1;
                case 1:
                    if (!(_i < splits_1.length)) return [3 /*break*/, 4];
                    chunk = splits_1[_i];
                    _b = (_a = partialSummaries).push;
                    return [4 /*yield*/, summarizeWithFallback(__assign(__assign({}, params), { messages: chunk, previousSummary: undefined }))];
                case 2:
                    _b.apply(_a, [_f.sent()]);
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (partialSummaries.length === 1) {
                        return [2 /*return*/, partialSummaries[0]];
                    }
                    summaryMessages = partialSummaries.map(function (summary) { return ({
                        role: "user",
                        content: summary,
                        timestamp: Date.now(),
                    }); });
                    mergeInstructions = params.customInstructions
                        ? "".concat(MERGE_SUMMARIES_INSTRUCTIONS, "\n\nAdditional focus:\n").concat(params.customInstructions)
                        : MERGE_SUMMARIES_INSTRUCTIONS;
                    return [2 /*return*/, summarizeWithFallback(__assign(__assign({}, params), { messages: summaryMessages, customInstructions: mergeInstructions }))];
            }
        });
    });
}
function pruneHistoryForContextShare(params) {
    var _a, _b;
    var maxHistoryShare = (_a = params.maxHistoryShare) !== null && _a !== void 0 ? _a : 0.5;
    var budgetTokens = Math.max(1, Math.floor(params.maxContextTokens * maxHistoryShare));
    var keptMessages = params.messages;
    var allDroppedMessages = [];
    var droppedChunks = 0;
    var droppedMessages = 0;
    var droppedTokens = 0;
    var parts = normalizeParts((_b = params.parts) !== null && _b !== void 0 ? _b : DEFAULT_PARTS, keptMessages.length);
    while (keptMessages.length > 0 && estimateMessagesTokens(keptMessages) > budgetTokens) {
        var chunks = splitMessagesByTokenShare(keptMessages, parts);
        if (chunks.length <= 1) {
            break;
        }
        var dropped = chunks[0], rest = chunks.slice(1);
        droppedChunks += 1;
        droppedMessages += dropped.length;
        droppedTokens += estimateMessagesTokens(dropped);
        allDroppedMessages.push.apply(allDroppedMessages, dropped);
        keptMessages = rest.flat();
    }
    return {
        messages: keptMessages,
        droppedMessagesList: allDroppedMessages,
        droppedChunks: droppedChunks,
        droppedMessages: droppedMessages,
        droppedTokens: droppedTokens,
        keptTokens: estimateMessagesTokens(keptMessages),
        budgetTokens: budgetTokens,
    };
}
function resolveContextWindowTokens(model) {
    var _a;
    return Math.max(1, Math.floor((_a = model === null || model === void 0 ? void 0 : model.contextWindow) !== null && _a !== void 0 ? _a : defaults_js_1.DEFAULT_CONTEXT_TOKENS));
}
