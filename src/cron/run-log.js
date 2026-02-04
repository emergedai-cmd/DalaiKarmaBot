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
exports.resolveCronRunLogPath = resolveCronRunLogPath;
exports.appendCronRunLog = appendCronRunLog;
exports.readCronRunLogEntries = readCronRunLogEntries;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
function resolveCronRunLogPath(params) {
    var storePath = node_path_1.default.resolve(params.storePath);
    var dir = node_path_1.default.dirname(storePath);
    return node_path_1.default.join(dir, "runs", "".concat(params.jobId, ".jsonl"));
}
var writesByPath = new Map();
function pruneIfNeeded(filePath, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var stat, raw, lines, kept, tmp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.stat(filePath).catch(function () { return null; })];
                case 1:
                    stat = _a.sent();
                    if (!stat || stat.size <= opts.maxBytes) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, promises_1.default.readFile(filePath, "utf-8").catch(function () { return ""; })];
                case 2:
                    raw = _a.sent();
                    lines = raw
                        .split("\n")
                        .map(function (l) { return l.trim(); })
                        .filter(Boolean);
                    kept = lines.slice(Math.max(0, lines.length - opts.keepLines));
                    tmp = "".concat(filePath, ".").concat(process.pid, ".").concat(Math.random().toString(16).slice(2), ".tmp");
                    return [4 /*yield*/, promises_1.default.writeFile(tmp, "".concat(kept.join("\n"), "\n"), "utf-8")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rename(tmp, filePath)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function appendCronRunLog(filePath, entry, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var resolved, prev, next;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resolved = node_path_1.default.resolve(filePath);
                    prev = (_a = writesByPath.get(resolved)) !== null && _a !== void 0 ? _a : Promise.resolve();
                    next = prev
                        .catch(function () { return undefined; })
                        .then(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(resolved), { recursive: true })];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, promises_1.default.appendFile(resolved, "".concat(JSON.stringify(entry), "\n"), "utf-8")];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, pruneIfNeeded(resolved, {
                                            maxBytes: (_a = opts === null || opts === void 0 ? void 0 : opts.maxBytes) !== null && _a !== void 0 ? _a : 2000000,
                                            keepLines: (_b = opts === null || opts === void 0 ? void 0 : opts.keepLines) !== null && _b !== void 0 ? _b : 2000,
                                        })];
                                case 3:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    writesByPath.set(resolved, next);
                    return [4 /*yield*/, next];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function readCronRunLogEntries(filePath, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, jobId, raw, parsed, lines, i, line, obj;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    limit = Math.max(1, Math.min(5000, Math.floor((_a = opts === null || opts === void 0 ? void 0 : opts.limit) !== null && _a !== void 0 ? _a : 200)));
                    jobId = ((_b = opts === null || opts === void 0 ? void 0 : opts.jobId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.resolve(filePath), "utf-8").catch(function () { return ""; })];
                case 1:
                    raw = _d.sent();
                    if (!raw.trim()) {
                        return [2 /*return*/, []];
                    }
                    parsed = [];
                    lines = raw.split("\n");
                    for (i = lines.length - 1; i >= 0 && parsed.length < limit; i--) {
                        line = (_c = lines[i]) === null || _c === void 0 ? void 0 : _c.trim();
                        if (!line) {
                            continue;
                        }
                        try {
                            obj = JSON.parse(line);
                            if (!obj || typeof obj !== "object") {
                                continue;
                            }
                            if (obj.action !== "finished") {
                                continue;
                            }
                            if (typeof obj.jobId !== "string" || obj.jobId.trim().length === 0) {
                                continue;
                            }
                            if (typeof obj.ts !== "number" || !Number.isFinite(obj.ts)) {
                                continue;
                            }
                            if (jobId && obj.jobId !== jobId) {
                                continue;
                            }
                            parsed.push(obj);
                        }
                        catch (_e) {
                            // ignore invalid lines
                        }
                    }
                    return [2 /*return*/, parsed.toReversed()];
            }
        });
    });
}
