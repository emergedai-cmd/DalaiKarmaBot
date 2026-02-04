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
exports.getDeterministicFreePortBlock = getDeterministicFreePortBlock;
var node_net_1 = require("node:net");
var node_worker_threads_1 = require("node:worker_threads");
function isPortFree(port) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Number.isFinite(port) || port <= 0 || port > 65535) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var server = (0, node_net_1.createServer)();
                            server.once("error", function () { return resolve(false); });
                            server.listen(port, "127.0.0.1", function () {
                                server.close(function () { return resolve(true); });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getOsFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var server = (0, node_net_1.createServer)();
                        server.once("error", reject);
                        server.listen(0, "127.0.0.1", function () {
                            var addr = server.address();
                            if (!addr || typeof addr === "string") {
                                server.close();
                                reject(new Error("failed to acquire free port"));
                                return;
                            }
                            var port = addr.port;
                            server.close(function (err) { return (err ? reject(err) : resolve(port)); });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var nextTestPortOffset = 0;
/**
 * Allocate a deterministic per-worker port block.
 *
 * Motivation: many tests spin up gateway + related services that use derived ports
 * (e.g. +1/+2/+3/+4). If each test just grabs an OS free port, parallel test runs
 * can collide on derived ports and get flaky EADDRINUSE.
 */
function getDeterministicFreePortBlock(params) {
    return __awaiter(this, void 0, void 0, function () {
        var offsets, maxOffset, workerIdRaw, workerId, shard, rangeSize, shardCount, base, usable, blockSize, _loop_1, attempt, state_1, _loop_2, attempt, state_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    offsets = (_a = params === null || params === void 0 ? void 0 : params.offsets) !== null && _a !== void 0 ? _a : [0, 1, 2, 3, 4];
                    maxOffset = Math.max.apply(Math, offsets);
                    workerIdRaw = (_c = (_b = process.env.VITEST_WORKER_ID) !== null && _b !== void 0 ? _b : process.env.VITEST_POOL_ID) !== null && _c !== void 0 ? _c : "";
                    workerId = Number.parseInt(workerIdRaw, 10);
                    shard = Number.isFinite(workerId)
                        ? Math.max(0, workerId)
                        : node_worker_threads_1.isMainThread
                            ? Math.abs(process.pid)
                            : Math.abs(node_worker_threads_1.threadId);
                    rangeSize = 1000;
                    shardCount = 30;
                    base = 30000 + (Math.abs(shard) % shardCount) * rangeSize;
                    usable = rangeSize - maxOffset;
                    blockSize = Math.max(maxOffset + 1, 8);
                    _loop_1 = function (attempt) {
                        var start, ok;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    start = base + ((nextTestPortOffset + attempt) % usable);
                                    return [4 /*yield*/, Promise.all(offsets.map(function (offset) { return isPortFree(start + offset); }))];
                                case 1:
                                    ok = (_e.sent()).every(Boolean);
                                    if (!ok) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    nextTestPortOffset = (nextTestPortOffset + attempt + blockSize) % usable;
                                    return [2 /*return*/, { value: start }];
                            }
                        });
                    };
                    attempt = 0;
                    _d.label = 1;
                case 1:
                    if (!(attempt < usable)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(attempt)];
                case 2:
                    state_1 = _d.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _d.label = 3;
                case 3:
                    attempt += 1;
                    return [3 /*break*/, 1];
                case 4:
                    _loop_2 = function (attempt) {
                        var port, ok;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, getOsFreePort()];
                                case 1:
                                    port = _f.sent();
                                    return [4 /*yield*/, Promise.all(offsets.map(function (offset) { return isPortFree(port + offset); }))];
                                case 2:
                                    ok = (_f.sent()).every(Boolean);
                                    if (ok) {
                                        return [2 /*return*/, { value: port }];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 0;
                    _d.label = 5;
                case 5:
                    if (!(attempt < 25)) return [3 /*break*/, 8];
                    return [5 /*yield**/, _loop_2(attempt)];
                case 6:
                    state_2 = _d.sent();
                    if (typeof state_2 === "object")
                        return [2 /*return*/, state_2.value];
                    _d.label = 7;
                case 7:
                    attempt += 1;
                    return [3 /*break*/, 5];
                case 8: throw new Error("failed to acquire a free port block");
            }
        });
    });
}
