"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var mod = require("./channel-web.js");
(0, vitest_1.describe)("channel-web barrel", function () {
    (0, vitest_1.it)("exports the expected web helpers", function () {
        (0, vitest_1.expect)(mod.createWaSocket).toBeTypeOf("function");
        (0, vitest_1.expect)(mod.loginWeb).toBeTypeOf("function");
        (0, vitest_1.expect)(mod.monitorWebChannel).toBeTypeOf("function");
        (0, vitest_1.expect)(mod.sendMessageWhatsApp).toBeTypeOf("function");
        (0, vitest_1.expect)(mod.monitorWebInbox).toBeTypeOf("function");
        (0, vitest_1.expect)(mod.pickWebChannel).toBeTypeOf("function");
        (0, vitest_1.expect)(mod.WA_WEB_AUTH_DIR).toBeTruthy();
    });
});
