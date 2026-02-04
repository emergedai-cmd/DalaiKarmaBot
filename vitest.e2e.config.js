"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_os_1 = require("node:os");
var config_1 = require("vitest/config");
var isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
var cpuCount = node_os_1.default.cpus().length;
var e2eWorkers = isCI ? 2 : Math.min(4, Math.max(1, Math.floor(cpuCount * 0.25)));
exports.default = (0, config_1.defineConfig)({
    test: {
        pool: "forks",
        maxWorkers: e2eWorkers,
        include: ["test/**/*.e2e.test.ts", "src/**/*.e2e.test.ts"],
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
