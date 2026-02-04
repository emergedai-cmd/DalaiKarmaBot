"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        pool: "forks",
        maxWorkers: 1,
        include: ["src/**/*.live.test.ts"],
        setupFiles: ["test/setup.ts"],
        exclude: [
            "dist/**",
            "apps/macos/**",
            "apps/macos/.build/**",
            "**/vendor/**",
            "dist/OpenClaw.app/**",
        ],
    },
});
