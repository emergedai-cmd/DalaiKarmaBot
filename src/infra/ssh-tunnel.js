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
exports.parseSshTarget = parseSshTarget;
exports.startSshPortForward = startSshPortForward;
var node_child_process_1 = require("node:child_process");
var node_net_1 = require("node:net");
var ports_js_1 = require("./ports.js");
function isErrno(err) {
    return Boolean(err && typeof err === "object" && "code" in err);
}
function parseSshTarget(raw) {
    var trimmed = raw.trim().replace(/^ssh\s+/, "");
    if (!trimmed) {
        return null;
    }
    var _a = trimmed.includes("@")
        ? (function () {
            var idx = trimmed.indexOf("@");
            var user = trimmed.slice(0, idx).trim();
            var host = trimmed.slice(idx + 1).trim();
            return [user || undefined, host];
        })()
        : [undefined, trimmed], userPart = _a[0], hostPart = _a[1];
    var colonIdx = hostPart.lastIndexOf(":");
    if (colonIdx > 0 && colonIdx < hostPart.length - 1) {
        var host = hostPart.slice(0, colonIdx).trim();
        var portRaw = hostPart.slice(colonIdx + 1).trim();
        var port = Number.parseInt(portRaw, 10);
        if (!host || !Number.isFinite(port) || port <= 0) {
            return null;
        }
        // Security: Reject hostnames starting with '-' to prevent argument injection
        if (host.startsWith("-")) {
            return null;
        }
        return { user: userPart, host: host, port: port };
    }
    if (!hostPart) {
        return null;
    }
    // Security: Reject hostnames starting with '-' to prevent argument injection
    if (hostPart.startsWith("-")) {
        return null;
    }
    return { user: userPart, host: hostPart, port: 22 };
}
function pickEphemeralPort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var server = node_net_1.default.createServer();
                        server.once("error", reject);
                        server.listen(0, "127.0.0.1", function () {
                            var addr = server.address();
                            server.close(function () {
                                if (!addr || typeof addr === "string") {
                                    reject(new Error("failed to allocate a local port"));
                                    return;
                                }
                                resolve(addr.port);
                            });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function canConnectLocal(port) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        var socket = node_net_1.default.connect({ host: "127.0.0.1", port: port });
                        var done = function (ok) {
                            socket.removeAllListeners();
                            socket.destroy();
                            resolve(ok);
                        };
                        socket.once("connect", function () { return done(true); });
                        socket.once("error", function () { return done(false); });
                        socket.setTimeout(250, function () { return done(false); });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function waitForLocalListener(port, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var startedAt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startedAt = Date.now();
                    _a.label = 1;
                case 1:
                    if (!(Date.now() - startedAt < timeoutMs)) return [3 /*break*/, 4];
                    return [4 /*yield*/, canConnectLocal(port)];
                case 2:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: throw new Error("ssh tunnel did not start listening on localhost:".concat(port));
            }
        });
    });
}
function startSshPortForward(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, localPort, err_1, userHost, args, stderr, child, stop, err_2, suffix;
        var _this = this;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    parsed = parseSshTarget(opts.target);
                    if (!parsed) {
                        throw new Error("invalid SSH target: ".concat(opts.target));
                    }
                    localPort = opts.localPortPreferred;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 7]);
                    return [4 /*yield*/, (0, ports_js_1.ensurePortAvailable)(localPort)];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 3:
                    err_1 = _d.sent();
                    if (!(isErrno(err_1) && err_1.code === "EADDRINUSE")) return [3 /*break*/, 5];
                    return [4 /*yield*/, pickEphemeralPort()];
                case 4:
                    localPort = _d.sent();
                    return [3 /*break*/, 6];
                case 5: throw err_1;
                case 6: return [3 /*break*/, 7];
                case 7:
                    userHost = parsed.user ? "".concat(parsed.user, "@").concat(parsed.host) : parsed.host;
                    args = [
                        "-N",
                        "-L",
                        "".concat(localPort, ":127.0.0.1:").concat(opts.remotePort),
                        "-p",
                        String(parsed.port),
                        "-o",
                        "ExitOnForwardFailure=yes",
                        "-o",
                        "BatchMode=yes",
                        "-o",
                        "StrictHostKeyChecking=accept-new",
                        "-o",
                        "UpdateHostKeys=yes",
                        "-o",
                        "ConnectTimeout=5",
                        "-o",
                        "ServerAliveInterval=15",
                        "-o",
                        "ServerAliveCountMax=3",
                    ];
                    if ((_a = opts.identity) === null || _a === void 0 ? void 0 : _a.trim()) {
                        args.push("-i", opts.identity.trim());
                    }
                    // Security: Use '--' to prevent userHost from being interpreted as an option
                    args.push("--", userHost);
                    stderr = [];
                    child = (0, node_child_process_1.spawn)("/usr/bin/ssh", args, {
                        stdio: ["ignore", "ignore", "pipe"],
                    });
                    (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.setEncoding("utf8");
                    (_c = child.stderr) === null || _c === void 0 ? void 0 : _c.on("data", function (chunk) {
                        var lines = String(chunk)
                            .split("\n")
                            .map(function (l) { return l.trim(); })
                            .filter(Boolean);
                        stderr.push.apply(stderr, lines);
                    });
                    stop = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (child.killed) {
                                        return [2 /*return*/];
                                    }
                                    child.kill("SIGTERM");
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            var t = setTimeout(function () {
                                                try {
                                                    child.kill("SIGKILL");
                                                }
                                                finally {
                                                    resolve();
                                                }
                                            }, 1500);
                                            child.once("exit", function () {
                                                clearTimeout(t);
                                                resolve();
                                            });
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 10, , 12]);
                    return [4 /*yield*/, Promise.race([
                            waitForLocalListener(localPort, Math.max(250, opts.timeoutMs)),
                            new Promise(function (_, reject) {
                                child.once("exit", function (code, signal) {
                                    reject(new Error("ssh exited (".concat(code !== null && code !== void 0 ? code : "null").concat(signal ? "/".concat(signal) : "", ")")));
                                });
                            }),
                        ])];
                case 9:
                    _d.sent();
                    return [3 /*break*/, 12];
                case 10:
                    err_2 = _d.sent();
                    return [4 /*yield*/, stop()];
                case 11:
                    _d.sent();
                    suffix = stderr.length > 0 ? "\n".concat(stderr.join("\n")) : "";
                    throw new Error("".concat(err_2 instanceof Error ? err_2.message : String(err_2)).concat(suffix), { cause: err_2 });
                case 12: return [2 /*return*/, {
                        parsedTarget: parsed,
                        localPort: localPort,
                        remotePort: opts.remotePort,
                        pid: typeof child.pid === "number" ? child.pid : null,
                        stderr: stderr,
                        stop: stop,
                    }];
            }
        });
    });
}
