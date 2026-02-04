"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var identity_file_js_1 = require("./identity-file.js");
(0, vitest_1.describe)("parseIdentityMarkdown", function () {
    (0, vitest_1.it)("ignores identity template placeholders", function () {
        var content = "\n# IDENTITY.md - Who Am I?\n\n- **Name:** *(pick something you like)*\n- **Creature:** *(AI? robot? familiar? ghost in the machine? something weirder?)*\n- **Vibe:** *(how do you come across? sharp? warm? chaotic? calm?)*\n- **Emoji:** *(your signature - pick one that feels right)*\n- **Avatar:** *(workspace-relative path, http(s) URL, or data URI)*\n";
        var parsed = (0, identity_file_js_1.parseIdentityMarkdown)(content);
        (0, vitest_1.expect)(parsed).toEqual({});
    });
    (0, vitest_1.it)("parses explicit identity values", function () {
        var content = "\n- **Name:** Samantha\n- **Creature:** Robot\n- **Vibe:** Warm\n- **Emoji:** :robot:\n- **Avatar:** avatars/openclaw.png\n";
        var parsed = (0, identity_file_js_1.parseIdentityMarkdown)(content);
        (0, vitest_1.expect)(parsed).toEqual({
            name: "Samantha",
            creature: "Robot",
            vibe: "Warm",
            emoji: ":robot:",
            avatar: "avatars/openclaw.png",
        });
    });
});
