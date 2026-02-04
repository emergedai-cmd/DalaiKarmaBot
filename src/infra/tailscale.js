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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTailscaleBinary = findTailscaleBinary;
exports.getTailnetHostname = getTailnetHostname;
exports.getTailscaleBinary = getTailscaleBinary;
exports.readTailscaleStatusJson = readTailscaleStatusJson;
exports.ensureGoInstalled = ensureGoInstalled;
exports.ensureTailscaledInstalled = ensureTailscaledInstalled;
exports.ensureFunnel = ensureFunnel;
exports.enableTailscaleServe = enableTailscaleServe;
exports.disableTailscaleServe = disableTailscaleServe;
exports.enableTailscaleFunnel = enableTailscaleFunnel;
exports.disableTailscaleFunnel = disableTailscaleFunnel;
exports.readTailscaleWhoisIdentity = readTailscaleWhoisIdentity;
var node_fs_1 = require("node:fs");
var command_format_js_1 = require("../cli/command-format.js");
var prompt_js_1 = require("../cli/prompt.js");
var globals_js_1 = require("../globals.js");
var exec_js_1 = require("../process/exec.js");
var runtime_js_1 = require("../runtime.js");
var theme_js_1 = require("../terminal/theme.js");
var binaries_js_1 = require("./binaries.js");
function parsePossiblyNoisyJsonObject(stdout) {
    var trimmed = stdout.trim();
    var start = trimmed.indexOf("{");
    var end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
        return JSON.parse(trimmed.slice(start, end + 1));
    }
    return JSON.parse(trimmed);
}
/**
 * Locate Tailscale binary using multiple strategies:
 * 1. PATH lookup (via which command)
 * 2. Known macOS app path
 * 3. find /Applications for Tailscale.app
 * 4. locate database (if available)
 *
 * @returns Path to Tailscale binary or null if not found
 */
