"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.renderChat = renderChat;
var lit_1 = require("lit");
var ref_js_1 = require("lit/directives/ref.js");
var repeat_js_1 = require("lit/directives/repeat.js");
var grouped_render_1 = require("../chat/grouped-render");
var message_normalizer_1 = require("../chat/message-normalizer");
var icons_1 = require("../icons");
var markdown_sidebar_1 = require("./markdown-sidebar");
require("../components/resizable-divider");
var COMPACTION_TOAST_DURATION_MS = 5000;
function adjustTextareaHeight(el) {
    el.style.height = "auto";
    el.style.height = "".concat(el.scrollHeight, "px");
}
function renderCompactionIndicator(status) {
    if (!status) {
        return lit_1.nothing;
    }
    // Show "compacting..." while active
    if (status.active) {
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <div class=\"callout info compaction-indicator compaction-indicator--active\">\n        ", " Compacting context...\n      </div>\n    "], ["\n      <div class=\"callout info compaction-indicator compaction-indicator--active\">\n        ", " Compacting context...\n      </div>\n    "])), icons_1.icons.loader);
    }
    // Show "compaction complete" briefly after completion
    if (status.completedAt) {
        var elapsed = Date.now() - status.completedAt;
        if (elapsed < COMPACTION_TOAST_DURATION_MS) {
            return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        <div class=\"callout success compaction-indicator compaction-indicator--complete\">\n          ", " Context compacted\n        </div>\n      "], ["\n        <div class=\"callout success compaction-indicator compaction-indicator--complete\">\n          ", " Context compacted\n        </div>\n      "])), icons_1.icons.check);
        }
    }
    return lit_1.nothing;
}
function generateAttachmentId() {
    return "att-".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 9));
}
function handlePaste(e, props) {
    var _a;
    var items = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.items;
    if (!items || !props.onAttachmentsChange) {
        return;
    }
    var imageItems = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.type.startsWith("image/")) {
            imageItems.push(item);
        }
    }
    if (imageItems.length === 0) {
        return;
    }
    e.preventDefault();
    var _loop_1 = function (item) {
        var file = item.getAsFile();
        if (!file) {
            return "continue";
        }
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            var _a, _b;
            var dataUrl = reader.result;
            var newAttachment = {
                id: generateAttachmentId(),
                dataUrl: dataUrl,
                mimeType: file.type,
            };
            var current = (_a = props.attachments) !== null && _a !== void 0 ? _a : [];
            (_b = props.onAttachmentsChange) === null || _b === void 0 ? void 0 : _b.call(props, __spreadArray(__spreadArray([], current, true), [newAttachment], false));
        });
        reader.readAsDataURL(file);
    };
    for (var _i = 0, imageItems_1 = imageItems; _i < imageItems_1.length; _i++) {
        var item = imageItems_1[_i];
        _loop_1(item);
    }
}
function renderAttachmentPreview(props) {
    var _a;
    var attachments = (_a = props.attachments) !== null && _a !== void 0 ? _a : [];
    if (attachments.length === 0) {
        return lit_1.nothing;
    }
    return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <div class=\"chat-attachments\">\n      ", "\n    </div>\n  "], ["\n    <div class=\"chat-attachments\">\n      ", "\n    </div>\n  "])), attachments.map(function (att) { return (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n          <div class=\"chat-attachment\">\n            <img\n              src=", "\n              alt=\"Attachment preview\"\n              class=\"chat-attachment__img\"\n            />\n            <button\n              class=\"chat-attachment__remove\"\n              type=\"button\"\n              aria-label=\"Remove attachment\"\n              @click=", "\n            >\n              ", "\n            </button>\n          </div>\n        "], ["\n          <div class=\"chat-attachment\">\n            <img\n              src=", "\n              alt=\"Attachment preview\"\n              class=\"chat-attachment__img\"\n            />\n            <button\n              class=\"chat-attachment__remove\"\n              type=\"button\"\n              aria-label=\"Remove attachment\"\n              @click=", "\n            >\n              ", "\n            </button>\n          </div>\n        "])), att.dataUrl, function () {
        var _a, _b;
        var next = ((_a = props.attachments) !== null && _a !== void 0 ? _a : []).filter(function (a) { return a.id !== att.id; });
        (_b = props.onAttachmentsChange) === null || _b === void 0 ? void 0 : _b.call(props, next);
    }, icons_1.icons.x); }));
}
function renderChat(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var canCompose = props.connected;
    var isBusy = props.sending || props.stream !== null;
    var canAbort = Boolean(props.canAbort && props.onAbort);
    var activeSession = (_b = (_a = props.sessions) === null || _a === void 0 ? void 0 : _a.sessions) === null || _b === void 0 ? void 0 : _b.find(function (row) { return row.key === props.sessionKey; });
    var reasoningLevel = (_c = activeSession === null || activeSession === void 0 ? void 0 : activeSession.reasoningLevel) !== null && _c !== void 0 ? _c : "off";
    var showReasoning = props.showThinking && reasoningLevel !== "off";
    var assistantIdentity = {
        name: props.assistantName,
        avatar: (_e = (_d = props.assistantAvatar) !== null && _d !== void 0 ? _d : props.assistantAvatarUrl) !== null && _e !== void 0 ? _e : null,
    };
    var hasAttachments = ((_g = (_f = props.attachments) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0) > 0;
    var composePlaceholder = props.connected
        ? hasAttachments
            ? "Add a message or paste more images..."
            : "Message (↩ to send, Shift+↩ for line breaks, paste images)"
        : "Connect to the gateway to start chatting…";
    var splitRatio = (_h = props.splitRatio) !== null && _h !== void 0 ? _h : 0.6;
    var sidebarOpen = Boolean(props.sidebarOpen && props.onCloseSidebar);
    var thread = (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    <div\n      class=\"chat-thread\"\n      role=\"log\"\n      aria-live=\"polite\"\n      @scroll=", "\n    >\n      ", "\n      ", "\n    </div>\n  "], ["\n    <div\n      class=\"chat-thread\"\n      role=\"log\"\n      aria-live=\"polite\"\n      @scroll=", "\n    >\n      ", "\n      ", "\n    </div>\n  "])), props.onChatScroll, props.loading
        ? (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n              <div class=\"muted\">Loading chat\u2026</div>\n            "], ["\n              <div class=\"muted\">Loading chat\u2026</div>\n            "]))) : lit_1.nothing, (0, repeat_js_1.repeat)(buildChatItems(props), function (item) { return item.key; }, function (item) {
        if (item.kind === "reading-indicator") {
            return (0, grouped_render_1.renderReadingIndicatorGroup)(assistantIdentity);
        }
        if (item.kind === "stream") {
            return (0, grouped_render_1.renderStreamingGroup)(item.text, item.startedAt, props.onOpenSidebar, assistantIdentity);
        }
        if (item.kind === "group") {
            return (0, grouped_render_1.renderMessageGroup)(item, {
                onOpenSidebar: props.onOpenSidebar,
                showReasoning: showReasoning,
                assistantName: props.assistantName,
                assistantAvatar: assistantIdentity.avatar,
            });
        }
        return lit_1.nothing;
    }));
    return (0, lit_1.html)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n    <section class=\"card chat\">\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      <div\n        class=\"chat-split-container ", "\"\n      >\n        <div\n          class=\"chat-main\"\n          style=\"flex: ", "\"\n        >\n          ", "\n        </div>\n\n        ", "\n      </div>\n\n      ", "\n\n      ", "\n\n      <div class=\"chat-compose\">\n        ", "\n        <div class=\"chat-compose__row\">\n          <label class=\"field chat-compose__field\">\n            <span>Message</span>\n            <textarea\n              ", "\n              .value=", "\n              ?disabled=", "\n              @keydown=", "\n              @input=", "\n              @paste=", "\n              placeholder=", "\n            ></textarea>\n          </label>\n          <div class=\"chat-compose__actions\">\n            <button\n              class=\"btn\"\n              ?disabled=", "\n              @click=", "\n            >\n              ", "\n            </button>\n            <button\n              class=\"btn primary\"\n              ?disabled=", "\n              @click=", "\n            >\n              ", "<kbd class=\"btn-kbd\">\u21B5</kbd>\n            </button>\n          </div>\n        </div>\n      </div>\n    </section>\n  "], ["\n    <section class=\"card chat\">\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      <div\n        class=\"chat-split-container ", "\"\n      >\n        <div\n          class=\"chat-main\"\n          style=\"flex: ", "\"\n        >\n          ", "\n        </div>\n\n        ", "\n      </div>\n\n      ", "\n\n      ", "\n\n      <div class=\"chat-compose\">\n        ", "\n        <div class=\"chat-compose__row\">\n          <label class=\"field chat-compose__field\">\n            <span>Message</span>\n            <textarea\n              ", "\n              .value=", "\n              ?disabled=", "\n              @keydown=", "\n              @input=", "\n              @paste=", "\n              placeholder=", "\n            ></textarea>\n          </label>\n          <div class=\"chat-compose__actions\">\n            <button\n              class=\"btn\"\n              ?disabled=", "\n              @click=", "\n            >\n              ", "\n            </button>\n            <button\n              class=\"btn primary\"\n              ?disabled=", "\n              @click=", "\n            >\n              ", "<kbd class=\"btn-kbd\">\u21B5</kbd>\n            </button>\n          </div>\n        </div>\n      </div>\n    </section>\n  "])), props.disabledReason ? (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["<div class=\"callout\">", "</div>"], ["<div class=\"callout\">", "</div>"])), props.disabledReason) : lit_1.nothing, props.error ? (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["<div class=\"callout danger\">", "</div>"], ["<div class=\"callout danger\">", "</div>"])), props.error) : lit_1.nothing, renderCompactionIndicator(props.compactionStatus), props.focusMode
        ? (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n            <button\n              class=\"chat-focus-exit\"\n              type=\"button\"\n              @click=", "\n              aria-label=\"Exit focus mode\"\n              title=\"Exit focus mode\"\n            >\n              ", "\n            </button>\n          "], ["\n            <button\n              class=\"chat-focus-exit\"\n              type=\"button\"\n              @click=", "\n              aria-label=\"Exit focus mode\"\n              title=\"Exit focus mode\"\n            >\n              ", "\n            </button>\n          "])), props.onToggleFocusMode, icons_1.icons.x) : lit_1.nothing, sidebarOpen ? "chat-split-container--open" : "", sidebarOpen ? "0 0 ".concat(splitRatio * 100, "%") : "1 1 100%", thread, sidebarOpen
        ? (0, lit_1.html)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n              <resizable-divider\n                .splitRatio=", "\n                @resize=", "\n              ></resizable-divider>\n              <div class=\"chat-sidebar\">\n                ", "\n              </div>\n            "], ["\n              <resizable-divider\n                .splitRatio=", "\n                @resize=", "\n              ></resizable-divider>\n              <div class=\"chat-sidebar\">\n                ", "\n              </div>\n            "])), splitRatio, function (e) { var _a; return (_a = props.onSplitRatioChange) === null || _a === void 0 ? void 0 : _a.call(props, e.detail.splitRatio); }, (0, markdown_sidebar_1.renderMarkdownSidebar)({
            content: (_j = props.sidebarContent) !== null && _j !== void 0 ? _j : null,
            error: (_k = props.sidebarError) !== null && _k !== void 0 ? _k : null,
            onClose: props.onCloseSidebar,
            onViewRawText: function () {
                if (!props.sidebarContent || !props.onOpenSidebar) {
                    return;
                }
                props.onOpenSidebar("```\n".concat(props.sidebarContent, "\n```"));
            },
        })) : lit_1.nothing, props.queue.length
        ? (0, lit_1.html)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n            <div class=\"chat-queue\" role=\"status\" aria-live=\"polite\">\n              <div class=\"chat-queue__title\">Queued (", ")</div>\n              <div class=\"chat-queue__list\">\n                ", "\n              </div>\n            </div>\n          "], ["\n            <div class=\"chat-queue\" role=\"status\" aria-live=\"polite\">\n              <div class=\"chat-queue__title\">Queued (", ")</div>\n              <div class=\"chat-queue__list\">\n                ", "\n              </div>\n            </div>\n          "])), props.queue.length, props.queue.map(function (item) {
            var _a;
            return (0, lit_1.html)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n                    <div class=\"chat-queue__item\">\n                      <div class=\"chat-queue__text\">\n                        ", "\n                      </div>\n                      <button\n                        class=\"btn chat-queue__remove\"\n                        type=\"button\"\n                        aria-label=\"Remove queued message\"\n                        @click=", "\n                      >\n                        ", "\n                      </button>\n                    </div>\n                  "], ["\n                    <div class=\"chat-queue__item\">\n                      <div class=\"chat-queue__text\">\n                        ", "\n                      </div>\n                      <button\n                        class=\"btn chat-queue__remove\"\n                        type=\"button\"\n                        aria-label=\"Remove queued message\"\n                        @click=", "\n                      >\n                        ", "\n                      </button>\n                    </div>\n                  "])), item.text ||
                (((_a = item.attachments) === null || _a === void 0 ? void 0 : _a.length) ? "Image (".concat(item.attachments.length, ")") : ""), function () { return props.onQueueRemove(item.id); }, icons_1.icons.x);
        })) : lit_1.nothing, props.showNewMessages
        ? (0, lit_1.html)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n            <button\n              class=\"chat-new-messages\"\n              type=\"button\"\n              @click=", "\n            >\n              New messages ", "\n            </button>\n          "], ["\n            <button\n              class=\"chat-new-messages\"\n              type=\"button\"\n              @click=", "\n            >\n              New messages ", "\n            </button>\n          "])), props.onScrollToBottom, icons_1.icons.arrowDown) : lit_1.nothing, renderAttachmentPreview(props), (0, ref_js_1.ref)(function (el) { return el && adjustTextareaHeight(el); }), props.draft, !props.connected, function (e) {
        if (e.key !== "Enter") {
            return;
        }
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.shiftKey) {
            return;
        } // Allow Shift+Enter for line breaks
        if (!props.connected) {
            return;
        }
        e.preventDefault();
        if (canCompose) {
            props.onSend();
        }
    }, function (e) {
        var target = e.target;
        adjustTextareaHeight(target);
        props.onDraftChange(target.value);
    }, function (e) { return handlePaste(e, props); }, composePlaceholder, !props.connected || (!canAbort && props.sending), canAbort ? props.onAbort : props.onNewSession, canAbort ? "Stop" : "New session", !props.connected, props.onSend, isBusy ? "Queue" : "Send");
}
var CHAT_HISTORY_RENDER_LIMIT = 200;
function groupMessages(items) {
    var result = [];
    var currentGroup = null;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (item.kind !== "message") {
            if (currentGroup) {
                result.push(currentGroup);
                currentGroup = null;
            }
            result.push(item);
            continue;
        }
        var normalized = (0, message_normalizer_1.normalizeMessage)(item.message);
        var role = (0, message_normalizer_1.normalizeRoleForGrouping)(normalized.role);
        var timestamp = normalized.timestamp || Date.now();
        if (!currentGroup || currentGroup.role !== role) {
            if (currentGroup) {
                result.push(currentGroup);
            }
            currentGroup = {
                kind: "group",
                key: "group:".concat(role, ":").concat(item.key),
                role: role,
                messages: [{ message: item.message, key: item.key }],
                timestamp: timestamp,
                isStreaming: false,
            };
        }
        else {
            currentGroup.messages.push({ message: item.message, key: item.key });
        }
    }
    if (currentGroup) {
        result.push(currentGroup);
    }
    return result;
}
function buildChatItems(props) {
    var _a, _b;
    var items = [];
    var history = Array.isArray(props.messages) ? props.messages : [];
    var tools = Array.isArray(props.toolMessages) ? props.toolMessages : [];
    var historyStart = Math.max(0, history.length - CHAT_HISTORY_RENDER_LIMIT);
    if (historyStart > 0) {
        items.push({
            kind: "message",
            key: "chat:history:notice",
            message: {
                role: "system",
                content: "Showing last ".concat(CHAT_HISTORY_RENDER_LIMIT, " messages (").concat(historyStart, " hidden)."),
                timestamp: Date.now(),
            },
        });
    }
    for (var i = historyStart; i < history.length; i++) {
        var msg = history[i];
        var normalized = (0, message_normalizer_1.normalizeMessage)(msg);
        if (!props.showThinking && normalized.role.toLowerCase() === "toolresult") {
            continue;
        }
        items.push({
            kind: "message",
            key: messageKey(msg, i),
            message: msg,
        });
    }
    if (props.showThinking) {
        for (var i = 0; i < tools.length; i++) {
            items.push({
                kind: "message",
                key: messageKey(tools[i], i + history.length),
                message: tools[i],
            });
        }
    }
    if (props.stream !== null) {
        var key = "stream:".concat(props.sessionKey, ":").concat((_a = props.streamStartedAt) !== null && _a !== void 0 ? _a : "live");
        if (props.stream.trim().length > 0) {
            items.push({
                kind: "stream",
                key: key,
                text: props.stream,
                startedAt: (_b = props.streamStartedAt) !== null && _b !== void 0 ? _b : Date.now(),
            });
        }
        else {
            items.push({ kind: "reading-indicator", key: key });
        }
    }
    return groupMessages(items);
}
function messageKey(message, index) {
    var m = message;
    var toolCallId = typeof m.toolCallId === "string" ? m.toolCallId : "";
    if (toolCallId) {
        return "tool:".concat(toolCallId);
    }
    var id = typeof m.id === "string" ? m.id : "";
    if (id) {
        return "msg:".concat(id);
    }
    var messageId = typeof m.messageId === "string" ? m.messageId : "";
    if (messageId) {
        return "msg:".concat(messageId);
    }
    var timestamp = typeof m.timestamp === "number" ? m.timestamp : null;
    var role = typeof m.role === "string" ? m.role : "unknown";
    if (timestamp != null) {
        return "msg:".concat(role, ":").concat(timestamp, ":").concat(index);
    }
    return "msg:".concat(role, ":").concat(index);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
