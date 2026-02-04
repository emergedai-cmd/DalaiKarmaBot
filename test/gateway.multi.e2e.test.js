"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var node_child_process_1 = require("node:child_process");
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_http_1 = require("node:http");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var client_js_1 = require("../src/gateway/client.js");
var device_identity_js_1 = require("../src/infra/device-identity.js");
var message_channel_js_1 = require("../src/utils/message-channel.js");
var GATEWAY_START_TIMEOUT_MS = 45000;
var E2E_TIMEOUT_MS = 120000;
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var getFreePort = function () { return __awaiter(void 0, void 0, void 0, function () {
    var srv, addr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srv = node_net_1.default.createServer();
                return [4 /*yield*/, new Promise(function (resolve) { return srv.listen(0, "127.0.0.1", resolve); })];
            case 1:
                _a.sent();
                addr = srv.address();
                if (!addr || typeof addr === "string") {
                    srv.close();
                    throw new Error("failed to bind ephemeral port");
                }
                return [4 /*yield*/, new Promise(function (resolve) { return srv.close(function () { return resolve(); }); })];
            case 2:
                _a.sent();
                return [2 /*return*/, addr.port];
        }
    });
}); };
var waitForPortOpen = function (proc, chunksOut, chunksErr, port, timeoutMs) { return __awaiter(void 0, void 0, void 0, function () {
    var startedAt, stdout_1, stderr_1, _a, stdout, stderr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                startedAt = Date.now();
                _b.label = 1;
            case 1:
                if (!(Date.now() - startedAt < timeoutMs)) return [3 /*break*/, 7];
                if (proc.exitCode !== null) {
                    stdout_1 = chunksOut.join("");
                    stderr_1 = chunksErr.join("");
                    throw new Error("gateway exited before listening (code=".concat(String(proc.exitCode), " signal=").concat(String(proc.signalCode), ")\n") +
                        "--- stdout ---\n".concat(stdout_1, "\n--- stderr ---\n").concat(stderr_1));
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var socket = node_net_1.default.connect({ host: "127.0.0.1", port: port });
                        socket.once("connect", function () {
                            socket.destroy();
                            resolve();
                        });
                        socket.once("error", function (err) {
                            socket.destroy();
                            reject(err);
                        });
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, sleep(25)];
            case 6:
                _b.sent();
                return [3 /*break*/, 1];
            case 7:
                stdout = chunksOut.join("");
                stderr = chunksErr.join("");
                throw new Error("timeout waiting for gateway to listen on port ".concat(port, "\n") +
                    "--- stdout ---\n".concat(stdout, "\n--- stderr ---\n").concat(stderr));
        }
    });
}); };
var spawnGatewayInstance = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var port, hookToken, gatewayToken, homeDir, configDir, configPath, stateDir, config, stdout, stderr, child, err_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, getFreePort()];
            case 1:
                port = _e.sent();
                hookToken = "token-".concat(name, "-").concat((0, node_crypto_1.randomUUID)());
                gatewayToken = "gateway-".concat(name, "-").concat((0, node_crypto_1.randomUUID)());
                return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-e2e-".concat(name, "-")))];
            case 2:
                homeDir = _e.sent();
                configDir = node_path_1.default.join(homeDir, ".openclaw");
                return [4 /*yield*/, promises_1.default.mkdir(configDir, { recursive: true })];
            case 3:
                _e.sent();
                configPath = node_path_1.default.join(configDir, "openclaw.json");
                stateDir = node_path_1.default.join(configDir, "state");
                config = {
                    gateway: { port: port, auth: { mode: "token", token: gatewayToken } },
                    hooks: { enabled: true, token: hookToken, path: "/hooks" },
                };
                return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify(config, null, 2), "utf8")];
            case 4:
                _e.sent();
                stdout = [];
                stderr = [];
                child = null;
                _e.label = 5;
            case 5:
                _e.trys.push([5, 7, , 9]);
                child = (0, node_child_process_1.spawn)("node", [
                    "dist/index.js",
                    "gateway",
                    "--port",
                    String(port),
                    "--bind",
                    "loopback",
                    "--allow-unconfigured",
                ], {
                    cwd: process.cwd(),
                    env: __assign(__assign({}, process.env), { HOME: homeDir, OPENCLAW_CONFIG_PATH: configPath, OPENCLAW_STATE_DIR: stateDir, OPENCLAW_GATEWAY_TOKEN: "", OPENCLAW_GATEWAY_PASSWORD: "", OPENCLAW_SKIP_CHANNELS: "1", OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1", OPENCLAW_SKIP_CANVAS_HOST: "1" }),
                    stdio: ["ignore", "pipe", "pipe"],
                });
                (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.setEncoding("utf8");
                (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.setEncoding("utf8");
                (_c = child.stdout) === null || _c === void 0 ? void 0 : _c.on("data", function (d) { return stdout.push(String(d)); });
                (_d = child.stderr) === null || _d === void 0 ? void 0 : _d.on("data", function (d) { return stderr.push(String(d)); });
                return [4 /*yield*/, waitForPortOpen(child, stdout, stderr, port, GATEWAY_START_TIMEOUT_MS)];
            case 6:
                _e.sent();
                return [2 /*return*/, {
                        name: name,
                        port: port,
                        hookToken: hookToken,
                        gatewayToken: gatewayToken,
                        homeDir: homeDir,
                        stateDir: stateDir,
                        configPath: configPath,
                        child: child,
                        stdout: stdout,
                        stderr: stderr,
                    }];
            case 7:
                err_1 = _e.sent();
                if (child && child.exitCode === null && !child.killed) {
                    try {
                        child.kill("SIGKILL");
                    }
                    catch (_f) {
                        // ignore
                    }
                }
                return [4 /*yield*/, promises_1.default.rm(homeDir, { recursive: true, force: true })];
            case 8:
                _e.sent();
                throw err_1;
            case 9: return [2 /*return*/];
        }
    });
}); };
var stopGatewayInstance = function (inst) { return __awaiter(void 0, void 0, void 0, function () {
    var exited;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (inst.child.exitCode === null && !inst.child.killed) {
                    try {
                        inst.child.kill("SIGTERM");
                    }
                    catch (_b) {
                        // ignore
                    }
                }
                return [4 /*yield*/, Promise.race([
                        new Promise(function (resolve) {
                            if (inst.child.exitCode !== null) {
                                return resolve(true);
                            }
                            inst.child.once("exit", function () { return resolve(true); });
                        }),
                        sleep(5000).then(function () { return false; }),
                    ])];
            case 1:
                exited = _a.sent();
                if (!exited && inst.child.exitCode === null && !inst.child.killed) {
                    try {
                        inst.child.kill("SIGKILL");
                    }
                    catch (_c) {
                        // ignore
                    }
                }
                return [4 /*yield*/, promises_1.default.rm(inst.homeDir, { recursive: true, force: true })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var runCliJson = function (args, env) { return __awaiter(void 0, void 0, void 0, function () {
    var stdout, stderr, child, result, out;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                stdout = [];
                stderr = [];
                child = (0, node_child_process_1.spawn)("node", __spreadArray(["dist/index.js"], args, true), {
                    cwd: process.cwd(),
                    env: __assign(__assign({}, process.env), env),
                    stdio: ["ignore", "pipe", "pipe"],
                });
                (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.setEncoding("utf8");
                (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.setEncoding("utf8");
                (_c = child.stdout) === null || _c === void 0 ? void 0 : _c.on("data", function (d) { return stdout.push(String(d)); });
                (_d = child.stderr) === null || _d === void 0 ? void 0 : _d.on("data", function (d) { return stderr.push(String(d)); });
                return [4 /*yield*/, new Promise(function (resolve) { return child.once("exit", function (code, signal) { return resolve({ code: code, signal: signal }); }); })];
            case 1:
                result = _e.sent();
                out = stdout.join("").trim();
                if (result.code !== 0) {
                    throw new Error("cli failed (code=".concat(String(result.code), " signal=").concat(String(result.signal), ")\n") +
                        "--- stdout ---\n".concat(out, "\n--- stderr ---\n").concat(stderr.join("")));
                }
                try {
                    return [2 /*return*/, out ? JSON.parse(out) : null];
                }
                catch (err) {
                    throw new Error("cli returned non-json output: ".concat(String(err), "\n") +
                        "--- stdout ---\n".concat(out, "\n--- stderr ---\n").concat(stderr.join("")), { cause: err });
                }
                return [2 /*return*/];
        }
    });
}); };
var postJson = function (url, body) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, parsed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = JSON.stringify(body);
                parsed = new URL(url);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var req = (0, node_http_1.request)({
                            method: "POST",
                            hostname: parsed.hostname,
                            port: Number(parsed.port),
                            path: "".concat(parsed.pathname).concat(parsed.search),
                            headers: {
                                "Content-Type": "application/json",
                                "Content-Length": Buffer.byteLength(payload),
                            },
                        }, function (res) {
                            var data = "";
                            res.setEncoding("utf8");
                            res.on("data", function (chunk) {
                                data += chunk;
                            });
                            res.on("end", function () {
                                var _a;
                                var json = null;
                                if (data.trim()) {
                                    try {
                                        json = JSON.parse(data);
                                    }
                                    catch (_b) {
                                        json = data;
                                    }
                                }
                                resolve({ status: (_a = res.statusCode) !== null && _a !== void 0 ? _a : 0, json: json });
                            });
                        });
                        req.on("error", reject);
                        req.write(payload);
                        req.end();
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var connectNode = function (inst, label) { return __awaiter(void 0, void 0, void 0, function () {
    var identityPath, deviceIdentity, nodeId, settled, resolveReady, rejectReady, ready, client, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identityPath = node_path_1.default.join(inst.homeDir, "".concat(label, "-device.json"));
                deviceIdentity = (0, device_identity_js_1.loadOrCreateDeviceIdentity)(identityPath);
                nodeId = deviceIdentity.deviceId;
                settled = false;
                resolveReady = null;
                rejectReady = null;
                ready = new Promise(function (resolve, reject) {
                    resolveReady = resolve;
                    rejectReady = reject;
                });
                client = new client_js_1.GatewayClient({
                    url: "ws://127.0.0.1:".concat(inst.port),
                    token: inst.gatewayToken,
                    clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                    clientDisplayName: label,
                    clientVersion: "1.0.0",
                    platform: "ios",
                    mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                    role: "node",
                    scopes: [],
                    caps: ["system"],
                    commands: ["system.run"],
                    deviceIdentity: deviceIdentity,
                    onHelloOk: function () {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        resolveReady === null || resolveReady === void 0 ? void 0 : resolveReady();
                    },
                    onConnectError: function (err) {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        rejectReady === null || rejectReady === void 0 ? void 0 : rejectReady(err);
                    },
                    onClose: function (code, reason) {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        rejectReady === null || rejectReady === void 0 ? void 0 : rejectReady(new Error("gateway closed (".concat(code, "): ").concat(reason)));
                    },
                });
                client.start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Promise.race([
                        ready,
                        sleep(10000).then(function () {
                            throw new Error("timeout waiting for ".concat(label, " to connect"));
                        }),
                    ])];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                client.stop();
                throw err_2;
            case 4: return [2 /*return*/, { client: client, nodeId: nodeId }];
        }
    });
}); };
var waitForNodeStatus = function (inst_1, nodeId_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([inst_1, nodeId_1], args_1, true), void 0, function (inst, nodeId, timeoutMs) {
        var deadline, list, match;
        var _a;
        if (timeoutMs === void 0) { timeoutMs = 10000; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deadline = Date.now() + timeoutMs;
                    _b.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 4];
                    return [4 /*yield*/, runCliJson(["nodes", "status", "--json", "--url", "ws://127.0.0.1:".concat(inst.port)], {
                            OPENCLAW_GATEWAY_TOKEN: inst.gatewayToken,
                            OPENCLAW_GATEWAY_PASSWORD: "",
                        })];
                case 2:
                    list = (_b.sent());
                    match = (_a = list.nodes) === null || _a === void 0 ? void 0 : _a.find(function (n) { return n.nodeId === nodeId; });
                    if ((match === null || match === void 0 ? void 0 : match.connected) && (match === null || match === void 0 ? void 0 : match.paired)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, sleep(50)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 4: throw new Error("timeout waiting for node status for ".concat(nodeId));
            }
        });
    });
};
(0, vitest_1.describe)("gateway multi-instance e2e", function () {
    var instances = [];
    var nodeClients = [];
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, nodeClients_1, client, _a, instances_1, inst;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    for (_i = 0, nodeClients_1 = nodeClients; _i < nodeClients_1.length; _i++) {
                        client = nodeClients_1[_i];
                        client.stop();
                    }
                    _a = 0, instances_1 = instances;
                    _b.label = 1;
                case 1:
                    if (!(_a < instances_1.length)) return [3 /*break*/, 4];
                    inst = instances_1[_a];
                    return [4 /*yield*/, stopGatewayInstance(inst)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("spins up two gateways and exercises WS + HTTP + node pairing", { timeout: E2E_TIMEOUT_MS }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var gwA, gwB, _a, healthA, healthB, _b, hookResA, hookResB, nodeA, nodeB;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, spawnGatewayInstance("a")];
                case 1:
                    gwA = _e.sent();
                    instances.push(gwA);
                    return [4 /*yield*/, spawnGatewayInstance("b")];
                case 2:
                    gwB = _e.sent();
                    instances.push(gwB);
                    return [4 /*yield*/, Promise.all([
                            runCliJson(["health", "--json", "--timeout", "10000"], {
                                OPENCLAW_GATEWAY_PORT: String(gwA.port),
                                OPENCLAW_GATEWAY_TOKEN: gwA.gatewayToken,
                                OPENCLAW_GATEWAY_PASSWORD: "",
                            }),
                            runCliJson(["health", "--json", "--timeout", "10000"], {
                                OPENCLAW_GATEWAY_PORT: String(gwB.port),
                                OPENCLAW_GATEWAY_TOKEN: gwB.gatewayToken,
                                OPENCLAW_GATEWAY_PASSWORD: "",
                            }),
                        ])];
                case 3:
                    _a = (_e.sent()), healthA = _a[0], healthB = _a[1];
                    (0, vitest_1.expect)(healthA.ok).toBe(true);
                    (0, vitest_1.expect)(healthB.ok).toBe(true);
                    return [4 /*yield*/, Promise.all([
                            postJson("http://127.0.0.1:".concat(gwA.port, "/hooks/wake?token=").concat(gwA.hookToken), {
                                text: "wake a",
                                mode: "now",
                            }),
                            postJson("http://127.0.0.1:".concat(gwB.port, "/hooks/wake?token=").concat(gwB.hookToken), {
                                text: "wake b",
                                mode: "now",
                            }),
                        ])];
                case 4:
                    _b = _e.sent(), hookResA = _b[0], hookResB = _b[1];
                    (0, vitest_1.expect)(hookResA.status).toBe(200);
                    (0, vitest_1.expect)((_c = hookResA.json) === null || _c === void 0 ? void 0 : _c.ok).toBe(true);
                    (0, vitest_1.expect)(hookResB.status).toBe(200);
                    (0, vitest_1.expect)((_d = hookResB.json) === null || _d === void 0 ? void 0 : _d.ok).toBe(true);
                    return [4 /*yield*/, connectNode(gwA, "node-a")];
                case 5:
                    nodeA = _e.sent();
                    return [4 /*yield*/, connectNode(gwB, "node-b")];
                case 6:
                    nodeB = _e.sent();
                    nodeClients.push(nodeA.client, nodeB.client);
                    return [4 /*yield*/, Promise.all([
                            waitForNodeStatus(gwA, nodeA.nodeId),
                            waitForNodeStatus(gwB, nodeB.nodeId),
                        ])];
                case 7:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
