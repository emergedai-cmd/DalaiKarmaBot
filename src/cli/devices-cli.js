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
exports.registerDevicesCli = registerDevicesCli;
var call_js_1 = require("../gateway/call.js");
var runtime_js_1 = require("../runtime.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var progress_js_1 = require("./progress.js");
function formatAge(msAgo) {
    var s = Math.max(0, Math.floor(msAgo / 1000));
    if (s < 60) {
        return "".concat(s, "s");
    }
    var m = Math.floor(s / 60);
    if (m < 60) {
        return "".concat(m, "m");
    }
    var h = Math.floor(m / 60);
    if (h < 24) {
        return "".concat(h, "h");
    }
    var d = Math.floor(h / 24);
    return "".concat(d, "d");
}
var devicesCallOpts = function (cmd, defaults) {
    var _a;
    return cmd
        .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
        .option("--token <token>", "Gateway token (if required)")
        .option("--password <password>", "Gateway password (password auth)")
        .option("--timeout <ms>", "Timeout in ms", String((_a = defaults === null || defaults === void 0 ? void 0 : defaults.timeoutMs) !== null && _a !== void 0 ? _a : 10000))
        .option("--json", "Output JSON", false);
};
var callGatewayCli = function (method, opts, params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, progress_js_1.withProgress)({
                label: "Devices ".concat(method),
                indeterminate: true,
                enabled: opts.json !== true,
            }, function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, call_js_1.callGateway)({
                                url: opts.url,
                                token: opts.token,
                                password: opts.password,
                                method: method,
                                params: params,
                                timeoutMs: Number((_a = opts.timeout) !== null && _a !== void 0 ? _a : 10000),
                                clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
                            })];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            }); })];
    });
}); };
function parseDevicePairingList(value) {
    var obj = typeof value === "object" && value !== null ? value : {};
    return {
        pending: Array.isArray(obj.pending) ? obj.pending : [],
        paired: Array.isArray(obj.paired) ? obj.paired : [],
    };
}
function formatTokenSummary(tokens) {
    if (!tokens || tokens.length === 0) {
        return "none";
    }
    var parts = tokens
        .map(function (t) { return "".concat(t.role).concat(t.revokedAtMs ? " (revoked)" : ""); })
        .toSorted(function (a, b) { return a.localeCompare(b); });
    return parts.join(", ");
}
function registerDevicesCli(program) {
    var _this = this;
    var devices = program.command("devices").description("Device pairing and auth tokens");
    devicesCallOpts(devices
        .command("list")
        .description("List pending and paired devices")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var result, list, tableWidth, tableWidth;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, callGatewayCli("device.pair.list", opts, {})];
                case 1:
                    result = _g.sent();
                    list = parseDevicePairingList(result);
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(list, null, 2));
                        return [2 /*return*/];
                    }
                    if ((_a = list.pending) === null || _a === void 0 ? void 0 : _a.length) {
                        tableWidth = Math.max(60, ((_b = process.stdout.columns) !== null && _b !== void 0 ? _b : 120) - 1);
                        runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Pending"), " ").concat(theme_js_1.theme.muted("(".concat(list.pending.length, ")"))));
                        runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                            width: tableWidth,
                            columns: [
                                { key: "Request", header: "Request", minWidth: 10 },
                                { key: "Device", header: "Device", minWidth: 16, flex: true },
                                { key: "Role", header: "Role", minWidth: 8 },
                                { key: "IP", header: "IP", minWidth: 12 },
                                { key: "Age", header: "Age", minWidth: 8 },
                                { key: "Flags", header: "Flags", minWidth: 8 },
                            ],
                            rows: list.pending.map(function (req) {
                                var _a, _b;
                                return ({
                                    Request: req.requestId,
                                    Device: req.displayName || req.deviceId,
                                    Role: (_a = req.role) !== null && _a !== void 0 ? _a : "",
                                    IP: (_b = req.remoteIp) !== null && _b !== void 0 ? _b : "",
                                    Age: typeof req.ts === "number" ? "".concat(formatAge(Date.now() - req.ts), " ago") : "",
                                    Flags: req.isRepair ? "repair" : "",
                                });
                            }),
                        }).trimEnd());
                    }
                    if ((_c = list.paired) === null || _c === void 0 ? void 0 : _c.length) {
                        tableWidth = Math.max(60, ((_d = process.stdout.columns) !== null && _d !== void 0 ? _d : 120) - 1);
                        runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Paired"), " ").concat(theme_js_1.theme.muted("(".concat(list.paired.length, ")"))));
                        runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                            width: tableWidth,
                            columns: [
                                { key: "Device", header: "Device", minWidth: 16, flex: true },
                                { key: "Roles", header: "Roles", minWidth: 12, flex: true },
                                { key: "Scopes", header: "Scopes", minWidth: 12, flex: true },
                                { key: "Tokens", header: "Tokens", minWidth: 12, flex: true },
                                { key: "IP", header: "IP", minWidth: 12 },
                            ],
                            rows: list.paired.map(function (device) {
                                var _a, _b, _c;
                                return ({
                                    Device: device.displayName || device.deviceId,
                                    Roles: ((_a = device.roles) === null || _a === void 0 ? void 0 : _a.length) ? device.roles.join(", ") : "",
                                    Scopes: ((_b = device.scopes) === null || _b === void 0 ? void 0 : _b.length) ? device.scopes.join(", ") : "",
                                    Tokens: formatTokenSummary(device.tokens),
                                    IP: (_c = device.remoteIp) !== null && _c !== void 0 ? _c : "",
                                });
                            }),
                        }).trimEnd());
                    }
                    if (!((_e = list.pending) === null || _e === void 0 ? void 0 : _e.length) && !((_f = list.paired) === null || _f === void 0 ? void 0 : _f.length)) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No device pairing entries."));
                    }
                    return [2 /*return*/];
            }
        });
    }); }));
    devicesCallOpts(devices
        .command("approve")
        .description("Approve a pending device pairing request")
        .argument("<requestId>", "Pending request id")
        .action(function (requestId, opts) { return __awaiter(_this, void 0, void 0, function () {
        var result, deviceId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, callGatewayCli("device.pair.approve", opts, { requestId: requestId })];
                case 1:
                    result = _b.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    deviceId = (_a = result === null || result === void 0 ? void 0 : result.device) === null || _a === void 0 ? void 0 : _a.deviceId;
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.success("Approved"), " ").concat(theme_js_1.theme.command(deviceId !== null && deviceId !== void 0 ? deviceId : "ok")));
                    return [2 /*return*/];
            }
        });
    }); }));
    devicesCallOpts(devices
        .command("reject")
        .description("Reject a pending device pairing request")
        .argument("<requestId>", "Pending request id")
        .action(function (requestId, opts) { return __awaiter(_this, void 0, void 0, function () {
        var result, deviceId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callGatewayCli("device.pair.reject", opts, { requestId: requestId })];
                case 1:
                    result = _a.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    deviceId = result === null || result === void 0 ? void 0 : result.deviceId;
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.warn("Rejected"), " ").concat(theme_js_1.theme.command(deviceId !== null && deviceId !== void 0 ? deviceId : "ok")));
                    return [2 /*return*/];
            }
        });
    }); }));
    devicesCallOpts(devices
        .command("rotate")
        .description("Rotate a device token for a role")
        .requiredOption("--device <id>", "Device id")
        .requiredOption("--role <role>", "Role name")
        .option("--scope <scope...>", "Scopes to attach to the token (repeatable)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var deviceId, role, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    deviceId = String((_a = opts.device) !== null && _a !== void 0 ? _a : "").trim();
                    role = String((_b = opts.role) !== null && _b !== void 0 ? _b : "").trim();
                    if (!deviceId || !role) {
                        runtime_js_1.defaultRuntime.error("--device and --role required");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, callGatewayCli("device.token.rotate", opts, {
                            deviceId: deviceId,
                            role: role,
                            scopes: Array.isArray(opts.scope) ? opts.scope : undefined,
                        })];
                case 1:
                    result = _c.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                    return [2 /*return*/];
            }
        });
    }); }));
    devicesCallOpts(devices
        .command("revoke")
        .description("Revoke a device token for a role")
        .requiredOption("--device <id>", "Device id")
        .requiredOption("--role <role>", "Role name")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var deviceId, role, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    deviceId = String((_a = opts.device) !== null && _a !== void 0 ? _a : "").trim();
                    role = String((_b = opts.role) !== null && _b !== void 0 ? _b : "").trim();
                    if (!deviceId || !role) {
                        runtime_js_1.defaultRuntime.error("--device and --role required");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, callGatewayCli("device.token.revoke", opts, {
                            deviceId: deviceId,
                            role: role,
                        })];
                case 1:
                    result = _c.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                    return [2 /*return*/];
            }
        });
    }); }));
}
