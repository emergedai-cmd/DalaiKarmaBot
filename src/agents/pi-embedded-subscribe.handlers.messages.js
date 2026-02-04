"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessageStart = handleMessageStart;
exports.handleMessageUpdate = handleMessageUpdate;
exports.handleMessageEnd = handleMessageEnd;
var reply_directives_js_1 = require("../auto-reply/reply/reply-directives.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var code_spans_js_1 = require("../markdown/code-spans.js");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var pi_embedded_subscribe_raw_stream_js_1 = require("./pi-embedded-subscribe.raw-stream.js");
var pi_embedded_utils_js_1 = require("./pi-embedded-utils.js");
var stripTrailingDirective = function (text) {
    var openIndex = text.lastIndexOf("[[");
    if (openIndex < 0) {
        return text;
    }
    var closeIndex = text.indexOf("]]", openIndex + 2);
    if (closeIndex >= 0) {
        return text;
    }
    return text.slice(0, openIndex);
};
function handleMessageStart(ctx, evt) {
    var _a, _b;
    var msg = evt.message;
    if ((msg === null || msg === void 0 ? void 0 : msg.role) !== "assistant") {
        return;
    }
    // KNOWN: Resetting at `text_end` is unsafe (late/duplicate end events).
    // ASSUME: `message_start` is the only reliable boundary for “new assistant message begins”.
    // Start-of-message is a safer reset point than message_end: some providers
    // may deliver late text_end updates after message_end, which would otherwise
    // re-trigger block replies.
    ctx.resetAssistantMessageState(ctx.state.assistantTexts.length);
    // Use assistant message_start as the earliest "writing" signal for typing.
    void ((_b = (_a = ctx.params).onAssistantMessageStart) === null || _b === void 0 ? void 0 : _b.call(_a));
}
function handleMessageUpdate(ctx, evt) {
    var _a, _b, _c, _d, _e;
    var msg = evt.message;
    if ((msg === null || msg === void 0 ? void 0 : msg.role) !== "assistant") {
        return;
    }
    var assistantEvent = evt.assistantMessageEvent;
    var assistantRecord = assistantEvent && typeof assistantEvent === "object"
        ? assistantEvent
        : undefined;
    var evtType = typeof (assistantRecord === null || assistantRecord === void 0 ? void 0 : assistantRecord.type) === "string" ? assistantRecord.type : "";
    if (evtType !== "text_delta" && evtType !== "text_start" && evtType !== "text_end") {
        return;
    }
    var delta = typeof (assistantRecord === null || assistantRecord === void 0 ? void 0 : assistantRecord.delta) === "string" ? assistantRecord.delta : "";
    var content = typeof (assistantRecord === null || assistantRecord === void 0 ? void 0 : assistantRecord.content) === "string" ? assistantRecord.content : "";
    (0, pi_embedded_subscribe_raw_stream_js_1.appendRawStream)({
        ts: Date.now(),
        event: "assistant_text_stream",
        runId: ctx.params.runId,
        sessionId: ctx.params.session.id,
        evtType: evtType,
        delta: delta,
        content: content,
    });
    var chunk = "";
    if (evtType === "text_delta") {
        chunk = delta;
    }
    else if (evtType === "text_start" || evtType === "text_end") {
        if (delta) {
            chunk = delta;
        }
        else if (content) {
            // KNOWN: Some providers resend full content on `text_end`.
            // We only append a suffix (or nothing) to keep output monotonic.
            if (content.startsWith(ctx.state.deltaBuffer)) {
                chunk = content.slice(ctx.state.deltaBuffer.length);
            }
            else if (ctx.state.deltaBuffer.startsWith(content)) {
                chunk = "";
            }
            else if (!ctx.state.deltaBuffer.includes(content)) {
                chunk = content;
            }
        }
    }
    if (chunk) {
        ctx.state.deltaBuffer += chunk;
        if (ctx.blockChunker) {
            ctx.blockChunker.append(chunk);
        }
        else {
            ctx.state.blockBuffer += chunk;
        }
    }
    if (ctx.state.streamReasoning) {
        // Handle partial <think> tags: stream whatever reasoning is visible so far.
        ctx.emitReasoningStream((0, pi_embedded_utils_js_1.extractThinkingFromTaggedStream)(ctx.state.deltaBuffer));
    }
    var next = ctx
        .stripBlockTags(ctx.state.deltaBuffer, {
        thinking: false,
        final: false,
        inlineCode: (0, code_spans_js_1.createInlineCodeState)(),
    })
        .trim();
    if (next) {
        var visibleDelta = chunk ? ctx.stripBlockTags(chunk, ctx.state.partialBlockState) : "";
        var parsedDelta = visibleDelta ? ctx.consumePartialReplyDirectives(visibleDelta) : null;
        var parsedFull = (0, reply_directives_js_1.parseReplyDirectives)(stripTrailingDirective(next));
        var cleanedText = parsedFull.text;
        var mediaUrls = parsedDelta === null || parsedDelta === void 0 ? void 0 : parsedDelta.mediaUrls;
        var hasMedia = Boolean(mediaUrls && mediaUrls.length > 0);
        var hasAudio = Boolean(parsedDelta === null || parsedDelta === void 0 ? void 0 : parsedDelta.audioAsVoice);
        var previousCleaned = (_a = ctx.state.lastStreamedAssistantCleaned) !== null && _a !== void 0 ? _a : "";
        var shouldEmit = false;
        var deltaText = "";
        if (!cleanedText && !hasMedia && !hasAudio) {
            shouldEmit = false;
        }
        else if (previousCleaned && !cleanedText.startsWith(previousCleaned)) {
            shouldEmit = false;
        }
        else {
            deltaText = cleanedText.slice(previousCleaned.length);
            shouldEmit = Boolean(deltaText || hasMedia || hasAudio);
        }
        ctx.state.lastStreamedAssistant = next;
        ctx.state.lastStreamedAssistantCleaned = cleanedText;
        if (shouldEmit) {
            (0, agent_events_js_1.emitAgentEvent)({
                runId: ctx.params.runId,
                stream: "assistant",
                data: {
                    text: cleanedText,
                    delta: deltaText,
                    mediaUrls: hasMedia ? mediaUrls : undefined,
                },
            });
            void ((_c = (_b = ctx.params).onAgentEvent) === null || _c === void 0 ? void 0 : _c.call(_b, {
                stream: "assistant",
                data: {
                    text: cleanedText,
                    delta: deltaText,
                    mediaUrls: hasMedia ? mediaUrls : undefined,
                },
            }));
            if (ctx.params.onPartialReply && ctx.state.shouldEmitPartialReplies) {
                void ctx.params.onPartialReply({
                    text: cleanedText,
                    mediaUrls: hasMedia ? mediaUrls : undefined,
                });
            }
        }
    }
    if (ctx.params.onBlockReply && ctx.blockChunking && ctx.state.blockReplyBreak === "text_end") {
        (_d = ctx.blockChunker) === null || _d === void 0 ? void 0 : _d.drain({ force: false, emit: ctx.emitBlockChunk });
    }
    if (evtType === "text_end" && ctx.state.blockReplyBreak === "text_end") {
        if ((_e = ctx.blockChunker) === null || _e === void 0 ? void 0 : _e.hasBuffered()) {
            ctx.blockChunker.drain({ force: true, emit: ctx.emitBlockChunk });
            ctx.blockChunker.reset();
        }
        else if (ctx.state.blockBuffer.length > 0) {
            ctx.emitBlockChunk(ctx.state.blockBuffer);
            ctx.state.blockBuffer = "";
        }
    }
}
function handleMessageEnd(ctx, evt) {
    var _a, _b, _c, _d;
    var msg = evt.message;
    if ((msg === null || msg === void 0 ? void 0 : msg.role) !== "assistant") {
        return;
    }
    var assistantMessage = msg;
    (0, pi_embedded_utils_js_1.promoteThinkingTagsToBlocks)(assistantMessage);
    var rawText = (0, pi_embedded_utils_js_1.extractAssistantText)(assistantMessage);
    (0, pi_embedded_subscribe_raw_stream_js_1.appendRawStream)({
        ts: Date.now(),
        event: "assistant_message_end",
        runId: ctx.params.runId,
        sessionId: ctx.params.session.id,
        rawText: rawText,
        rawThinking: (0, pi_embedded_utils_js_1.extractAssistantThinking)(assistantMessage),
    });
    var text = ctx.stripBlockTags(rawText, { thinking: false, final: false });
    var rawThinking = ctx.state.includeReasoning || ctx.state.streamReasoning
        ? (0, pi_embedded_utils_js_1.extractAssistantThinking)(assistantMessage) || (0, pi_embedded_utils_js_1.extractThinkingFromTaggedText)(rawText)
        : "";
    var formattedReasoning = rawThinking ? (0, pi_embedded_utils_js_1.formatReasoningMessage)(rawThinking) : "";
    var addedDuringMessage = ctx.state.assistantTexts.length > ctx.state.assistantTextBaseline;
    var chunkerHasBuffered = (_b = (_a = ctx.blockChunker) === null || _a === void 0 ? void 0 : _a.hasBuffered()) !== null && _b !== void 0 ? _b : false;
    ctx.finalizeAssistantTexts({ text: text, addedDuringMessage: addedDuringMessage, chunkerHasBuffered: chunkerHasBuffered });
    var onBlockReply = ctx.params.onBlockReply;
    var shouldEmitReasoning = Boolean(ctx.state.includeReasoning &&
        formattedReasoning &&
        onBlockReply &&
        formattedReasoning !== ctx.state.lastReasoningSent);
    var shouldEmitReasoningBeforeAnswer = shouldEmitReasoning && ctx.state.blockReplyBreak === "message_end" && !addedDuringMessage;
    var maybeEmitReasoning = function () {
        if (!shouldEmitReasoning || !formattedReasoning) {
            return;
        }
        ctx.state.lastReasoningSent = formattedReasoning;
        void (onBlockReply === null || onBlockReply === void 0 ? void 0 : onBlockReply({ text: formattedReasoning }));
    };
    if (shouldEmitReasoningBeforeAnswer) {
        maybeEmitReasoning();
    }
    if ((ctx.state.blockReplyBreak === "message_end" ||
        (ctx.blockChunker ? ctx.blockChunker.hasBuffered() : ctx.state.blockBuffer.length > 0)) &&
        text &&
        onBlockReply) {
        if ((_c = ctx.blockChunker) === null || _c === void 0 ? void 0 : _c.hasBuffered()) {
            ctx.blockChunker.drain({ force: true, emit: ctx.emitBlockChunk });
            ctx.blockChunker.reset();
        }
        else if (text !== ctx.state.lastBlockReplyText) {
            // Check for duplicates before emitting (same logic as emitBlockChunk).
            var normalizedText = (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(text);
            if ((0, pi_embedded_helpers_js_1.isMessagingToolDuplicateNormalized)(normalizedText, ctx.state.messagingToolSentTextsNormalized)) {
                ctx.log.debug("Skipping message_end block reply - already sent via messaging tool: ".concat(text.slice(0, 50), "..."));
            }
            else {
                ctx.state.lastBlockReplyText = text;
                var splitResult = ctx.consumeReplyDirectives(text, { final: true });
                if (splitResult) {
                    var cleanedText = splitResult.text, mediaUrls = splitResult.mediaUrls, audioAsVoice = splitResult.audioAsVoice, replyToId = splitResult.replyToId, replyToTag = splitResult.replyToTag, replyToCurrent = splitResult.replyToCurrent;
                    // Emit if there's content OR audioAsVoice flag (to propagate the flag).
                    if (cleanedText || (mediaUrls && mediaUrls.length > 0) || audioAsVoice) {
                        void onBlockReply({
                            text: cleanedText,
                            mediaUrls: (mediaUrls === null || mediaUrls === void 0 ? void 0 : mediaUrls.length) ? mediaUrls : undefined,
                            audioAsVoice: audioAsVoice,
                            replyToId: replyToId,
                            replyToTag: replyToTag,
                            replyToCurrent: replyToCurrent,
                        });
                    }
                }
            }
        }
    }
    if (!shouldEmitReasoningBeforeAnswer) {
        maybeEmitReasoning();
    }
    if (ctx.state.streamReasoning && rawThinking) {
        ctx.emitReasoningStream(rawThinking);
    }
    if (ctx.state.blockReplyBreak === "text_end" && onBlockReply) {
        var tailResult = ctx.consumeReplyDirectives("", { final: true });
        if (tailResult) {
            var cleanedText = tailResult.text, mediaUrls = tailResult.mediaUrls, audioAsVoice = tailResult.audioAsVoice, replyToId = tailResult.replyToId, replyToTag = tailResult.replyToTag, replyToCurrent = tailResult.replyToCurrent;
            if (cleanedText || (mediaUrls && mediaUrls.length > 0) || audioAsVoice) {
                void onBlockReply({
                    text: cleanedText,
                    mediaUrls: (mediaUrls === null || mediaUrls === void 0 ? void 0 : mediaUrls.length) ? mediaUrls : undefined,
                    audioAsVoice: audioAsVoice,
                    replyToId: replyToId,
                    replyToTag: replyToTag,
                    replyToCurrent: replyToCurrent,
                });
            }
        }
    }
    ctx.state.deltaBuffer = "";
    ctx.state.blockBuffer = "";
    (_d = ctx.blockChunker) === null || _d === void 0 ? void 0 : _d.reset();
    ctx.state.blockState.thinking = false;
    ctx.state.blockState.final = false;
    ctx.state.blockState.inlineCode = (0, code_spans_js_1.createInlineCodeState)();
    ctx.state.lastStreamedAssistant = undefined;
    ctx.state.lastStreamedAssistantCleaned = undefined;
}