function findTailscaleBinary() {
    return __awaiter(this, void 0, void 0, function () {
        var checkBinary, stdout, fromPath, _a, _b, macAppPath, stdout, found, _c, _d, stdout, candidates, _i, candidates_1, candidate, _e;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    checkBinary = function (path) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!path || !(0, node_fs_1.existsSync)(path)) {
                                        return [2 /*return*/, false];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    // Use Promise.race with runExec to implement timeout
                                    return [4 /*yield*/, Promise.race([
                                            (0, exec_js_1.runExec)(path, ["--version"], { timeoutMs: 3000 }),
                                            new Promise(function (_, reject) { return setTimeout(function () { return reject(new Error("timeout")); }, 3000); }),
                                        ])];
                                case 2:
                                    // Use Promise.race with runExec to implement timeout
                                    _b.sent();
                                    return [2 /*return*/, true];
                                case 3:
                                    _a = _b.sent();
                                    return [2 /*return*/, false];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, exec_js_1.runExec)("which", ["tailscale"])];
                case 2:
                    stdout = (_f.sent()).stdout;
                    fromPath = stdout.trim();
                    _a = fromPath;
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkBinary(fromPath)];
                case 3:
                    _a = (_f.sent());
                    _f.label = 4;
                case 4:
                    if (_a) {
                        return [2 /*return*/, fromPath];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    _b = _f.sent();
                    return [3 /*break*/, 6];
                case 6:
                    macAppPath = "/Applications/Tailscale.app/Contents/MacOS/Tailscale";
                    return [4 /*yield*/, checkBinary(macAppPath)];
                case 7:
                    if (_f.sent()) {
                        return [2 /*return*/, macAppPath];
                    }
                    _f.label = 8;
                case 8:
                    _f.trys.push([8, 12, , 13]);
                    return [4 /*yield*/, (0, exec_js_1.runExec)("find", [
                            "/Applications",
                            "-maxdepth",
                            "3",
                            "-name",
                            "Tailscale",
                            "-path",
                            "*/Tailscale.app/Contents/MacOS/Tailscale",
                        ], { timeoutMs: 5000 })];
                case 9:
                    stdout = (_f.sent()).stdout;
                    found = stdout.trim().split("\n")[0];
                    _c = found;
                    if (!_c) return [3 /*break*/, 11];
                    return [4 /*yield*/, checkBinary(found)];
                case 10:
                    _c = (_f.sent());
                    _f.label = 11;
                case 11:
                    if (_c) {
                        return [2 /*return*/, found];
                    }
                    return [3 /*break*/, 13];
                case 12:
                    _d = _f.sent();
                    return [3 /*break*/, 13];
                case 13:
                    _f.trys.push([13, 19, , 20]);
                    return [4 /*yield*/, (0, exec_js_1.runExec)("locate", ["Tailscale.app"])];
                case 14:
                    stdout = (_f.sent()).stdout;
                    candidates = stdout
                        .trim()
                        .split("\n")
                        .filter(function (line) { return line.includes("/Tailscale.app/Contents/MacOS/Tailscale"); });
                    _i = 0, candidates_1 = candidates;
                    _f.label = 15;
                case 15:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 18];
                    candidate = candidates_1[_i];
                    return [4 /*yield*/, checkBinary(candidate)];
                case 16:
                    if (_f.sent()) {
                        return [2 /*return*/, candidate];
                    }
                    _f.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 15];
                case 18: return [3 /*break*/, 20];
                case 19:
                    _e = _f.sent();
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/, null];
            }
        });
    });
}
function getTailnetHostname() {
    return __awaiter(this, arguments, void 0, function (exec, detectedBinary) {
        var candidates, lastError, _i, candidates_2, candidate, stdout, parsed, self_1, dns, ips, err_1;
        var _a;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    candidates = detectedBinary
                        ? [detectedBinary]
                        : ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
                    _i = 0, candidates_2 = candidates;
                    _b.label = 1;
                case 1:
                    if (!(_i < candidates_2.length)) return [3 /*break*/, 6];
                    candidate = candidates_2[_i];
                    if (candidate.startsWith("/") && !(0, node_fs_1.existsSync)(candidate)) {
                        return [3 /*break*/, 5];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, exec(candidate, ["status", "--json"], {
                            timeoutMs: 5000,
                            maxBuffer: 400000,
                        })];
                case 3:
                    stdout = (_b.sent()).stdout;
                    parsed = stdout ? parsePossiblyNoisyJsonObject(stdout) : {};
                    self_1 = typeof parsed.Self === "object" && parsed.Self !== null
                        ? parsed.Self
                        : undefined;
                    dns = typeof (self_1 === null || self_1 === void 0 ? void 0 : self_1.DNSName) === "string" ? self_1.DNSName : undefined;
                    ips = Array.isArray(self_1 === null || self_1 === void 0 ? void 0 : self_1.TailscaleIPs)
                        ? ((_a = parsed.Self.TailscaleIPs) !== null && _a !== void 0 ? _a : [])
                        : [];
                    if (dns && dns.length > 0) {
                        return [2 /*return*/, dns.replace(/\.$/, "")];
                    }
                    if (ips.length > 0) {
                        return [2 /*return*/, ips[0]];
                    }
                    throw new Error("Could not determine Tailscale DNS or IP");
                case 4:
                    err_1 = _b.sent();
                    lastError = err_1;
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: throw lastError !== null && lastError !== void 0 ? lastError : new Error("Could not determine Tailscale DNS or IP");
            }
        });
    });
}
/**
 * Get the Tailscale binary command to use.
 * Returns a cached detected binary or the default "tailscale" command.
 */
