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
exports.registerNodesLocationCommands = registerNodesLocationCommands;
var call_js_1 = require("../../gateway/call.js");
var runtime_js_1 = require("../../runtime.js");
var cli_utils_js_1 = require("./cli-utils.js");
var rpc_js_1 = require("./rpc.js");
function registerNodesLocationCommands(nodes) {
    var _this = this;
    var location = nodes.command("location").description("Fetch location from a paired node");
    (0, rpc_js_1.nodesCallOpts)(location
        .command("get")
        .description("Fetch the current location from a node")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--max-age <ms>", "Use cached location newer than this (ms)")
        .option("--accuracy <coarse|balanced|precise>", "Desired accuracy (default: balanced/precise depending on node setting)")
        .option("--location-timeout <ms>", "Location fix timeout (ms)", "10000")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("location get", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, maxAgeMs, desiredAccuracyRaw, desiredAccuracy, timeoutMs, invokeTimeoutMs, invokeParams, raw, res, payload, lat, lon, acc, accText;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _b.sent();
                                    maxAgeMs = opts.maxAge ? Number.parseInt(String(opts.maxAge), 10) : undefined;
                                    desiredAccuracyRaw = typeof opts.accuracy === "string" ? opts.accuracy.trim().toLowerCase() : undefined;
                                    desiredAccuracy = desiredAccuracyRaw === "coarse" ||
                                        desiredAccuracyRaw === "balanced" ||
                                        desiredAccuracyRaw === "precise"
                                        ? desiredAccuracyRaw
                                        : undefined;
                                    timeoutMs = opts.locationTimeout
                                        ? Number.parseInt(String(opts.locationTimeout), 10)
                                        : undefined;
                                    invokeTimeoutMs = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "location.get",
                                        params: {
                                            maxAgeMs: Number.isFinite(maxAgeMs) ? maxAgeMs : undefined,
                                            desiredAccuracy: desiredAccuracy,
                                            timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : undefined,
                                        },
                                        idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                                    };
                                    if (typeof invokeTimeoutMs === "number" && Number.isFinite(invokeTimeoutMs)) {
                                        invokeParams.timeoutMs = invokeTimeoutMs;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 2:
                                    raw = _b.sent();
                                    res = typeof raw === "object" && raw !== null ? raw : {};
                                    payload = res.payload && typeof res.payload === "object"
                                        ? res.payload
                                        : {};
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(payload, null, 2));
                                        return [2 /*return*/];
                                    }
                                    lat = payload.lat;
                                    lon = payload.lon;
                                    acc = payload.accuracyMeters;
                                    if (typeof lat === "number" && typeof lon === "number") {
                                        accText = typeof acc === "number" ? " \u00B1".concat(acc.toFixed(1), "m") : "";
                                        runtime_js_1.defaultRuntime.log("".concat(lat, ",").concat(lon).concat(accText));
                                        return [2 /*return*/];
                                    }
                                    runtime_js_1.defaultRuntime.log(JSON.stringify(payload));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }), { timeoutMs: 30000 });
}
