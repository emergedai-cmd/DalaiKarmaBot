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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var run_log_js_1 = require("./run-log.js");
(0, vitest_1.describe)("cron run log", function () {
    (0, vitest_1.it)("resolves store path to per-job runs/<jobId>.jsonl", function () {
        var storePath = node_path_1.default.join(node_os_1.default.tmpdir(), "cron", "jobs.json");
        var p = (0, run_log_js_1.resolveCronRunLogPath)({ storePath: storePath, jobId: "job-1" });
        (0, vitest_1.expect)(p.endsWith(node_path_1.default.join(node_os_1.default.tmpdir(), "cron", "runs", "job-1.jsonl"))).toBe(true);
    });
    (0, vitest_1.it)("appends JSONL and prunes by line count", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, logPath, i, raw, lines, last;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-cron-log-"))];
                case 1:
                    dir = _b.sent();
                    logPath = node_path_1.default.join(dir, "runs", "job-1.jsonl");
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < 10)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, run_log_js_1.appendCronRunLog)(logPath, {
                            ts: 1000 + i,
                            jobId: "job-1",
                            action: "finished",
                            status: "ok",
                            durationMs: i,
                        }, { maxBytes: 1, keepLines: 3 })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, promises_1.default.readFile(logPath, "utf-8")];
                case 6:
                    raw = _b.sent();
                    lines = raw
                        .split("\n")
                        .map(function (l) { return l.trim(); })
                        .filter(Boolean);
                    (0, vitest_1.expect)(lines.length).toBe(3);
                    last = JSON.parse((_a = lines[2]) !== null && _a !== void 0 ? _a : "{}");
                    (0, vitest_1.expect)(last.ts).toBe(1009);
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reads newest entries and filters by jobId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, logPathA, logPathB, allA, onlyA, lastOne, onlyB, wrongFilter;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-cron-log-read-"))];
                case 1:
                    dir = _b.sent();
                    logPathA = node_path_1.default.join(dir, "runs", "a.jsonl");
                    logPathB = node_path_1.default.join(dir, "runs", "b.jsonl");
                    return [4 /*yield*/, (0, run_log_js_1.appendCronRunLog)(logPathA, {
                            ts: 1,
                            jobId: "a",
                            action: "finished",
                            status: "ok",
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, run_log_js_1.appendCronRunLog)(logPathB, {
                            ts: 2,
                            jobId: "b",
                            action: "finished",
                            status: "error",
                            error: "nope",
                            summary: "oops",
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, run_log_js_1.appendCronRunLog)(logPathA, {
                            ts: 3,
                            jobId: "a",
                            action: "finished",
                            status: "skipped",
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, run_log_js_1.readCronRunLogEntries)(logPathA, { limit: 10 })];
                case 5:
                    allA = _b.sent();
                    (0, vitest_1.expect)(allA.map(function (e) { return e.jobId; })).toEqual(["a", "a"]);
                    return [4 /*yield*/, (0, run_log_js_1.readCronRunLogEntries)(logPathA, {
                            limit: 10,
                            jobId: "a",
                        })];
                case 6:
                    onlyA = _b.sent();
                    (0, vitest_1.expect)(onlyA.map(function (e) { return e.ts; })).toEqual([1, 3]);
                    return [4 /*yield*/, (0, run_log_js_1.readCronRunLogEntries)(logPathA, { limit: 1 })];
                case 7:
                    lastOne = _b.sent();
                    (0, vitest_1.expect)(lastOne.map(function (e) { return e.ts; })).toEqual([3]);
                    return [4 /*yield*/, (0, run_log_js_1.readCronRunLogEntries)(logPathB, {
                            limit: 10,
                            jobId: "b",
                        })];
                case 8:
                    onlyB = _b.sent();
                    (0, vitest_1.expect)((_a = onlyB[0]) === null || _a === void 0 ? void 0 : _a.summary).toBe("oops");
                    return [4 /*yield*/, (0, run_log_js_1.readCronRunLogEntries)(logPathA, {
                            limit: 10,
                            jobId: "b",
                        })];
                case 9:
                    wrongFilter = _b.sent();
                    (0, vitest_1.expect)(wrongFilter).toEqual([]);
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