var cachedTailscaleBinary = null;
function getTailscaleBinary() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cachedTailscaleBinary) {
                        return [2 /*return*/, cachedTailscaleBinary];
                    }
                    return [4 /*yield*/, findTailscaleBinary()];
                case 1:
                    cachedTailscaleBinary = _a.sent();
                    return [2 /*return*/, cachedTailscaleBinary !== null && cachedTailscaleBinary !== void 0 ? cachedTailscaleBinary : "tailscale"];
            }
        });
    });
}
function readTailscaleStatusJson() {
    return __awaiter(this, arguments, void 0, function (exec, opts) {
        var tailscaleBin, stdout;
        var _a;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getTailscaleBinary()];
                case 1:
                    tailscaleBin = _b.sent();
                    return [4 /*yield*/, exec(tailscaleBin, ["status", "--json"], {
                            timeoutMs: (_a = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _a !== void 0 ? _a : 5000,
                            maxBuffer: 400000,
                        })];
                case 2:
                    stdout = (_b.sent()).stdout;
                    return [2 /*return*/, stdout ? parsePossiblyNoisyJsonObject(stdout) : {}];
            }
        });
    });
}
function ensureGoInstalled() {
    return __awaiter(this, arguments, void 0, function (exec, prompt, runtime) {
        var hasGo, install;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        if (prompt === void 0) { prompt = prompt_js_1.promptYesNo; }
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec("go", ["version"]).then(function () { return true; }, function () { return false; })];
                case 1:
                    hasGo = _a.sent();
                    if (hasGo) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, prompt("Go is not installed. Install via Homebrew (brew install go)?", true)];
                case 2:
                    install = _a.sent();
                    if (!install) {
                        runtime.error("Go is required to build tailscaled from source. Aborting.");
                        runtime.exit(1);
                    }
                    (0, globals_js_1.logVerbose)("Installing Go via Homebrew…");
                    return [4 /*yield*/, exec("brew", ["install", "go"])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureTailscaledInstalled() {
    return __awaiter(this, arguments, void 0, function (exec, prompt, runtime) {
        var hasTailscaled, install;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        if (prompt === void 0) { prompt = prompt_js_1.promptYesNo; }
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec("tailscaled", ["--version"]).then(function () { return true; }, function () { return false; })];
                case 1:
                    hasTailscaled = _a.sent();
                    if (hasTailscaled) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, prompt("tailscaled not found. Install via Homebrew (tailscale package)?", true)];
                case 2:
                    install = _a.sent();
                    if (!install) {
                        runtime.error("tailscaled is required for user-space funnel. Aborting.");
                        runtime.exit(1);
                    }
                    (0, globals_js_1.logVerbose)("Installing tailscaled via Homebrew…");
                    return [4 /*yield*/, exec("brew", ["install", "tailscale"])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var whoisCache = new Map();
function extractExecErrorText(err) {
    var errOutput = err;
    var stdout = typeof errOutput.stdout === "string" ? errOutput.stdout : "";
    var stderr = typeof errOutput.stderr === "string" ? errOutput.stderr : "";
    var message = typeof errOutput.message === "string" ? errOutput.message : "";
    var code = typeof errOutput.code === "string" ? errOutput.code : "";
    return { stdout: stdout, stderr: stderr, message: message, code: code };
}
function isPermissionDeniedError(err) {
    var _a = extractExecErrorText(err), stdout = _a.stdout, stderr = _a.stderr, message = _a.message, code = _a.code;
    if (code.toUpperCase() === "EACCES") {
        return true;
    }
    var combined = "".concat(stdout, "\n").concat(stderr, "\n").concat(message).toLowerCase();
    return (combined.includes("permission denied") ||
        combined.includes("access denied") ||
        combined.includes("operation not permitted") ||
        combined.includes("not permitted") ||
        combined.includes("requires root") ||
        combined.includes("must be run as root") ||
        combined.includes("must be run with sudo") ||
        combined.includes("requires sudo") ||
        combined.includes("need sudo"));
}
// Helper to attempt a command, and retry with sudo if it fails.
function execWithSudoFallback(exec, bin, args, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2, sudoErr_1, _a, stderr, message, detail;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 7]);
                    return [4 /*yield*/, exec(bin, args, opts)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    err_2 = _b.sent();
                    if (!isPermissionDeniedError(err_2)) {
                        throw err_2;
                    }
                    (0, globals_js_1.logVerbose)("Command failed, retrying with sudo: ".concat(bin, " ").concat(args.join(" ")));
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, exec("sudo", __spreadArray(["-n", bin], args, true), opts)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5:
                    sudoErr_1 = _b.sent();
                    _a = extractExecErrorText(sudoErr_1), stderr = _a.stderr, message = _a.message;
                    detail = (stderr || message).trim();
                    if (detail) {
                        (0, globals_js_1.logVerbose)("Sudo retry failed: ".concat(detail));
                    }
                    throw err_2;
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function ensureFunnel(port_1) {
    return __awaiter(this, arguments, void 0, function (port, exec, runtime, prompt) {
        var tailscaleBin, statusOut, parsed, proceed, stdout, err_3, errOutput, stdout, stderr, linkMatch, rich;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        if (prompt === void 0) { prompt = prompt_js_1.promptYesNo; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, getTailscaleBinary()];
                case 1:
                    tailscaleBin = _a.sent();
                    return [4 /*yield*/, exec(tailscaleBin, ["funnel", "status", "--json"])];
                case 2:
                    statusOut = (_a.sent()).stdout.trim();
                    parsed = statusOut ? JSON.parse(statusOut) : {};
                    if (!(!parsed || Object.keys(parsed).length === 0)) return [3 /*break*/, 7];
                    runtime.error((0, globals_js_1.danger)("Tailscale Funnel is not enabled on this tailnet/device."));
                    runtime.error((0, globals_js_1.info)("Enable in admin console: https://login.tailscale.com/admin (see https://tailscale.com/kb/1223/funnel)"));
                    runtime.error((0, globals_js_1.info)("macOS user-space tailscaled docs: https://github.com/tailscale/tailscale/wiki/Tailscaled-on-macOS"));
                    return [4 /*yield*/, prompt("Attempt local setup with user-space tailscaled?", true)];
                case 3:
                    proceed = _a.sent();
                    if (!proceed) {
                        runtime.exit(1);
                    }
                    return [4 /*yield*/, (0, binaries_js_1.ensureBinary)("brew", exec, runtime)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, ensureGoInstalled(exec, prompt, runtime)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, ensureTailscaledInstalled(exec, prompt, runtime)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    (0, globals_js_1.logVerbose)("Enabling funnel on port ".concat(port, "\u2026"));
                    return [4 /*yield*/, execWithSudoFallback(exec, tailscaleBin, ["funnel", "--yes", "--bg", "".concat(port)], {
                            maxBuffer: 200000,
                            timeoutMs: 15000,
                        })];
                case 8:
                    stdout = (_a.sent()).stdout;
                    if (stdout.trim()) {
                        console.log(stdout.trim());
                    }
                    return [3 /*break*/, 10];
                case 9:
                    err_3 = _a.sent();
                    errOutput = err_3;
                    stdout = typeof errOutput.stdout === "string" ? errOutput.stdout : "";
                    stderr = typeof errOutput.stderr === "string" ? errOutput.stderr : "";
                    if (stdout.includes("Funnel is not enabled")) {
                        console.error((0, globals_js_1.danger)("Funnel is not enabled on this tailnet/device."));
                        linkMatch = stdout.match(/https?:\/\/\S+/);
                        if (linkMatch) {
                            console.error((0, globals_js_1.info)("Enable it here: ".concat(linkMatch[0])));
                        }
                        else {
                            console.error((0, globals_js_1.info)("Enable in admin console: https://login.tailscale.com/admin (see https://tailscale.com/kb/1223/funnel)"));
                        }
                    }
                    if (stderr.includes("client version") || stdout.includes("client version")) {
                        console.error((0, globals_js_1.warn)("Tailscale client/server version mismatch detected; try updating tailscale/tailscaled."));
                    }
                    runtime.error("Failed to enable Tailscale Funnel. Is it allowed on your tailnet?");
                    runtime.error((0, globals_js_1.info)("Tip: Funnel is optional for OpenClaw. You can keep running the web gateway without it: `".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway"), "`")));
                    if ((0, globals_js_1.shouldLogVerbose)()) {
                        rich = (0, theme_js_1.isRich)();
                        if (stdout.trim()) {
                            runtime.error((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "stdout: ".concat(stdout.trim())));
                        }
                        if (stderr.trim()) {
                            runtime.error((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "stderr: ".concat(stderr.trim())));
                        }
                        runtime.error(err_3);
                    }
                    runtime.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function enableTailscaleServe(port_1) {
    return __awaiter(this, arguments, void 0, function (port, exec) {
        var tailscaleBin;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTailscaleBinary()];
                case 1:
                    tailscaleBin = _a.sent();
                    return [4 /*yield*/, execWithSudoFallback(exec, tailscaleBin, ["serve", "--bg", "--yes", "".concat(port)], {
                            maxBuffer: 200000,
                            timeoutMs: 15000,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function disableTailscaleServe() {
    return __awaiter(this, arguments, void 0, function (exec) {
        var tailscaleBin;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTailscaleBinary()];
                case 1:
                    tailscaleBin = _a.sent();
                    return [4 /*yield*/, execWithSudoFallback(exec, tailscaleBin, ["serve", "reset"], {
                            maxBuffer: 200000,
                            timeoutMs: 15000,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function enableTailscaleFunnel(port_1) {
    return __awaiter(this, arguments, void 0, function (port, exec) {
        var tailscaleBin;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTailscaleBinary()];
                case 1:
                    tailscaleBin = _a.sent();
                    return [4 /*yield*/, execWithSudoFallback(exec, tailscaleBin, ["funnel", "--bg", "--yes", "".concat(port)], {
                            maxBuffer: 200000,
                            timeoutMs: 15000,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function disableTailscaleFunnel() {
    return __awaiter(this, arguments, void 0, function (exec) {
        var tailscaleBin;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTailscaleBinary()];
                case 1:
                    tailscaleBin = _a.sent();
                    return [4 /*yield*/, execWithSudoFallback(exec, tailscaleBin, ["funnel", "reset"], {
                            maxBuffer: 200000,
                            timeoutMs: 15000,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function readRecord(value) {
    return value && typeof value === "object" ? value : null;
}
function parseWhoisIdentity(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var userProfile = (_b = (_a = readRecord(payload.UserProfile)) !== null && _a !== void 0 ? _a : readRecord(payload.userProfile)) !== null && _b !== void 0 ? _b : readRecord(payload.User);
    var login = (_f = (_e = (_d = (_c = getString(userProfile === null || userProfile === void 0 ? void 0 : userProfile.LoginName)) !== null && _c !== void 0 ? _c : getString(userProfile === null || userProfile === void 0 ? void 0 : userProfile.Login)) !== null && _d !== void 0 ? _d : getString(userProfile === null || userProfile === void 0 ? void 0 : userProfile.login)) !== null && _e !== void 0 ? _e : getString(payload.LoginName)) !== null && _f !== void 0 ? _f : getString(payload.login);
    if (!login) {
        return null;
    }
    var name = (_k = (_j = (_h = (_g = getString(userProfile === null || userProfile === void 0 ? void 0 : userProfile.DisplayName)) !== null && _g !== void 0 ? _g : getString(userProfile === null || userProfile === void 0 ? void 0 : userProfile.Name)) !== null && _h !== void 0 ? _h : getString(userProfile === null || userProfile === void 0 ? void 0 : userProfile.displayName)) !== null && _j !== void 0 ? _j : getString(payload.DisplayName)) !== null && _k !== void 0 ? _k : getString(payload.name);
    return { login: login, name: name };
}
function readCachedWhois(ip, now) {
    var cached = whoisCache.get(ip);
    if (!cached) {
        return undefined;
    }
    if (cached.expiresAt <= now) {
        whoisCache.delete(ip);
        return undefined;
    }
    return cached.value;
}
function writeCachedWhois(ip, value, ttlMs) {
    whoisCache.set(ip, { value: value, expiresAt: Date.now() + ttlMs });
}
function readTailscaleWhoisIdentity(ip_1) {
    return __awaiter(this, arguments, void 0, function (ip, exec, opts) {
        var normalized, now, cached, cacheTtlMs, errorTtlMs, tailscaleBin, stdout, parsed, identity, _a;
        var _b, _c, _d;
        if (exec === void 0) { exec = exec_js_1.runExec; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    normalized = ip.trim();
                    if (!normalized) {
                        return [2 /*return*/, null];
                    }
                    now = Date.now();
                    cached = readCachedWhois(normalized, now);
                    if (cached !== undefined) {
                        return [2 /*return*/, cached];
                    }
                    cacheTtlMs = (_b = opts === null || opts === void 0 ? void 0 : opts.cacheTtlMs) !== null && _b !== void 0 ? _b : 60000;
                    errorTtlMs = (_c = opts === null || opts === void 0 ? void 0 : opts.errorTtlMs) !== null && _c !== void 0 ? _c : 5000;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, getTailscaleBinary()];
                case 2:
                    tailscaleBin = _e.sent();
                    return [4 /*yield*/, exec(tailscaleBin, ["whois", "--json", normalized], {
                            timeoutMs: (_d = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _d !== void 0 ? _d : 5000,
                            maxBuffer: 200000,
                        })];
                case 3:
                    stdout = (_e.sent()).stdout;
                    parsed = stdout ? parsePossiblyNoisyJsonObject(stdout) : {};
                    identity = parseWhoisIdentity(parsed);
                    writeCachedWhois(normalized, identity, cacheTtlMs);
                    return [2 /*return*/, identity];
                case 4:
                    _a = _e.sent();
                    writeCachedWhois(normalized, null, errorTtlMs);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
