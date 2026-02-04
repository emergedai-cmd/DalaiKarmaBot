"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.logsHandlers = void 0;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var logging_js_1 = require("../../logging.js");
var index_js_1 = require("../protocol/index.js");
var DEFAULT_LIMIT = 500;
var DEFAULT_MAX_BYTES = 250000;
var MAX_LIMIT = 5000;
var MAX_BYTES = 1000000;
var ROLLING_LOG_RE = /^openclaw-\d{4}-\d{2}-\d{2}\.log$/;
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function isRollingLogFile(file) {
    return ROLLING_LOG_RE.test(node_path_1.default.basename(file));
}
function resolveLogFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var stat, dir, entries, candidates, sorted;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.stat(file).catch(function () { return null; })];
                case 1:
                    stat = _c.sent();
                    if (stat) {
                        return [2 /*return*/, file];
                    }
                    if (!isRollingLogFile(file)) {
                        return [2 /*return*/, file];
                    }
                    dir = node_path_1.default.dirname(file);
                    return [4 /*yield*/, promises_1.default.readdir(dir, { withFileTypes: true }).catch(function () { return null; })];
                case 2:
                    entries = _c.sent();
                    if (!entries) {
                        return [2 /*return*/, file];
                    }
                    return [4 /*yield*/, Promise.all(entries
                            .filter(function (entry) { return entry.isFile() && ROLLING_LOG_RE.test(entry.name); })
                            .map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                            var fullPath, fileStat;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fullPath = node_path_1.default.join(dir, entry.name);
                                        return [4 /*yield*/, promises_1.default.stat(fullPath).catch(function () { return null; })];
                                    case 1:
                                        fileStat = _a.sent();
                                        return [2 /*return*/, fileStat ? { path: fullPath, mtimeMs: fileStat.mtimeMs } : null];
                                }
                            });
                        }); }))];
                case 3:
                    candidates = _c.sent();
                    sorted = candidates
                        .filter(function (entry) { return Boolean(entry); })
                        .toSorted(function (a, b) { return b.mtimeMs - a.mtimeMs; });
                    return [2 /*return*/, (_b = (_a = sorted[0]) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : file];
            }
        });
    });
}
function readLogSlice(params) {
    return __awaiter(this, void 0, void 0, function () {
        var stat, size, maxBytes, limit, cursor, reset, truncated, start, handle, prefix, prefixBuf, prefixRead, length_1, buffer, readResult, text, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.stat(params.file).catch(function () { return null; })];
                case 1:
                    stat = _a.sent();
                    if (!stat) {
                        return [2 /*return*/, {
                                cursor: 0,
                                size: 0,
                                lines: [],
                                truncated: false,
                                reset: false,
                            }];
                    }
                    size = stat.size;
                    maxBytes = clamp(params.maxBytes, 1, MAX_BYTES);
                    limit = clamp(params.limit, 1, MAX_LIMIT);
                    cursor = typeof params.cursor === "number" && Number.isFinite(params.cursor)
                        ? Math.max(0, Math.floor(params.cursor))
                        : undefined;
                    reset = false;
                    truncated = false;
                    start = 0;
                    if (cursor != null) {
                        if (cursor > size) {
                            reset = true;
                            start = Math.max(0, size - maxBytes);
                            truncated = start > 0;
                        }
                        else {
                            start = cursor;
                            if (size - start > maxBytes) {
                                reset = true;
                                truncated = true;
                                start = Math.max(0, size - maxBytes);
                            }
                        }
                    }
                    else {
                        start = Math.max(0, size - maxBytes);
                        truncated = start > 0;
                    }
                    if (size === 0 || size <= start) {
                        return [2 /*return*/, {
                                cursor: size,
                                size: size,
                                lines: [],
                                truncated: truncated,
                                reset: reset,
                            }];
                    }
                    return [4 /*yield*/, promises_1.default.open(params.file, "r")];
                case 2:
                    handle = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 7, 9]);
                    prefix = "";
                    if (!(start > 0)) return [3 /*break*/, 5];
                    prefixBuf = Buffer.alloc(1);
                    return [4 /*yield*/, handle.read(prefixBuf, 0, 1, start - 1)];
                case 4:
                    prefixRead = _a.sent();
                    prefix = prefixBuf.toString("utf8", 0, prefixRead.bytesRead);
                    _a.label = 5;
                case 5:
                    length_1 = Math.max(0, size - start);
                    buffer = Buffer.alloc(length_1);
                    return [4 /*yield*/, handle.read(buffer, 0, length_1, start)];
                case 6:
                    readResult = _a.sent();
                    text = buffer.toString("utf8", 0, readResult.bytesRead);
                    lines = text.split("\n");
                    if (start > 0 && prefix !== "\n") {
                        lines = lines.slice(1);
                    }
                    if (lines.length > 0 && lines[lines.length - 1] === "") {
                        lines = lines.slice(0, -1);
                    }
                    if (lines.length > limit) {
                        lines = lines.slice(lines.length - limit);
                    }
                    cursor = size;
                    return [2 /*return*/, {
                            cursor: cursor,
                            size: size,
                            lines: lines,
                            truncated: truncated,
                            reset: reset,
                        }];
                case 7: return [4 /*yield*/, handle.close()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.logsHandlers = {
    "logs.tail": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, configuredFile, file, result, err_1;
        var _c, _d;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_1.validateLogsTailParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid logs.tail params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateLogsTailParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    configuredFile = (0, logging_js_1.getResolvedLoggerSettings)().file;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, resolveLogFile(configuredFile)];
                case 2:
                    file = _e.sent();
                    return [4 /*yield*/, readLogSlice({
                            file: file,
                            cursor: p.cursor,
                            limit: (_c = p.limit) !== null && _c !== void 0 ? _c : DEFAULT_LIMIT,
                            maxBytes: (_d = p.maxBytes) !== null && _d !== void 0 ? _d : DEFAULT_MAX_BYTES,
                        })];
                case 3:
                    result = _e.sent();
                    respond(true, __assign({ file: file }, result), undefined);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _e.sent();
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "log read failed: ".concat(String(err_1))));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
};
