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
exports.registerNodesCameraCommands = registerNodesCameraCommands;
var call_js_1 = require("../../gateway/call.js");
var runtime_js_1 = require("../../runtime.js");
var table_js_1 = require("../../terminal/table.js");
var utils_js_1 = require("../../utils.js");
var nodes_camera_js_1 = require("../nodes-camera.js");
var parse_duration_js_1 = require("../parse-duration.js");
var cli_utils_js_1 = require("./cli-utils.js");
var rpc_js_1 = require("./rpc.js");
var parseFacing = function (value) {
    var v = String(value !== null && value !== void 0 ? value : "")
        .trim()
        .toLowerCase();
    if (v === "front" || v === "back") {
        return v;
    }
    throw new Error("invalid facing: ".concat(value, " (expected front|back)"));
};
function registerNodesCameraCommands(nodes) {
    var _this = this;
    var camera = nodes.command("camera").description("Capture camera media from a paired node");
    (0, rpc_js_1.nodesCallOpts)(camera
        .command("list")
        .description("List available cameras on a node")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("camera list", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, raw, res, payload, devices, muted_1, _a, heading, muted, tableWidth, rows;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_b = opts.node) !== null && _b !== void 0 ? _b : ""))];
                                case 1:
                                    nodeId = _d.sent();
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, {
                                            nodeId: nodeId,
                                            command: "camera.list",
                                            params: {},
                                            idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                                        })];
                                case 2:
                                    raw = _d.sent();
                                    res = typeof raw === "object" && raw !== null ? raw : {};
                                    payload = typeof res.payload === "object" && res.payload !== null
                                        ? res.payload
                                        : {};
                                    devices = Array.isArray(payload.devices) ? payload.devices : [];
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(devices, null, 2));
                                        return [2 /*return*/];
                                    }
                                    if (devices.length === 0) {
                                        muted_1 = (0, cli_utils_js_1.getNodesTheme)().muted;
                                        runtime_js_1.defaultRuntime.log(muted_1("No cameras reported."));
                                        return [2 /*return*/];
                                    }
                                    _a = (0, cli_utils_js_1.getNodesTheme)(), heading = _a.heading, muted = _a.muted;
                                    tableWidth = Math.max(60, ((_c = process.stdout.columns) !== null && _c !== void 0 ? _c : 120) - 1);
                                    rows = devices.map(function (device) { return ({
                                        Name: typeof device.name === "string" ? device.name : "Unknown Camera",
                                        Position: typeof device.position === "string" ? device.position : muted("unspecified"),
                                        ID: typeof device.id === "string" ? device.id : "",
                                    }); });
                                    runtime_js_1.defaultRuntime.log(heading("Cameras"));
                                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                                        width: tableWidth,
                                        columns: [
                                            { key: "Name", header: "Name", minWidth: 14, flex: true },
                                            { key: "Position", header: "Position", minWidth: 10 },
                                            { key: "ID", header: "ID", minWidth: 10, flex: true },
                                        ],
                                        rows: rows,
                                    }).trimEnd());
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }), { timeoutMs: 60000 });
    (0, rpc_js_1.nodesCallOpts)(camera
        .command("snap")
        .description("Capture a photo from a node camera (prints MEDIA:<path>)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--facing <front|back|both>", "Camera facing", "both")
        .option("--device-id <id>", "Camera device id (from nodes camera list)")
        .option("--max-width <px>", "Max width in px (optional)")
        .option("--quality <0-1>", "JPEG quality (default 0.9)")
        .option("--delay-ms <ms>", "Delay before capture in ms (macOS default 2000)")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("camera snap", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, facingOpt, facings, maxWidth, quality, delayMs, deviceId, timeoutMs, results, _i, facings_1, facing, invokeParams, raw, res, payload, filePath;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _c.sent();
                                    facingOpt = String((_b = opts.facing) !== null && _b !== void 0 ? _b : "both")
                                        .trim()
                                        .toLowerCase();
                                    facings = facingOpt === "both"
                                        ? ["front", "back"]
                                        : facingOpt === "front" || facingOpt === "back"
                                            ? [facingOpt]
                                            : (function () {
                                                throw new Error("invalid facing: ".concat(String(opts.facing), " (expected front|back|both)"));
                                            })();
                                    maxWidth = opts.maxWidth ? Number.parseInt(String(opts.maxWidth), 10) : undefined;
                                    quality = opts.quality ? Number.parseFloat(String(opts.quality)) : undefined;
                                    delayMs = opts.delayMs ? Number.parseInt(String(opts.delayMs), 10) : undefined;
                                    deviceId = opts.deviceId ? String(opts.deviceId).trim() : undefined;
                                    timeoutMs = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    results = [];
                                    _i = 0, facings_1 = facings;
                                    _c.label = 2;
                                case 2:
                                    if (!(_i < facings_1.length)) return [3 /*break*/, 6];
                                    facing = facings_1[_i];
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "camera.snap",
                                        params: {
                                            facing: facing,
                                            maxWidth: Number.isFinite(maxWidth) ? maxWidth : undefined,
                                            quality: Number.isFinite(quality) ? quality : undefined,
                                            format: "jpg",
                                            delayMs: Number.isFinite(delayMs) ? delayMs : undefined,
                                            deviceId: deviceId || undefined,
                                        },
                                        idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                                    };
                                    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
                                        invokeParams.timeoutMs = timeoutMs;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 3:
                                    raw = _c.sent();
                                    res = typeof raw === "object" && raw !== null ? raw : {};
                                    payload = (0, nodes_camera_js_1.parseCameraSnapPayload)(res.payload);
                                    filePath = (0, nodes_camera_js_1.cameraTempPath)({
                                        kind: "snap",
                                        facing: facing,
                                        ext: payload.format === "jpeg" ? "jpg" : payload.format,
                                    });
                                    return [4 /*yield*/, (0, nodes_camera_js_1.writeBase64ToFile)(filePath, payload.base64)];
                                case 4:
                                    _c.sent();
                                    results.push({
                                        facing: facing,
                                        path: filePath,
                                        width: payload.width,
                                        height: payload.height,
                                    });
                                    _c.label = 5;
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 6:
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify({ files: results }, null, 2));
                                        return [2 /*return*/];
                                    }
                                    runtime_js_1.defaultRuntime.log(results.map(function (r) { return "MEDIA:".concat((0, utils_js_1.shortenHomePath)(r.path)); }).join("\n"));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }), { timeoutMs: 60000 });
    (0, rpc_js_1.nodesCallOpts)(camera
        .command("clip")
        .description("Capture a short video clip from a node camera (prints MEDIA:<path>)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--facing <front|back>", "Camera facing", "front")
        .option("--device-id <id>", "Camera device id (from nodes camera list)")
        .option("--duration <ms|10s|1m>", "Duration (default 3000ms; supports ms/s/m, e.g. 10s)", "3000")
        .option("--no-audio", "Disable audio capture")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 90000)", "90000")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("camera clip", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, facing, durationMs, includeAudio, timeoutMs, deviceId, invokeParams, raw, res, payload, filePath;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _d.sent();
                                    facing = parseFacing(String((_b = opts.facing) !== null && _b !== void 0 ? _b : "front"));
                                    durationMs = (0, parse_duration_js_1.parseDurationMs)(String((_c = opts.duration) !== null && _c !== void 0 ? _c : "3000"));
                                    includeAudio = opts.audio !== false;
                                    timeoutMs = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    deviceId = opts.deviceId ? String(opts.deviceId).trim() : undefined;
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "camera.clip",
                                        params: {
                                            facing: facing,
                                            durationMs: Number.isFinite(durationMs) ? durationMs : undefined,
                                            includeAudio: includeAudio,
                                            format: "mp4",
                                            deviceId: deviceId || undefined,
                                        },
                                        idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                                    };
                                    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
                                        invokeParams.timeoutMs = timeoutMs;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 2:
                                    raw = _d.sent();
                                    res = typeof raw === "object" && raw !== null ? raw : {};
                                    payload = (0, nodes_camera_js_1.parseCameraClipPayload)(res.payload);
                                    filePath = (0, nodes_camera_js_1.cameraTempPath)({
                                        kind: "clip",
                                        facing: facing,
                                        ext: payload.format,
                                    });
                                    return [4 /*yield*/, (0, nodes_camera_js_1.writeBase64ToFile)(filePath, payload.base64)];
                                case 3:
                                    _d.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify({
                                            file: {
                                                facing: facing,
                                                path: filePath,
                                                durationMs: payload.durationMs,
                                                hasAudio: payload.hasAudio,
                                            },
                                        }, null, 2));
                                        return [2 /*return*/];
                                    }
                                    runtime_js_1.defaultRuntime.log("MEDIA:".concat((0, utils_js_1.shortenHomePath)(filePath)));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }), { timeoutMs: 90000 });
}
