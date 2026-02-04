#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_process_1 = require("node:process");
var BUNDLED_VERSION = (typeof __OPENCLAW_VERSION__ === "string" && __OPENCLAW_VERSION__) ||
    node_process_1.default.env.OPENCLAW_BUNDLED_VERSION ||
    "0.0.0";
function hasFlag(args, flag) {
    return args.includes(flag);
}
function patchBunLongForProtobuf() {
    return __awaiter(this, void 0, void 0, function () {
        var mod, Long;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Bun ships a global `Long` that protobufjs detects, but it is not long.js and
                    // misses critical APIs (fromBits, ...). Baileys WAProto expects long.js.
                    if (typeof node_process_1.default.versions.bun !== "string") {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("long"); })];
                case 1:
                    mod = _b.sent();
                    Long = (_a = mod.default) !== null && _a !== void 0 ? _a : mod;
                    globalThis.Long = Long;
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, _a, parseRelaySmokeTest, runRelaySmokeTest, smokeTest, err_1, loadDotEnv, ensureOpenClawCliOnPath, enableConsoleCapture, assertSupportedRuntime, formatUncaughtError, installUnhandledRejectionHandler, buildProgram, program;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = node_process_1.default.argv.slice(2);
                    // Swift side expects `--version` to return a plain semver string.
                    if (hasFlag(args, "--version") || hasFlag(args, "-V") || hasFlag(args, "-v")) {
                        console.log(BUNDLED_VERSION);
                        node_process_1.default.exit(0);
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./relay-smoke.js"); })];
                case 1:
                    _a = _b.sent(), parseRelaySmokeTest = _a.parseRelaySmokeTest, runRelaySmokeTest = _a.runRelaySmokeTest;
                    smokeTest = parseRelaySmokeTest(args, node_process_1.default.env);
                    if (!smokeTest) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, runRelaySmokeTest(smokeTest)];
                case 3:
                    _b.sent();
                    node_process_1.default.exit(0);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.error("Relay smoke test failed (".concat(smokeTest, "):"), err_1);
                    node_process_1.default.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, patchBunLongForProtobuf()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/dotenv.js"); })];
                case 7:
                    loadDotEnv = (_b.sent()).loadDotEnv;
                    loadDotEnv({ quiet: true });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/path-env.js"); })];
                case 8:
                    ensureOpenClawCliOnPath = (_b.sent()).ensureOpenClawCliOnPath;
                    ensureOpenClawCliOnPath();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../logging.js"); })];
                case 9:
                    enableConsoleCapture = (_b.sent()).enableConsoleCapture;
                    enableConsoleCapture();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/runtime-guard.js"); })];
                case 10:
                    assertSupportedRuntime = (_b.sent()).assertSupportedRuntime;
                    assertSupportedRuntime();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/errors.js"); })];
                case 11:
                    formatUncaughtError = (_b.sent()).formatUncaughtError;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/unhandled-rejections.js"); })];
                case 12:
                    installUnhandledRejectionHandler = (_b.sent()).installUnhandledRejectionHandler;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../cli/program.js"); })];
                case 13:
                    buildProgram = (_b.sent()).buildProgram;
                    program = buildProgram();
                    installUnhandledRejectionHandler();
                    node_process_1.default.on("uncaughtException", function (error) {
                        console.error("[openclaw] Uncaught exception:", formatUncaughtError(error));
                        node_process_1.default.exit(1);
                    });
                    return [4 /*yield*/, program.parseAsync(node_process_1.default.argv)];
                case 14:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
void main().catch(function (err) {
    var _a;
    console.error("[openclaw] Relay failed:", err instanceof Error ? ((_a = err.stack) !== null && _a !== void 0 ? _a : err.message) : err);
    node_process_1.default.exit(1);
});
