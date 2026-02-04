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
exports.registerCronSimpleCommands = registerCronSimpleCommands;
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var gateway_rpc_js_1 = require("../gateway-rpc.js");
var shared_js_1 = require("./shared.js");
function registerCronSimpleCommands(cron) {
    var _this = this;
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("rm")
        .alias("remove")
        .alias("delete")
        .description("Remove a cron job")
        .argument("<id>", "Job id")
        .option("--json", "Output JSON", false)
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.remove", opts, { id: id })];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }));
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("enable")
        .description("Enable a cron job")
        .argument("<id>", "Job id")
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.update", opts, {
                            id: id,
                            patch: { enabled: true },
                        })];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [4 /*yield*/, (0, shared_js_1.warnIfCronSchedulerDisabled)(opts)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }));
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("disable")
        .description("Disable a cron job")
        .argument("<id>", "Job id")
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.update", opts, {
                            id: id,
                            patch: { enabled: false },
                        })];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [4 /*yield*/, (0, shared_js_1.warnIfCronSchedulerDisabled)(opts)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }));
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("runs")
        .description("Show cron run history (JSONL-backed)")
        .requiredOption("--id <id>", "Job id")
        .option("--limit <n>", "Max entries (default 50)", "50")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var limitRaw, limit, id, res, err_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    limitRaw = Number.parseInt(String((_a = opts.limit) !== null && _a !== void 0 ? _a : "50"), 10);
                    limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 50;
                    id = String(opts.id);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.runs", opts, {
                            id: id,
                            limit: limit,
                        })];
                case 1:
                    res = _b.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _b.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_4)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }));
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("run")
        .description("Run a cron job now (debug)")
        .argument("<id>", "Job id")
        .option("--force", "Run even if not due", false)
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.run", opts, {
                            id: id,
                            mode: opts.force ? "force" : "due",
                        })];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_5)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }));
}
