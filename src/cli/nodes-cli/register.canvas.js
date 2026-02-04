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
exports.registerNodesCanvasCommands = registerNodesCanvasCommands;
var promises_1 = require("node:fs/promises");
var call_js_1 = require("../../gateway/call.js");
var runtime_js_1 = require("../../runtime.js");
var utils_js_1 = require("../../utils.js");
var nodes_camera_js_1 = require("../nodes-camera.js");
var nodes_canvas_js_1 = require("../nodes-canvas.js");
var nodes_run_js_1 = require("../nodes-run.js");
var a2ui_jsonl_js_1 = require("./a2ui-jsonl.js");
var cli_utils_js_1 = require("./cli-utils.js");
var rpc_js_1 = require("./rpc.js");
function invokeCanvas(opts, command, params) {
    return __awaiter(this, void 0, void 0, function () {
        var nodeId, invokeParams, timeoutMs;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                case 1:
                    nodeId = _b.sent();
                    invokeParams = {
                        nodeId: nodeId,
                        command: command,
                        params: params,
                        idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                    };
                    timeoutMs = (0, nodes_run_js_1.parseTimeoutMs)(opts.invokeTimeout);
                    if (typeof timeoutMs === "number") {
                        invokeParams.timeoutMs = timeoutMs;
                    }
                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function registerNodesCanvasCommands(nodes) {
    var _this = this;
    var canvas = nodes
        .command("canvas")
        .description("Capture or render canvas content from a paired node");
    (0, rpc_js_1.nodesCallOpts)(canvas
        .command("snapshot")
        .description("Capture a canvas snapshot (prints MEDIA:<path>)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--format <png|jpg|jpeg>", "Image format", "jpg")
        .option("--max-width <px>", "Max width in px (optional)")
        .option("--quality <0-1>", "JPEG quality (optional)")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas snapshot", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, formatOpt, formatForParams, maxWidth, quality, timeoutMs, invokeParams, raw, res, payload, filePath;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _c.sent();
                                    formatOpt = String((_b = opts.format) !== null && _b !== void 0 ? _b : "jpg")
                                        .trim()
                                        .toLowerCase();
                                    formatForParams = formatOpt === "jpg" ? "jpeg" : formatOpt === "jpeg" ? "jpeg" : "png";
                                    if (formatForParams !== "png" && formatForParams !== "jpeg") {
                                        throw new Error("invalid format: ".concat(String(opts.format), " (expected png|jpg|jpeg)"));
                                    }
                                    maxWidth = opts.maxWidth ? Number.parseInt(String(opts.maxWidth), 10) : undefined;
                                    quality = opts.quality ? Number.parseFloat(String(opts.quality)) : undefined;
                                    timeoutMs = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "canvas.snapshot",
                                        params: {
                                            format: formatForParams,
                                            maxWidth: Number.isFinite(maxWidth) ? maxWidth : undefined,
                                            quality: Number.isFinite(quality) ? quality : undefined,
                                        },
                                        idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                                    };
                                    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
                                        invokeParams.timeoutMs = timeoutMs;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 2:
                                    raw = _c.sent();
                                    res = typeof raw === "object" && raw !== null ? raw : {};
                                    payload = (0, nodes_canvas_js_1.parseCanvasSnapshotPayload)(res.payload);
                                    filePath = (0, nodes_canvas_js_1.canvasSnapshotTempPath)({
                                        ext: payload.format === "jpeg" ? "jpg" : payload.format,
                                    });
                                    return [4 /*yield*/, (0, nodes_camera_js_1.writeBase64ToFile)(filePath, payload.base64)];
                                case 3:
                                    _c.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify({ file: { path: filePath, format: payload.format } }, null, 2));
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
    }); }), { timeoutMs: 60000 });
    (0, rpc_js_1.nodesCallOpts)(canvas
        .command("present")
        .description("Show the canvas (optionally with a target URL/path)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--target <urlOrPath>", "Target URL/path (optional)")
        .option("--x <px>", "Placement x coordinate")
        .option("--y <px>", "Placement y coordinate")
        .option("--width <px>", "Placement width")
        .option("--height <px>", "Placement height")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas present", function () { return __awaiter(_this, void 0, void 0, function () {
                        var placement, params, ok;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    placement = {
                                        x: opts.x ? Number.parseFloat(opts.x) : undefined,
                                        y: opts.y ? Number.parseFloat(opts.y) : undefined,
                                        width: opts.width ? Number.parseFloat(opts.width) : undefined,
                                        height: opts.height ? Number.parseFloat(opts.height) : undefined,
                                    };
                                    params = {};
                                    if (opts.target) {
                                        params.url = String(opts.target);
                                    }
                                    if (Number.isFinite(placement.x) ||
                                        Number.isFinite(placement.y) ||
                                        Number.isFinite(placement.width) ||
                                        Number.isFinite(placement.height)) {
                                        params.placement = placement;
                                    }
                                    return [4 /*yield*/, invokeCanvas(opts, "canvas.present", params)];
                                case 1:
                                    _a.sent();
                                    if (!opts.json) {
                                        ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                        runtime_js_1.defaultRuntime.log(ok("canvas present ok"));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(canvas
        .command("hide")
        .description("Hide the canvas")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas hide", function () { return __awaiter(_this, void 0, void 0, function () {
                        var ok;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, invokeCanvas(opts, "canvas.hide", undefined)];
                                case 1:
                                    _a.sent();
                                    if (!opts.json) {
                                        ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                        runtime_js_1.defaultRuntime.log(ok("canvas hide ok"));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(canvas
        .command("navigate")
        .description("Navigate the canvas to a URL")
        .argument("<url>", "Target URL/path")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
        .action(function (url, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas navigate", function () { return __awaiter(_this, void 0, void 0, function () {
                        var ok;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, invokeCanvas(opts, "canvas.navigate", { url: url })];
                                case 1:
                                    _a.sent();
                                    if (!opts.json) {
                                        ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                        runtime_js_1.defaultRuntime.log(ok("canvas navigate ok"));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(canvas
        .command("eval")
        .description("Evaluate JavaScript in the canvas")
        .argument("[js]", "JavaScript to evaluate")
        .option("--js <code>", "JavaScript to evaluate")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
        .action(function (jsArg, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas eval", function () { return __awaiter(_this, void 0, void 0, function () {
                        var js, raw, payload, ok;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    js = (_a = opts.js) !== null && _a !== void 0 ? _a : jsArg;
                                    if (!js) {
                                        throw new Error("missing --js or <js>");
                                    }
                                    return [4 /*yield*/, invokeCanvas(opts, "canvas.eval", {
                                            javaScript: js,
                                        })];
                                case 1:
                                    raw = _b.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(raw, null, 2));
                                        return [2 /*return*/];
                                    }
                                    payload = typeof raw === "object" && raw !== null
                                        ? raw.payload
                                        : undefined;
                                    if (payload === null || payload === void 0 ? void 0 : payload.result) {
                                        runtime_js_1.defaultRuntime.log(payload.result);
                                    }
                                    else {
                                        ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                        runtime_js_1.defaultRuntime.log(ok("canvas eval ok"));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    var a2ui = canvas.command("a2ui").description("Render A2UI content on the canvas");
    (0, rpc_js_1.nodesCallOpts)(a2ui
        .command("push")
        .description("Push A2UI JSONL to the canvas")
        .option("--jsonl <path>", "Path to JSONL payload")
        .option("--text <text>", "Render a quick A2UI text payload")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas a2ui push", function () { return __awaiter(_this, void 0, void 0, function () {
                        var hasJsonl, hasText, jsonl, _a, _b, version, messageCount, ok;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    hasJsonl = Boolean(opts.jsonl);
                                    hasText = typeof opts.text === "string";
                                    if (hasJsonl === hasText) {
                                        throw new Error("provide exactly one of --jsonl or --text");
                                    }
                                    if (!hasText) return [3 /*break*/, 1];
                                    _a = (0, a2ui_jsonl_js_1.buildA2UITextJsonl)(String((_c = opts.text) !== null && _c !== void 0 ? _c : ""));
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, promises_1.default.readFile(String(opts.jsonl), "utf8")];
                                case 2:
                                    _a = _d.sent();
                                    _d.label = 3;
                                case 3:
                                    jsonl = _a;
                                    _b = (0, a2ui_jsonl_js_1.validateA2UIJsonl)(jsonl), version = _b.version, messageCount = _b.messageCount;
                                    if (version === "v0.9") {
                                        throw new Error("Detected A2UI v0.9 JSONL (createSurface). OpenClaw currently supports v0.8 only.");
                                    }
                                    return [4 /*yield*/, invokeCanvas(opts, "canvas.a2ui.pushJSONL", { jsonl: jsonl })];
                                case 4:
                                    _d.sent();
                                    if (!opts.json) {
                                        ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                        runtime_js_1.defaultRuntime.log(ok("canvas a2ui push ok (v0.8, ".concat(messageCount, " message").concat(messageCount === 1 ? "" : "s", ")")));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(a2ui
        .command("reset")
        .description("Reset A2UI renderer state")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("canvas a2ui reset", function () { return __awaiter(_this, void 0, void 0, function () {
                        var ok;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, invokeCanvas(opts, "canvas.a2ui.reset", undefined)];
                                case 1:
                                    _a.sent();
                                    if (!opts.json) {
                                        ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                        runtime_js_1.defaultRuntime.log(ok("canvas a2ui reset ok"));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
}
