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
exports.registerNodesNotifyCommand = registerNodesNotifyCommand;
var call_js_1 = require("../../gateway/call.js");
var runtime_js_1 = require("../../runtime.js");
var cli_utils_js_1 = require("./cli-utils.js");
var rpc_js_1 = require("./rpc.js");
function registerNodesNotifyCommand(nodes) {
    var _this = this;
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("notify")
        .description("Send a local notification on a node (mac only)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--title <text>", "Notification title")
        .option("--body <text>", "Notification body")
        .option("--sound <name>", "Notification sound")
        .option("--priority <passive|active|timeSensitive>", "Notification priority")
        .option("--delivery <system|overlay|auto>", "Delivery mode", "system")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 15000)", "15000")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("notify", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, title, body, invokeTimeout, invokeParams, result, ok;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _e.sent();
                                    title = String((_b = opts.title) !== null && _b !== void 0 ? _b : "").trim();
                                    body = String((_c = opts.body) !== null && _c !== void 0 ? _c : "").trim();
                                    if (!title && !body) {
                                        throw new Error("missing --title or --body");
                                    }
                                    invokeTimeout = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "system.notify",
                                        params: {
                                            title: title,
                                            body: body,
                                            sound: opts.sound,
                                            priority: opts.priority,
                                            delivery: opts.delivery,
                                        },
                                        idempotencyKey: String((_d = opts.idempotencyKey) !== null && _d !== void 0 ? _d : (0, call_js_1.randomIdempotencyKey)()),
                                    };
                                    if (typeof invokeTimeout === "number" && Number.isFinite(invokeTimeout)) {
                                        invokeParams.timeoutMs = invokeTimeout;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 2:
                                    result = _e.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                    runtime_js_1.defaultRuntime.log(ok("notify ok"));
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
