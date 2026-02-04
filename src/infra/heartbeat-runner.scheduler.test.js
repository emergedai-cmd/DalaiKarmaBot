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
var vitest_1 = require("vitest");
var heartbeat_runner_js_1 = require("./heartbeat-runner.js");
(0, vitest_1.describe)("startHeartbeatRunner", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("updates scheduling when config changes without restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runSpy, runner;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(new Date(0));
                    runSpy = vitest_1.vi.fn().mockResolvedValue({ status: "ran", durationMs: 1 });
                    runner = (0, heartbeat_runner_js_1.startHeartbeatRunner)({
                        cfg: {
                            agents: { defaults: { heartbeat: { every: "30m" } } },
                        },
                        runOnce: runSpy,
                    });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(30 * 60000 + 1000)];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(runSpy).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = runSpy.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]).toEqual(vitest_1.expect.objectContaining({ agentId: "main", reason: "interval" }));
                    runner.updateConfig({
                        agents: {
                            defaults: { heartbeat: { every: "30m" } },
                            list: [
                                { id: "main", heartbeat: { every: "10m" } },
                                { id: "ops", heartbeat: { every: "15m" } },
                            ],
                        },
                    });
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(10 * 60000 + 1000)];
                case 2:
                    _d.sent();
                    (0, vitest_1.expect)(runSpy).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_b = runSpy.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[0]).toEqual(vitest_1.expect.objectContaining({ agentId: "main", heartbeat: { every: "10m" } }));
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(5 * 60000 + 1000)];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(runSpy).toHaveBeenCalledTimes(3);
                    (0, vitest_1.expect)((_c = runSpy.mock.calls[2]) === null || _c === void 0 ? void 0 : _c[0]).toEqual(vitest_1.expect.objectContaining({ agentId: "ops", heartbeat: { every: "15m" } }));
                    runner.stop();
                    return [2 /*return*/];
            }
        });
    }); });
});
