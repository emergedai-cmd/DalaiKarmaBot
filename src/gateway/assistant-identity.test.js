"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var assistant_identity_js_1 = require("./assistant-identity.js");
(0, vitest_1.describe)("resolveAssistantIdentity avatar normalization", function () {
    (0, vitest_1.it)("drops sentence-like avatar placeholders", function () {
        var cfg = {
            ui: {
                assistant: {
                    avatar: "workspace-relative path, http(s) URL, or data URI",
                },
            },
        };
        (0, vitest_1.expect)((0, assistant_identity_js_1.resolveAssistantIdentity)({ cfg: cfg, workspaceDir: "" }).avatar).toBe(assistant_identity_js_1.DEFAULT_ASSISTANT_IDENTITY.avatar);
    });
    (0, vitest_1.it)("keeps short text avatars", function () {
        var cfg = {
            ui: {
                assistant: {
                    avatar: "PS",
                },
            },
        };
        (0, vitest_1.expect)((0, assistant_identity_js_1.resolveAssistantIdentity)({ cfg: cfg, workspaceDir: "" }).avatar).toBe("PS");
    });
    (0, vitest_1.it)("keeps path avatars", function () {
        var cfg = {
            ui: {
                assistant: {
                    avatar: "avatars/openclaw.png",
                },
            },
        };
        (0, vitest_1.expect)((0, assistant_identity_js_1.resolveAssistantIdentity)({ cfg: cfg, workspaceDir: "" }).avatar).toBe("avatars/openclaw.png");
    });
});
