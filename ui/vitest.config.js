"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser_playwright_1 = require("@vitest/browser-playwright");
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        include: ["src/**/*.test.ts"],
        browser: {
            enabled: true,
            provider: (0, browser_playwright_1.playwright)(),
            instances: [{ browser: "chromium", name: "chromium" }],
            headless: true,
            ui: false,
        },
    },
});
