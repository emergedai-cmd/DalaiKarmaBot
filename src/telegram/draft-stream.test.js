"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var draft_stream_js_1 = require("./draft-stream.js");
(0, vitest_1.describe)("createTelegramDraftStream", function () {
    (0, vitest_1.it)("passes message_thread_id when provided", function () {
        var api = { sendMessageDraft: vitest_1.vi.fn().mockResolvedValue(true) };
        var stream = (0, draft_stream_js_1.createTelegramDraftStream)({
            // oxlint-disable-next-line typescript/no-explicit-any
            api: api,
            chatId: 123,
            draftId: 42,
            thread: { id: 99, scope: "forum" },
        });
        stream.update("Hello");
        (0, vitest_1.expect)(api.sendMessageDraft).toHaveBeenCalledWith(123, 42, "Hello", {
            message_thread_id: 99,
        });
    });
    (0, vitest_1.it)("omits message_thread_id for general topic id", function () {
        var api = { sendMessageDraft: vitest_1.vi.fn().mockResolvedValue(true) };
        var stream = (0, draft_stream_js_1.createTelegramDraftStream)({
            // oxlint-disable-next-line typescript/no-explicit-any
            api: api,
            chatId: 123,
            draftId: 42,
            thread: { id: 1, scope: "forum" },
        });
        stream.update("Hello");
        (0, vitest_1.expect)(api.sendMessageDraft).toHaveBeenCalledWith(123, 42, "Hello", undefined);
    });
    (0, vitest_1.it)("keeps message_thread_id for dm threads", function () {
        var api = { sendMessageDraft: vitest_1.vi.fn().mockResolvedValue(true) };
        var stream = (0, draft_stream_js_1.createTelegramDraftStream)({
            // oxlint-disable-next-line typescript/no-explicit-any
            api: api,
            chatId: 123,
            draftId: 42,
            thread: { id: 1, scope: "dm" },
        });
        stream.update("Hello");
        (0, vitest_1.expect)(api.sendMessageDraft).toHaveBeenCalledWith(123, 42, "Hello", {
            message_thread_id: 1,
        });
    });
});
