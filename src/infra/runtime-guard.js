"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSemver = parseSemver;
exports.isAtLeast = isAtLeast;
exports.detectRuntime = detectRuntime;
exports.runtimeSatisfies = runtimeSatisfies;
exports.isSupportedNodeVersion = isSupportedNodeVersion;
exports.assertSupportedRuntime = assertSupportedRuntime;
var node_process_1 = require("node:process");
var runtime_js_1 = require("../runtime.js");
var MIN_NODE = { major: 22, minor: 0, patch: 0 };
var SEMVER_RE = /(\d+)\.(\d+)\.(\d+)/;
function parseSemver(version) {
    if (!version) {
        return null;
    }
    var match = version.match(SEMVER_RE);
    if (!match) {
        return null;
    }
    var major = match[1], minor = match[2], patch = match[3];
    return {
        major: Number.parseInt(major, 10),
        minor: Number.parseInt(minor, 10),
        patch: Number.parseInt(patch, 10),
    };
}
function isAtLeast(version, minimum) {
    if (!version) {
        return false;
    }
    if (version.major !== minimum.major) {
        return version.major > minimum.major;
    }
    if (version.minor !== minimum.minor) {
        return version.minor > minimum.minor;
    }
    return version.patch >= minimum.patch;
}
function detectRuntime() {
    var _a, _b, _c, _d, _e;
    var kind = ((_a = node_process_1.default.versions) === null || _a === void 0 ? void 0 : _a.node) ? "node" : "unknown";
    var version = (_c = (_b = node_process_1.default.versions) === null || _b === void 0 ? void 0 : _b.node) !== null && _c !== void 0 ? _c : null;
    return {
        kind: kind,
        version: version,
        execPath: (_d = node_process_1.default.execPath) !== null && _d !== void 0 ? _d : null,
        pathEnv: (_e = node_process_1.default.env.PATH) !== null && _e !== void 0 ? _e : "(not set)",
    };
}
function runtimeSatisfies(details) {
    var parsed = parseSemver(details.version);
    if (details.kind === "node") {
        return isAtLeast(parsed, MIN_NODE);
    }
    return false;
}
function isSupportedNodeVersion(version) {
    return isAtLeast(parseSemver(version), MIN_NODE);
}
function assertSupportedRuntime(runtime, details) {
    var _a, _b;
    if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
    if (details === void 0) { details = detectRuntime(); }
    if (runtimeSatisfies(details)) {
        return;
    }
    var versionLabel = (_a = details.version) !== null && _a !== void 0 ? _a : "unknown";
    var runtimeLabel = details.kind === "unknown" ? "unknown runtime" : "".concat(details.kind, " ").concat(versionLabel);
    var execLabel = (_b = details.execPath) !== null && _b !== void 0 ? _b : "unknown";
    runtime.error([
        "openclaw requires Node >=22.0.0.",
        "Detected: ".concat(runtimeLabel, " (exec: ").concat(execLabel, ")."),
        "PATH searched: ".concat(details.pathEnv),
        "Install Node: https://nodejs.org/en/download",
        "Upgrade Node and re-run openclaw.",
    ].join("\n"));
    runtime.exit(1);
}
