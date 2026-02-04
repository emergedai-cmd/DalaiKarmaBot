"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var commands_info_js_1 = require("./commands-info.js");
(0, vitest_1.describe)("buildCommandsPaginationKeyboard", function () {
    (0, vitest_1.it)("adds agent id to callback data when provided", function () {
        var keyboard = (0, commands_info_js_1.buildCommandsPaginationKeyboard)(2, 3, "agent-main");
        (0, vitest_1.expect)(keyboard[0]).toEqual([
            { text: "◀ Prev", callback_data: "commands_page_1:agent-main" },
            { text: "2/3", callback_data: "commands_page_noop:agent-main" },
            { text: "Next ▶", callback_data: "commands_page_3:agent-main" },
        ]);
    });
});
