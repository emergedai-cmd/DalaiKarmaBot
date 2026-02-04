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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var fsMocks = vitest_1.vi.hoisted(function () { return ({
    access: vitest_1.vi.fn(),
    realpath: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("node:fs/promises", function () { return ({
    default: { access: fsMocks.access, realpath: fsMocks.realpath },
    access: fsMocks.access,
    realpath: fsMocks.realpath,
}); });
var program_args_js_1 = require("./program-args.js");
var originalArgv = __spreadArray([], process.argv, true);
(0, vitest_1.afterEach)(function () {
    process.argv = __spreadArray([], originalArgv, true);
    vitest_1.vi.resetAllMocks();
});
(0, vitest_1.describe)("resolveGatewayProgramArguments", function () {
    (0, vitest_1.it)("uses realpath-resolved dist entry when running via npx shim", function () { return __awaiter(void 0, void 0, void 0, function () {
        var argv1, entryPath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    argv1 = node_path_1.default.resolve("/tmp/.npm/_npx/63c3/node_modules/.bin/openclaw");
                    entryPath = node_path_1.default.resolve("/tmp/.npm/_npx/63c3/node_modules/openclaw/dist/entry.js");
                    process.argv = ["node", argv1];
                    fsMocks.realpath.mockResolvedValue(entryPath);
                    fsMocks.access.mockImplementation(function (target) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (target === entryPath) {
                                return [2 /*return*/];
                            }
                            throw new Error("missing");
                        });
                    }); });
                    return [4 /*yield*/, (0, program_args_js_1.resolveGatewayProgramArguments)({ port: 18789 })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.programArguments).toEqual([
                        process.execPath,
                        entryPath,
                        "gateway",
                        "--port",
                        "18789",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers symlinked path over realpath for stable service config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var symlinkPath, realpathResolved, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    symlinkPath = node_path_1.default.resolve("/Users/test/Library/pnpm/global/5/node_modules/openclaw/dist/entry.js");
                    realpathResolved = node_path_1.default.resolve("/Users/test/Library/pnpm/global/5/node_modules/.pnpm/openclaw@2026.1.21-2/node_modules/openclaw/dist/entry.js");
                    process.argv = ["node", symlinkPath];
                    fsMocks.realpath.mockResolvedValue(realpathResolved);
                    fsMocks.access.mockResolvedValue(undefined); // Both paths exist
                    return [4 /*yield*/, (0, program_args_js_1.resolveGatewayProgramArguments)({ port: 18789 })];
                case 1:
                    result = _a.sent();
                    // Should use the symlinked path, not the realpath-resolved versioned path
                    (0, vitest_1.expect)(result.programArguments[1]).toBe(symlinkPath);
                    (0, vitest_1.expect)(result.programArguments[1]).not.toContain("@2026.1.21-2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to node_modules package dist when .bin path is not resolved", function () { return __awaiter(void 0, void 0, void 0, function () {
        var argv1, indexPath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    argv1 = node_path_1.default.resolve("/tmp/.npm/_npx/63c3/node_modules/.bin/openclaw");
                    indexPath = node_path_1.default.resolve("/tmp/.npm/_npx/63c3/node_modules/openclaw/dist/index.js");
                    process.argv = ["node", argv1];
                    fsMocks.realpath.mockRejectedValue(new Error("no realpath"));
                    fsMocks.access.mockImplementation(function (target) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (target === indexPath) {
                                return [2 /*return*/];
                            }
                            throw new Error("missing");
                        });
                    }); });
                    return [4 /*yield*/, (0, program_args_js_1.resolveGatewayProgramArguments)({ port: 18789 })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.programArguments).toEqual([
                        process.execPath,
                        indexPath,
                        "gateway",
                        "--port",
                        "18789",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
