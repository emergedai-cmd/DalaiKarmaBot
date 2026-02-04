"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var registry_js_1 = require("./registry.js");
(0, vitest_1.describe)("channel registry", function () {
    (0, vitest_1.it)("normalizes aliases", function () {
        (0, vitest_1.expect)((0, registry_js_1.normalizeChatChannelId)("imsg")).toBe("imessage");
        (0, vitest_1.expect)((0, registry_js_1.normalizeChatChannelId)("gchat")).toBe("googlechat");
        (0, vitest_1.expect)((0, registry_js_1.normalizeChatChannelId)("google-chat")).toBe("googlechat");
        (0, vitest_1.expect)((0, registry_js_1.normalizeChatChannelId)("web")).toBeNull();
    });
    (0, vitest_1.it)("keeps Telegram first in the default order", function () {
        var _a;
        var channels = (0, registry_js_1.listChatChannels)();
        (0, vitest_1.expect)((_a = channels[0]) === null || _a === void 0 ? void 0 : _a.id).toBe("telegram");
    });
    (0, vitest_1.it)("does not include MS Teams by default", function () {
        var channels = (0, registry_js_1.listChatChannels)();
        (0, vitest_1.expect)(channels.some(function (channel) { return channel.id === "msteams"; })).toBe(false);
    });
    (0, vitest_1.it)("formats selection lines with docs labels", function () {
        var channels = (0, registry_js_1.listChatChannels)();
        var first = channels[0];
        if (!first) {
            throw new Error("Missing channel metadata.");
        }
        var line = (0, registry_js_1.formatChannelSelectionLine)(first, function (path, label) {
            return [label, path].filter(Boolean).join(":");
        });
        (0, vitest_1.expect)(line).not.toContain("Docs:");
        (0, vitest_1.expect)(line).toContain("/channels/telegram");
        (0, vitest_1.expect)(line).toContain("https://openclaw.ai");
    });
});
