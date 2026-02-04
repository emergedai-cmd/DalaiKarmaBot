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
var agent_events_js_1 = require("./agent-events.js");
(0, vitest_1.describe)("agent-events sequencing", function () {
    (0, vitest_1.test)("stores and clears run context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            (0, agent_events_js_1.resetAgentRunContextForTest)();
            (0, agent_events_js_1.registerAgentRunContext)("run-1", { sessionKey: "main" });
            (0, vitest_1.expect)((_a = (0, agent_events_js_1.getAgentRunContext)("run-1")) === null || _a === void 0 ? void 0 : _a.sessionKey).toBe("main");
            (0, agent_events_js_1.clearAgentRunContext)("run-1");
            (0, vitest_1.expect)((0, agent_events_js_1.getAgentRunContext)("run-1")).toBeUndefined();
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.test)("maintains monotonic seq per runId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var seen, stop;
        return __generator(this, function (_a) {
            seen = {};
            stop = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                var _a;
                var list = (_a = seen[evt.runId]) !== null && _a !== void 0 ? _a : [];
                seen[evt.runId] = list;
                list.push(evt.seq);
            });
            (0, agent_events_js_1.emitAgentEvent)({ runId: "run-1", stream: "lifecycle", data: {} });
            (0, agent_events_js_1.emitAgentEvent)({ runId: "run-1", stream: "lifecycle", data: {} });
            (0, agent_events_js_1.emitAgentEvent)({ runId: "run-2", stream: "lifecycle", data: {} });
            (0, agent_events_js_1.emitAgentEvent)({ runId: "run-1", stream: "lifecycle", data: {} });
            stop();
            (0, vitest_1.expect)(seen["run-1"]).toEqual([1, 2, 3]);
            (0, vitest_1.expect)(seen["run-2"]).toEqual([1]);
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.test)("preserves compaction ordering on the event bus", function () { return __awaiter(void 0, void 0, void 0, function () {
        var phases, stop;
        return __generator(this, function (_a) {
            phases = [];
            stop = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                var _a;
                if (evt.runId !== "run-1") {
                    return;
                }
                if (evt.stream !== "compaction") {
                    return;
                }
                if (typeof ((_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase) === "string") {
                    phases.push(evt.data.phase);
                }
            });
            (0, agent_events_js_1.emitAgentEvent)({ runId: "run-1", stream: "compaction", data: { phase: "start" } });
            (0, agent_events_js_1.emitAgentEvent)({
                runId: "run-1",
                stream: "compaction",
                data: { phase: "end", willRetry: false },
            });
            stop();
            (0, vitest_1.expect)(phases).toEqual(["start", "end"]);
            return [2 /*return*/];
        });
    }); });
});
