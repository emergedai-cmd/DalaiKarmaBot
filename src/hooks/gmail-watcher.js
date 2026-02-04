"use strict";
/**
 * Gmail Watcher Service
 *
 * Automatically starts `gog gmail watch serve` when the gateway starts,
 * if hooks.gmail is configured with an account.
 */
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
exports.isAddressInUseError = isAddressInUseError;
exports.startGmailWatcher = startGmailWatcher;
exports.stopGmailWatcher = stopGmailWatcher;
exports.isGmailWatcherRunning = isGmailWatcherRunning;
var node_child_process_1 = require("node:child_process");
var skills_js_1 = require("../agents/skills.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var exec_js_1 = require("../process/exec.js");
var gmail_setup_utils_js_1 = require("./gmail-setup-utils.js");
var gmail_js_1 = require("./gmail.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("gmail-watcher");
var ADDRESS_IN_USE_RE = /address already in use|EADDRINUSE/i;
function isAddressInUseError(line) {
    return ADDRESS_IN_USE_RE.test(line);
}
var watcherProcess = null;
var renewInterval = null;
var shuttingDown = false;
var currentConfig = null;
/**
 * Check if gog binary is available
 */
function isGogAvailable() {
    return (0, skills_js_1.hasBinary)("gog");
}
/**
 * Start the Gmail watch (registers with Gmail API)
 */
function startGmailWatch(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var args, result, message, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = __spreadArray(["gog"], (0, gmail_js_1.buildGogWatchStartArgs)(cfg), true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(args, { timeoutMs: 120000 })];
                case 2:
                    result = _a.sent();
                    if (result.code !== 0) {
                        message = result.stderr || result.stdout || "gog watch start failed";
                        log.error("watch start failed: ".concat(message));
                        return [2 /*return*/, false];
                    }
                    log.info("watch started for ".concat(cfg.account));
                    return [2 /*return*/, true];
                case 3:
                    err_1 = _a.sent();
                    log.error("watch start error: ".concat(String(err_1)));
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Spawn the gog gmail watch serve process
 */
function spawnGogServe(cfg) {
    var _a, _b;
    var args = (0, gmail_js_1.buildGogWatchServeArgs)(cfg);
    log.info("starting gog ".concat(args.join(" ")));
    var addressInUse = false;
    var child = (0, node_child_process_1.spawn)("gog", args, {
        stdio: ["ignore", "pipe", "pipe"],
        detached: false,
    });
    (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (data) {
        var line = data.toString().trim();
        if (line) {
            log.info("[gog] ".concat(line));
        }
    });
    (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", function (data) {
        var line = data.toString().trim();
        if (!line) {
            return;
        }
        if (isAddressInUseError(line)) {
            addressInUse = true;
        }
        log.warn("[gog] ".concat(line));
    });
    child.on("error", function (err) {
        log.error("gog process error: ".concat(String(err)));
    });
    child.on("exit", function (code, signal) {
        if (shuttingDown) {
            return;
        }
        if (addressInUse) {
            log.warn("gog serve failed to bind (address already in use); stopping restarts. " +
                "Another watcher is likely running. Set OPENCLAW_SKIP_GMAIL_WATCHER=1 or stop the other process.");
            watcherProcess = null;
            return;
        }
        log.warn("gog exited (code=".concat(code, ", signal=").concat(signal, "); restarting in 5s"));
        watcherProcess = null;
        setTimeout(function () {
            if (shuttingDown || !currentConfig) {
                return;
            }
            watcherProcess = spawnGogServe(currentConfig);
        }, 5000);
    });
    return child;
}
/**
 * Start the Gmail watcher service.
 * Called automatically by the gateway if hooks.gmail is configured.
 */
function startGmailWatcher(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var gogAvailable, resolved, runtimeConfig, err_2, watchStarted, renewMs;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    // Check if gmail hooks are configured
                    if (!((_a = cfg.hooks) === null || _a === void 0 ? void 0 : _a.enabled)) {
                        return [2 /*return*/, { started: false, reason: "hooks not enabled" }];
                    }
                    if (!((_c = (_b = cfg.hooks) === null || _b === void 0 ? void 0 : _b.gmail) === null || _c === void 0 ? void 0 : _c.account)) {
                        return [2 /*return*/, { started: false, reason: "no gmail account configured" }];
                    }
                    gogAvailable = isGogAvailable();
                    if (!gogAvailable) {
                        return [2 /*return*/, { started: false, reason: "gog binary not found" }];
                    }
                    resolved = (0, gmail_js_1.resolveGmailHookRuntimeConfig)(cfg, {});
                    if (!resolved.ok) {
                        return [2 /*return*/, { started: false, reason: resolved.error }];
                    }
                    runtimeConfig = resolved.value;
                    currentConfig = runtimeConfig;
                    if (!(runtimeConfig.tailscale.mode !== "off")) return [3 /*break*/, 4];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureTailscaleEndpoint)({
                            mode: runtimeConfig.tailscale.mode,
                            path: runtimeConfig.tailscale.path,
                            port: runtimeConfig.serve.port,
                            target: runtimeConfig.tailscale.target,
                        })];
                case 2:
                    _d.sent();
                    log.info("tailscale ".concat(runtimeConfig.tailscale.mode, " configured for port ").concat(runtimeConfig.serve.port));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _d.sent();
                    log.error("tailscale setup failed: ".concat(String(err_2)));
                    return [2 /*return*/, {
                            started: false,
                            reason: "tailscale setup failed: ".concat(String(err_2)),
                        }];
                case 4: return [4 /*yield*/, startGmailWatch(runtimeConfig)];
                case 5:
                    watchStarted = _d.sent();
                    if (!watchStarted) {
                        log.warn("gmail watch start failed, but continuing with serve");
                    }
                    // Spawn the gog serve process
                    shuttingDown = false;
                    watcherProcess = spawnGogServe(runtimeConfig);
                    renewMs = runtimeConfig.renewEveryMinutes * 60000;
                    renewInterval = setInterval(function () {
                        if (shuttingDown) {
                            return;
                        }
                        void startGmailWatch(runtimeConfig);
                    }, renewMs);
                    log.info("gmail watcher started for ".concat(runtimeConfig.account, " (renew every ").concat(runtimeConfig.renewEveryMinutes, "m)"));
                    return [2 /*return*/, { started: true }];
            }
        });
    });
}
/**
 * Stop the Gmail watcher service.
 */
function stopGmailWatcher() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shuttingDown = true;
                    if (renewInterval) {
                        clearInterval(renewInterval);
                        renewInterval = null;
                    }
                    if (!watcherProcess) return [3 /*break*/, 2];
                    log.info("stopping gmail watcher");
                    watcherProcess.kill("SIGTERM");
                    // Wait a bit for graceful shutdown
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var timeout = setTimeout(function () {
                                if (watcherProcess) {
                                    watcherProcess.kill("SIGKILL");
                                }
                                resolve();
                            }, 3000);
                            watcherProcess === null || watcherProcess === void 0 ? void 0 : watcherProcess.on("exit", function () {
                                clearTimeout(timeout);
                                resolve();
                            });
                        })];
                case 1:
                    // Wait a bit for graceful shutdown
                    _a.sent();
                    watcherProcess = null;
                    _a.label = 2;
                case 2:
                    currentConfig = null;
                    log.info("gmail watcher stopped");
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if the Gmail watcher is running.
 */
function isGmailWatcherRunning() {
    return watcherProcess !== null && !shuttingDown;
}
