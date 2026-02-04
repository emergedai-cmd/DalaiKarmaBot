"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var vite_1 = require("vite");
var here = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
function normalizeBase(input) {
    var trimmed = input.trim();
    if (!trimmed) {
        return "/";
    }
    if (trimmed === "./") {
        return "./";
    }
    if (trimmed.endsWith("/")) {
        return trimmed;
    }
    return "".concat(trimmed, "/");
}
exports.default = (0, vite_1.defineConfig)(function () {
    var _a;
    var envBase = (_a = process.env.OPENCLAW_CONTROL_UI_BASE_PATH) === null || _a === void 0 ? void 0 : _a.trim();
    var base = envBase ? normalizeBase(envBase) : "./";
    return {
        base: base,
        publicDir: node_path_1.default.resolve(here, "public"),
        optimizeDeps: {
            include: ["lit/directives/repeat.js"],
        },
        build: {
            outDir: node_path_1.default.resolve(here, "../dist/control-ui"),
            emptyOutDir: true,
            sourcemap: true,
        },
        server: {
            host: true,
            port: 5173,
            strictPort: true,
        },
    };
});
