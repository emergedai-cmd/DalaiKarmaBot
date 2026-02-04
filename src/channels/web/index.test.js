"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var impl = require("../../channel-web.js");
var entry = require("./index.js");
(0, vitest_1.describe)("channels/web entrypoint", function () {
    (0, vitest_1.it)("re-exports web channel helpers", function () {
        (0, vitest_1.expect)(entry.createWaSocket).toBe(impl.createWaSocket);
        (0, vitest_1.expect)(entry.loginWeb).toBe(impl.loginWeb);
        (0, vitest_1.expect)(entry.logWebSelfId).toBe(impl.logWebSelfId);
        (0, vitest_1.expect)(entry.monitorWebInbox).toBe(impl.monitorWebInbox);
        (0, vitest_1.expect)(entry.monitorWebChannel).toBe(impl.monitorWebChannel);
        (0, vitest_1.expect)(entry.pickWebChannel).toBe(impl.pickWebChannel);
        (0, vitest_1.expect)(entry.sendMessageWhatsApp).toBe(impl.sendMessageWhatsApp);
        (0, vitest_1.expect)(entry.WA_WEB_AUTH_DIR).toBe(impl.WA_WEB_AUTH_DIR);
        (0, vitest_1.expect)(entry.waitForWaConnection).toBe(impl.waitForWaConnection);
        (0, vitest_1.expect)(entry.webAuthExists).toBe(impl.webAuthExists);
    });
});
