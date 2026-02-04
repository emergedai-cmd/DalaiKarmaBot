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
exports.startNgrokTunnel = startNgrokTunnel;
exports.isNgrokAvailable = isNgrokAvailable;
exports.startTailscaleTunnel = startTailscaleTunnel;
exports.startTunnel = startTunnel;
var node_child_process_1 = require("node:child_process");
var webhook_js_1 = require("./webhook.js");
/**
 * Start an ngrok tunnel to expose the local webhook server.
 *
 * Uses the ngrok CLI which must be installed: https://ngrok.com/download
 *
 * @example
 * const tunnel = await startNgrokTunnel({ port: 3334, path: '/voice/webhook' });
 * console.log('Public URL:', tunnel.publicUrl);
 * // Later: await tunnel.stop();
 */
function startNgrokTunnel(config) {
    return __awaiter(this, void 0, void 0, function () {
        var args;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config.authToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, runNgrokCommand(["config", "add-authtoken", config.authToken])];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    args = ["http", String(config.port), "--log", "stdout", "--log-format", "json"];
                    // Add custom domain if provided (paid ngrok feature)
                    if (config.domain) {
                        args.push("--domain", config.domain);
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var proc = (0, node_child_process_1.spawn)("ngrok", args, {
                                stdio: ["ignore", "pipe", "pipe"],
                            });
                            var resolved = false;
                            var publicUrl = null;
                            var outputBuffer = "";
                            var timeout = setTimeout(function () {
                                if (!resolved) {
                                    resolved = true;
                                    proc.kill("SIGTERM");
                                    reject(new Error("ngrok startup timed out (30s)"));
                                }
                            }, 30000);
                            var processLine = function (line) {
                                try {
                                    var log = JSON.parse(line);
                                    // ngrok logs the public URL in a 'started tunnel' message
                                    if (log.msg === "started tunnel" && log.url) {
                                        publicUrl = log.url;
                                    }
                                    // Also check for the URL field directly
                                    if (log.addr && log.url && !publicUrl) {
                                        publicUrl = log.url;
                                    }
                                    // Check for ready state
                                    if (publicUrl && !resolved) {
                                        resolved = true;
                                        clearTimeout(timeout);
                                        // Add path to the public URL
                                        var fullUrl = publicUrl + config.path;
                                        console.log("[voice-call] ngrok tunnel active: ".concat(fullUrl));
                                        resolve({
                                            publicUrl: fullUrl,
                                            provider: "ngrok",
                                            stop: function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            proc.kill("SIGTERM");
                                                            return [4 /*yield*/, new Promise(function (res) {
                                                                    proc.on("close", function () { return res(); });
                                                                    setTimeout(res, 2000); // Fallback timeout
                                                                })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); },
                                        });
                                    }
                                }
                                catch (_a) {
                                    // Not JSON, might be startup message
                                }
                            };
                            proc.stdout.on("data", function (data) {
                                outputBuffer += data.toString();
                                var lines = outputBuffer.split("\n");
                                outputBuffer = lines.pop() || "";
                                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                                    var line = lines_1[_i];
                                    if (line.trim()) {
                                        processLine(line);
                                    }
                                }
                            });
                            proc.stderr.on("data", function (data) {
                                var msg = data.toString();
                                // Check for common errors
                                if (msg.includes("ERR_NGROK")) {
                                    if (!resolved) {
                                        resolved = true;
                                        clearTimeout(timeout);
                                        reject(new Error("ngrok error: ".concat(msg)));
                                    }
                                }
                            });
                            proc.on("error", function (err) {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timeout);
                                    reject(new Error("Failed to start ngrok: ".concat(err.message)));
                                }
                            });
                            proc.on("close", function (code) {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timeout);
                                    reject(new Error("ngrok exited unexpectedly with code ".concat(code)));
                                }
                            });
                        })];
            }
        });
    });
}
/**
 * Run an ngrok command and wait for completion.
 */
