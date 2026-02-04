"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var control_ui_shared_js_1 = require("./control-ui-shared.js");
(0, vitest_1.describe)("resolveAssistantAvatarUrl", function () {
    (0, vitest_1.it)("normalizes base paths", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.normalizeControlUiBasePath)()).toBe("");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.normalizeControlUiBasePath)("")).toBe("");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.normalizeControlUiBasePath)(" ")).toBe("");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.normalizeControlUiBasePath)("/")).toBe("");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.normalizeControlUiBasePath)("ui")).toBe("/ui");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.normalizeControlUiBasePath)("/ui/")).toBe("/ui");
    });
    (0, vitest_1.it)("builds avatar URLs", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.buildControlUiAvatarUrl)("", "main")).toBe("/avatar/main");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.buildControlUiAvatarUrl)("/ui", "main")).toBe("/ui/avatar/main");
    });
    (0, vitest_1.it)("keeps remote and data URLs", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "https://example.com/avatar.png",
            agentId: "main",
            basePath: "/ui",
        })).toBe("https://example.com/avatar.png");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "data:image/png;base64,abc",
            agentId: "main",
            basePath: "/ui",
        })).toBe("data:image/png;base64,abc");
    });
    (0, vitest_1.it)("prefixes basePath for /avatar endpoints", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "/avatar/main",
            agentId: "main",
            basePath: "/ui",
        })).toBe("/ui/avatar/main");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "/ui/avatar/main",
            agentId: "main",
            basePath: "/ui",
        })).toBe("/ui/avatar/main");
    });
    (0, vitest_1.it)("maps local avatar paths to the avatar endpoint", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "avatars/me.png",
            agentId: "main",
            basePath: "/ui",
        })).toBe("/ui/avatar/main");
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "avatars/profile",
            agentId: "main",
            basePath: "/ui",
        })).toBe("/ui/avatar/main");
    });
    (0, vitest_1.it)("leaves local paths untouched when agentId is missing", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "avatars/me.png",
            basePath: "/ui",
        })).toBe("avatars/me.png");
    });
    (0, vitest_1.it)("keeps short text avatars", function () {
        (0, vitest_1.expect)((0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: "PS",
            agentId: "main",
            basePath: "/ui",
        })).toBe("PS");
    });
});
