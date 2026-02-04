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
var ssrf_js_1 = require("./ssrf.js");
(0, vitest_1.describe)("ssrf pinning", function () {
    (0, vitest_1.it)("pins resolved addresses for the target hostname", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lookup, pinned, first, all;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lookup = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [
                                    { address: "93.184.216.34", family: 4 },
                                    { address: "93.184.216.35", family: 4 },
                                ]];
                        });
                    }); });
                    return [4 /*yield*/, (0, ssrf_js_1.resolvePinnedHostname)("Example.com.", lookup)];
                case 1:
                    pinned = _a.sent();
                    (0, vitest_1.expect)(pinned.hostname).toBe("example.com");
                    (0, vitest_1.expect)(pinned.addresses).toEqual(["93.184.216.34", "93.184.216.35"]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            pinned.lookup("example.com", function (err, address, family) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve({ address: address, family: family });
                                }
                            });
                        })];
                case 2:
                    first = _a.sent();
                    (0, vitest_1.expect)(first.address).toBe("93.184.216.34");
                    (0, vitest_1.expect)(first.family).toBe(4);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            pinned.lookup("example.com", { all: true }, function (err, addresses) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(addresses);
                                }
                            });
                        })];
                case 3:
                    all = _a.sent();
                    (0, vitest_1.expect)(Array.isArray(all)).toBe(true);
                    (0, vitest_1.expect)(all.map(function (entry) { return entry.address; })).toEqual(pinned.addresses);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects private DNS results", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lookup;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lookup = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, [{ address: "10.0.0.8", family: 4 }]];
                    }); }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, ssrf_js_1.resolvePinnedHostname)("example.com", lookup)).rejects.toThrow(/private|internal/i)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back for non-matching hostnames", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fallback, lookup, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fallback = vitest_1.vi.fn(function (host, options, callback) {
                        var cb = typeof options === "function" ? options : callback;
                        cb(null, "1.2.3.4", 4);
                    });
                    lookup = (0, ssrf_js_1.createPinnedLookup)({
                        hostname: "example.com",
                        addresses: ["93.184.216.34"],
                        fallback: fallback,
                    });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            lookup("other.test", function (err, address) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve({ address: address });
                                }
                            });
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(fallback).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(result.address).toBe("1.2.3.4");
                    return [2 /*return*/];
            }
        });
    }); });
});
