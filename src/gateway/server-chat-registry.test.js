"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var server_chat_js_1 = require("./server-chat.js");
(0, vitest_1.describe)("chat run registry", function () {
    (0, vitest_1.test)("queues and removes runs per session", function () {
        var _a, _b, _c, _d;
        var registry = (0, server_chat_js_1.createChatRunRegistry)();
        registry.add("s1", { sessionKey: "main", clientRunId: "c1" });
        registry.add("s1", { sessionKey: "main", clientRunId: "c2" });
        (0, vitest_1.expect)((_a = registry.peek("s1")) === null || _a === void 0 ? void 0 : _a.clientRunId).toBe("c1");
        (0, vitest_1.expect)((_b = registry.shift("s1")) === null || _b === void 0 ? void 0 : _b.clientRunId).toBe("c1");
        (0, vitest_1.expect)((_c = registry.peek("s1")) === null || _c === void 0 ? void 0 : _c.clientRunId).toBe("c2");
        (0, vitest_1.expect)((_d = registry.remove("s1", "c2")) === null || _d === void 0 ? void 0 : _d.clientRunId).toBe("c2");
        (0, vitest_1.expect)(registry.peek("s1")).toBeUndefined();
    });
});
