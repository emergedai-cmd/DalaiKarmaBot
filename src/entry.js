#!/usr/bin/env node
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_path_1 = require("node:path");
var node_process_1 = require("node:process");
var profile_js_1 = require("./cli/profile.js");
var env_js_1 = require("./infra/env.js");
var warnings_js_1 = require("./infra/warnings.js");
var child_process_bridge_js_1 = require("./process/child-process-bridge.js");
node_process_1.default.title = ((_b = (_a = node_process_1.default.env.DALAIKARMABOT_LOG_PREFIX) !== null && _a !== void 0 ? _a : node_process_1.default.env.OPENCLAW_LOG_PREFIX) !== null && _b !== void 0 ? _b : "openclaw");
(0, warnings_js_1.installProcessWarningFilter)();
(0, env_js_1.normalizeEnv)();
if (node_process_1.default.argv.includes("--no-color")) {
    node_process_1.default.env.NO_COLOR = "1";
    node_process_1.default.env.FORCE_COLOR = "0";
}
var EXPERIMENTAL_WARNING_FLAG = "--disable-warning=ExperimentalWarning";
function hasExperimentalWarningSuppressed(nodeOptions) {
    if (!nodeOptions) {
        return false;
    }
    return nodeOptions.includes(EXPERIMENTAL_WARNING_FLAG) || nodeOptions.includes("--no-warnings");
}
function ensureExperimentalWarningSuppressed() {
    var _a;
    if ((0, env_js_1.isTruthyEnvValue)(node_process_1.default.env.OPENCLAW_NO_RESPAWN)) {
        return false;
    }
    if ((0, env_js_1.isTruthyEnvValue)(node_process_1.default.env.OPENCLAW_NODE_OPTIONS_READY)) {
        return false;
    }
    var nodeOptions = (_a = node_process_1.default.env.NODE_OPTIONS) !== null && _a !== void 0 ? _a : "";
    if (hasExperimentalWarningSuppressed(nodeOptions)) {
        return false;
    }
    node_process_1.default.env.OPENCLAW_NODE_OPTIONS_READY = "1";
    node_process_1.default.env.NODE_OPTIONS = "".concat(nodeOptions, " ").concat(EXPERIMENTAL_WARNING_FLAG).trim();
    var child = (0, node_child_process_1.spawn)(node_process_1.default.execPath, __spreadArray(__spreadArray([], node_process_1.default.execArgv, true), node_process_1.default.argv.slice(1), true), {
        stdio: "inherit",
        env: node_process_1.default.env,
    });
    (0, child_process_bridge_js_1.attachChildProcessBridge)(child);
    child.once("exit", function (code, signal) {
        if (signal) {
            node_process_1.default.exitCode = 1;
            return;
        }
        node_process_1.default.exit(code !== null && code !== void 0 ? code : 1);
    });
    child.once("error", function (error) {
        var _a, _b;
        console.error("[" + ((_a = node_process_1.default.env.DALAIKARMABOT_LOG_PREFIX) !== null && _a !== void 0 ? _a : "openclaw") + "] Failed to respawn CLI:", error instanceof Error ? ((_b = error.stack) !== null && _b !== void 0 ? _b : error.message) : error);
        node_process_1.default.exit(1);
    });
    // Parent must not continue running the CLI.
    return true;
}
function normalizeWindowsArgv(argv) {
    if (node_process_1.default.platform !== "win32") {
        return argv;
    }
    if (argv.length < 2) {
        return argv;
    }
    var stripControlChars = function (value) {
        var out = "";
        for (var i = 0; i < value.length; i += 1) {
            var code = value.charCodeAt(i);
            if (code >= 32 && code !== 127) {
                out += value[i];
            }
        }
        return out;
    };
    var normalizeArg = function (value) {
        return stripControlChars(value)
            .replace(/^['"]+|['"]+$/g, "")
            .trim();
    };
    var normalizeCandidate = function (value) {
        return normalizeArg(value).replace(/^\\\\\\?\\/, "");
    };
    var execPath = normalizeCandidate(node_process_1.default.execPath);
    var execPathLower = execPath.toLowerCase();
    var execBase = node_path_1.default.basename(execPath).toLowerCase();
    var isExecPath = function (value) {
        if (!value) {
            return false;
        }
        var lower = normalizeCandidate(value).toLowerCase();
        return (lower === execPathLower ||
            node_path_1.default.basename(lower) === execBase ||
            lower.endsWith("\\node.exe") ||
            lower.endsWith("/node.exe") ||
            lower.includes("node.exe"));
    };
    var next = __spreadArray([], argv, true);
    for (var i = 1; i <= 3 && i < next.length;) {
        if (isExecPath(next[i])) {
            next.splice(i, 1);
            continue;
        }
        i += 1;
    }
    var filtered = next.filter(function (arg, index) { return index === 0 || !isExecPath(arg); });
    if (filtered.length < 3) {
        return filtered;
    }
    var cleaned = __spreadArray([], filtered, true);
    for (var i = 2; i < cleaned.length;) {
        var arg = cleaned[i];
        if (!arg || arg.startsWith("-")) {
            i += 1;
            continue;
        }
        if (isExecPath(arg)) {
            cleaned.splice(i, 1);
            continue;
        }
        break;
    }
    return cleaned;
}
node_process_1.default.argv = normalizeWindowsArgv(node_process_1.default.argv);
if (!ensureExperimentalWarningSuppressed()) {
    var parsed = (0, profile_js_1.parseCliProfileArgs)(node_process_1.default.argv);
    if (!parsed.ok) {
        // Keep it simple; Commander will handle rich help/errors after we strip flags.
        console.error("[openclaw] ".concat(parsed.error));
        node_process_1.default.exit(2);
    }
    if (parsed.profile) {
        (0, profile_js_1.applyCliProfileEnv)({ profile: parsed.profile });
        // Keep Commander and ad-hoc argv checks consistent.
        node_process_1.default.argv = parsed.argv;
    }
    Promise.resolve().then(function () { return require("./cli/run-main.js"); }).then(function (_a) {
        var runCli = _a.runCli;
        return runCli(node_process_1.default.argv);
    })
        .catch(function (error) {
        var _a;
        console.error("[openclaw] Failed to start CLI:", error instanceof Error ? ((_a = error.stack) !== null && _a !== void 0 ? _a : error.message) : error);
        node_process_1.default.exitCode = 1;
    });
}