function runNgrokCommand(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var proc = (0, node_child_process_1.spawn)("ngrok", args, {
                        stdio: ["ignore", "pipe", "pipe"],
                    });
                    var stdout = "";
                    var stderr = "";
                    proc.stdout.on("data", function (data) {
                        stdout += data.toString();
                    });
                    proc.stderr.on("data", function (data) {
                        stderr += data.toString();
                    });
                    proc.on("close", function (code) {
                        if (code === 0) {
                            resolve(stdout);
                        }
                        else {
                            reject(new Error("ngrok command failed: ".concat(stderr || stdout)));
                        }
                    });
                    proc.on("error", reject);
                })];
        });
    });
}
/**
 * Check if ngrok is installed and available.
 */
function isNgrokAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var proc = (0, node_child_process_1.spawn)("ngrok", ["version"], {
                        stdio: ["ignore", "pipe", "pipe"],
                    });
                    proc.on("close", function (code) {
                        resolve(code === 0);
                    });
                    proc.on("error", function () {
                        resolve(false);
                    });
                })];
        });
    });
}
/**
 * Start a Tailscale serve/funnel tunnel.
 */
function startTailscaleTunnel(config) {
    return __awaiter(this, void 0, void 0, function () {
        var dnsName, path, localUrl;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, webhook_js_1.getTailscaleDnsName)()];
                case 1:
                    dnsName = _a.sent();
                    if (!dnsName) {
                        throw new Error("Could not get Tailscale DNS name. Is Tailscale running?");
                    }
                    path = config.path.startsWith("/") ? config.path : "/".concat(config.path);
                    localUrl = "http://127.0.0.1:".concat(config.port).concat(path);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var proc = (0, node_child_process_1.spawn)("tailscale", [config.mode, "--bg", "--yes", "--set-path", path, localUrl], {
                                stdio: ["ignore", "pipe", "pipe"],
                            });
                            var timeout = setTimeout(function () {
                                proc.kill("SIGKILL");
                                reject(new Error("Tailscale ".concat(config.mode, " timed out")));
                            }, 10000);
                            proc.on("close", function (code) {
                                clearTimeout(timeout);
                                if (code === 0) {
                                    var publicUrl = "https://".concat(dnsName).concat(path);
                                    console.log("[voice-call] Tailscale ".concat(config.mode, " active: ").concat(publicUrl));
                                    resolve({
                                        publicUrl: publicUrl,
                                        provider: "tailscale-".concat(config.mode),
                                        stop: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, stopTailscaleTunnel(config.mode, path)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                    });
                                }
                                else {
                                    reject(new Error("Tailscale ".concat(config.mode, " failed with code ").concat(code)));
                                }
                            });
                            proc.on("error", function (err) {
                                clearTimeout(timeout);
                                reject(err);
                            });
                        })];
            }
        });
    });
}
/**
 * Stop a Tailscale serve/funnel tunnel.
 */
function stopTailscaleTunnel(mode, path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var proc = (0, node_child_process_1.spawn)("tailscale", [mode, "off", path], {
                        stdio: "ignore",
                    });
                    var timeout = setTimeout(function () {
                        proc.kill("SIGKILL");
                        resolve();
                    }, 5000);
                    proc.on("close", function () {
                        clearTimeout(timeout);
                        resolve();
                    });
                })];
        });
    });
}
/**
 * Start a tunnel based on configuration.
 */
function startTunnel(config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (config.provider) {
                case "ngrok":
                    return [2 /*return*/, startNgrokTunnel({
                            port: config.port,
                            path: config.path,
                            authToken: config.ngrokAuthToken,
                            domain: config.ngrokDomain,
                        })];
                case "tailscale-serve":
                    return [2 /*return*/, startTailscaleTunnel({
                            mode: "serve",
                            port: config.port,
                            path: config.path,
                        })];
                case "tailscale-funnel":
                    return [2 /*return*/, startTailscaleTunnel({
                            mode: "funnel",
                            port: config.port,
                            path: config.path,
                        })];
                default:
                    return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
