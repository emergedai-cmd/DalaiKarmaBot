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
exports.registerNodesScreenCommands = registerNodesScreenCommands;
var call_js_1 = require("../../gateway/call.js");
var runtime_js_1 = require("../../runtime.js");
var utils_js_1 = require("../../utils.js");
var nodes_screen_js_1 = require("../nodes-screen.js");
var parse_duration_js_1 = require("../parse-duration.js");
var cli_utils_js_1 = require("./cli-utils.js");
var rpc_js_1 = require("./rpc.js");
function registerNodesScreenCommands(nodes) {
    var _this = this;
    var screen = nodes
        .command("screen")
        .description("Capture screen recordings from a paired node");
    (0, rpc_js_1.nodesCallOpts)(screen
        .command("record")
        .description("Capture a short screen recording from a node (prints MEDIA:<path>)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--screen <index>", "Screen index (0 = primary)", "0")
        .option("--duration <ms|10s>", "Clip duration (ms or 10s)", "10000")
        .option("--fps <fps>", "Frames per second", "10")
        .option("--no-audio", "Disable microphone audio capture")
        .option("--out <path>", "Output path")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 120000)", "120000")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("screen record", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, durationMs, screenIndex, fps, timeoutMs, invokeParams, raw, res, parsed, filePath, written;
                        var _a, _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _f.sent();
                                    durationMs = (0, parse_duration_js_1.parseDurationMs)((_b = opts.duration) !== null && _b !== void 0 ? _b : "");
                                    screenIndex = Number.parseInt(String((_c = opts.screen) !== null && _c !== void 0 ? _c : "0"), 10);
                                    fps = Number.parseFloat(String((_d = opts.fps) !== null && _d !== void 0 ? _d : "10"));
                                    timeoutMs = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "screen.record",
                                        params: {
                                            durationMs: Number.isFinite(durationMs) ? durationMs : undefined,
                                            screenIndex: Number.isFinite(screenIndex) ? screenIndex : undefined,
                                            fps: Number.isFinite(fps) ? fps : undefined,
                                            format: "mp4",
                                            includeAudio: opts.audio !== false,
                                        },
                                        idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                                    };
                                    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
                                        invokeParams.timeoutMs = timeoutMs;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 2:
                                    raw = _f.sent();
                                    res = typeof raw === "object" && raw !== null ? raw : {};
                                    parsed = (0, nodes_screen_js_1.parseScreenRecordPayload)(res.payload);
                                    filePath = (_e = opts.out) !== null && _e !== void 0 ? _e : (0, nodes_screen_js_1.screenRecordTempPath)({ ext: parsed.format || "mp4" });
                                    return [4 /*yield*/, (0, nodes_screen_js_1.writeScreenRecordToFile)(filePath, parsed.base64)];
                                case 3:
                                    written = _f.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify({
                                            file: {
                                                path: written.path,
                                                durationMs: parsed.durationMs,
                                                fps: parsed.fps,
                                                screenIndex: parsed.screenIndex,
                                                hasAudio: parsed.hasAudio,
                                            },
                                        }, null, 2));
                                        return [2 /*return*/];
                                    }
                                    runtime_js_1.defaultRuntime.log("MEDIA:".concat((0, utils_js_1.shortenHomePath)(written.path)));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }), { timeoutMs: 180000 });
}
