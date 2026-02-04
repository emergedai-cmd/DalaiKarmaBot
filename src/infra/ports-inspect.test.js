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
var node_net_1 = require("node:net");
var vitest_1 = require("vitest");
var runCommandWithTimeoutMock = vitest_1.vi.fn();
vitest_1.vi.mock("../process/exec.js", function () { return ({
    runCommandWithTimeout: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return runCommandWithTimeoutMock.apply(void 0, args);
    },
}); });
var describeUnix = process.platform === "win32" ? vitest_1.describe.skip : vitest_1.describe;
describeUnix("inspectPortUsage", function () {
    (0, vitest_1.beforeEach)(function () {
        runCommandWithTimeoutMock.mockReset();
    });
    (0, vitest_1.it)("reports busy when lsof is missing but loopback listener exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server, port, inspectPortUsage, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    server = node_net_1.default.createServer();
                    return [4 /*yield*/, new Promise(function (resolve) { return server.listen(0, "127.0.0.1", resolve); })];
                case 1:
                    _b.sent();
                    port = server.address().port;
                    runCommandWithTimeoutMock.mockRejectedValueOnce(Object.assign(new Error("spawn lsof ENOENT"), { code: "ENOENT" }));
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./ports-inspect.js"); })];
                case 3:
                    inspectPortUsage = (_b.sent()).inspectPortUsage;
                    return [4 /*yield*/, inspectPortUsage(port)];
                case 4:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.status).toBe("busy");
                    (0, vitest_1.expect)((_a = result.errors) === null || _a === void 0 ? void 0 : _a.some(function (err) { return err.includes("ENOENT"); })).toBe(true);
                    return [3 /*break*/, 6];
                case 5:
                    server.close();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
