#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForever = exports.toWhatsappJid = exports.saveSessionStore = exports.runExec = exports.runCommandWithTimeout = exports.resolveStorePath = exports.resolveSessionKey = exports.promptYesNo = exports.PortInUseError = exports.normalizeE164 = exports.monitorWebChannel = exports.loadSessionStore = exports.loadConfig = exports.handlePortError = exports.getReplyFromConfig = exports.ensurePortAvailable = exports.ensureBinary = exports.describePortOwner = exports.deriveSessionKey = exports.createDefaultDeps = exports.applyTemplate = exports.assertWebChannel = void 0;
var node_process_1 = require("node:process");
var node_url_1 = require("node:url");
var reply_js_1 = require("./auto-reply/reply.js");
Object.defineProperty(exports, "getReplyFromConfig", { enumerable: true, get: function () { return reply_js_1.getReplyFromConfig; } });
var templating_js_1 = require("./auto-reply/templating.js");
Object.defineProperty(exports, "applyTemplate", { enumerable: true, get: function () { return templating_js_1.applyTemplate; } });
var channel_web_js_1 = require("./channel-web.js");
Object.defineProperty(exports, "monitorWebChannel", { enumerable: true, get: function () { return channel_web_js_1.monitorWebChannel; } });
var deps_js_1 = require("./cli/deps.js");
Object.defineProperty(exports, "createDefaultDeps", { enumerable: true, get: function () { return deps_js_1.createDefaultDeps; } });
var prompt_js_1 = require("./cli/prompt.js");
Object.defineProperty(exports, "promptYesNo", { enumerable: true, get: function () { return prompt_js_1.promptYesNo; } });
var wait_js_1 = require("./cli/wait.js");
Object.defineProperty(exports, "waitForever", { enumerable: true, get: function () { return wait_js_1.waitForever; } });
var config_js_1 = require("./config/config.js");
Object.defineProperty(exports, "loadConfig", { enumerable: true, get: function () { return config_js_1.loadConfig; } });
var sessions_js_1 = require("./config/sessions.js");
Object.defineProperty(exports, "deriveSessionKey", { enumerable: true, get: function () { return sessions_js_1.deriveSessionKey; } });
Object.defineProperty(exports, "loadSessionStore", { enumerable: true, get: function () { return sessions_js_1.loadSessionStore; } });
Object.defineProperty(exports, "resolveSessionKey", { enumerable: true, get: function () { return sessions_js_1.resolveSessionKey; } });
Object.defineProperty(exports, "resolveStorePath", { enumerable: true, get: function () { return sessions_js_1.resolveStorePath; } });
Object.defineProperty(exports, "saveSessionStore", { enumerable: true, get: function () { return sessions_js_1.saveSessionStore; } });
var binaries_js_1 = require("./infra/binaries.js");
Object.defineProperty(exports, "ensureBinary", { enumerable: true, get: function () { return binaries_js_1.ensureBinary; } });
var dotenv_js_1 = require("./infra/dotenv.js");
var env_js_1 = require("./infra/env.js");
var errors_js_1 = require("./infra/errors.js");
var is_main_js_1 = require("./infra/is-main.js");
var path_env_js_1 = require("./infra/path-env.js");
var ports_js_1 = require("./infra/ports.js");
Object.defineProperty(exports, "describePortOwner", { enumerable: true, get: function () { return ports_js_1.describePortOwner; } });
Object.defineProperty(exports, "ensurePortAvailable", { enumerable: true, get: function () { return ports_js_1.ensurePortAvailable; } });
Object.defineProperty(exports, "handlePortError", { enumerable: true, get: function () { return ports_js_1.handlePortError; } });
Object.defineProperty(exports, "PortInUseError", { enumerable: true, get: function () { return ports_js_1.PortInUseError; } });
var runtime_guard_js_1 = require("./infra/runtime-guard.js");
var unhandled_rejections_js_1 = require("./infra/unhandled-rejections.js");
var logging_js_1 = require("./logging.js");
var exec_js_1 = require("./process/exec.js");
Object.defineProperty(exports, "runCommandWithTimeout", { enumerable: true, get: function () { return exec_js_1.runCommandWithTimeout; } });
Object.defineProperty(exports, "runExec", { enumerable: true, get: function () { return exec_js_1.runExec; } });
var utils_js_1 = require("./utils.js");
Object.defineProperty(exports, "assertWebChannel", { enumerable: true, get: function () { return utils_js_1.assertWebChannel; } });
Object.defineProperty(exports, "normalizeE164", { enumerable: true, get: function () { return utils_js_1.normalizeE164; } });
Object.defineProperty(exports, "toWhatsappJid", { enumerable: true, get: function () { return utils_js_1.toWhatsappJid; } });
(0, dotenv_js_1.loadDotEnv)({ quiet: true });
(0, env_js_1.normalizeEnv)();
(0, path_env_js_1.ensureOpenClawCliOnPath)();
// Capture all console output into structured logs while keeping stdout/stderr behavior.
(0, logging_js_1.enableConsoleCapture)();
// Enforce the minimum supported runtime before doing any work.
(0, runtime_guard_js_1.assertSupportedRuntime)();
var program_js_1 = require("./cli/program.js");
var program = (0, program_js_1.buildProgram)();
var isMain = (0, is_main_js_1.isMainModule)({
    currentFile: (0, node_url_1.fileURLToPath)(import.meta.url),
});
if (isMain) {
    // Global error handlers to prevent silent crashes from unhandled rejections/exceptions.
    // These log the error and exit gracefully instead of crashing without trace.
    (0, unhandled_rejections_js_1.installUnhandledRejectionHandler)();
    node_process_1.default.on("uncaughtException", function (error) {
        console.error("[openclaw] Uncaught exception:", (0, errors_js_1.formatUncaughtError)(error));
        node_process_1.default.exit(1);
    });
    void program.parseAsync(node_process_1.default.argv).catch(function (err) {
        console.error("[openclaw] CLI failed:", (0, errors_js_1.formatUncaughtError)(err));
        node_process_1.default.exit(1);
    });
}
