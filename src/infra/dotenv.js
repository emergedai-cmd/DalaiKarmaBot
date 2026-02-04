"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDotEnv = loadDotEnv;
var dotenv_1 = require("dotenv");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
function loadDotEnv(opts) {
    var _a;
    var quiet = (_a = opts === null || opts === void 0 ? void 0 : opts.quiet) !== null && _a !== void 0 ? _a : true;
    // Load from process CWD first (dotenv default).
    dotenv_1.default.config({ quiet: quiet });
    // Then load global fallback: ~/.openclaw/.env (or OPENCLAW_STATE_DIR/.env),
    // without overriding any env vars already present.
    var globalEnvPath = node_path_1.default.join((0, utils_js_1.resolveConfigDir)(process.env), ".env");
    if (!node_fs_1.default.existsSync(globalEnvPath)) {
        return;
    }
    dotenv_1.default.config({ quiet: quiet, path: globalEnvPath, override: false });
}
