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
var callGateway = vitest_1.vi.hoisted(function () { return ({
    callGateway: vitest_1.vi.fn(),
}); }).callGateway;
vitest_1.vi.mock("../gateway/call.js", function () { return ({ callGateway: callGateway }); });
vitest_1.vi.mock("../media/image-ops.js", function () { return ({
    getImageMetadata: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ width: 1, height: 1 })];
    }); }); }),
    resizeToJpeg: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, Buffer.from("jpeg")];
    }); }); }),
}); });
require("./test-helpers/fast-core-tools.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
(0, vitest_1.describe)("nodes camera_snap", function () {
    (0, vitest_1.beforeEach)(function () {
        callGateway.mockReset();
    });
    (0, vitest_1.it)("maps jpg payloads to image/jpeg", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, images;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    callGateway.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var method = _b.method;
                        return __generator(this, function (_c) {
                            if (method === "node.list") {
                                return [2 /*return*/, { nodes: [{ nodeId: "mac-1" }] }];
                            }
                            if (method === "node.invoke") {
                                return [2 /*return*/, {
                                        payload: {
                                            format: "jpg",
                                            base64: "aGVsbG8=",
                                            width: 1,
                                            height: 1,
                                        },
                                    }];
                            }
                            throw new Error("unexpected method: ".concat(String(method)));
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "nodes"; });
                    if (!tool) {
                        throw new Error("missing nodes tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", {
                            action: "camera_snap",
                            node: "mac-1",
                            facing: "front",
                        })];
                case 1:
                    result = _c.sent();
                    images = ((_a = result.content) !== null && _a !== void 0 ? _a : []).filter(function (block) { return block.type === "image"; });
                    (0, vitest_1.expect)(images).toHaveLength(1);
                    (0, vitest_1.expect)((_b = images[0]) === null || _b === void 0 ? void 0 : _b.mimeType).toBe("image/jpeg");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes deviceId when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var method = _b.method, params = _b.params;
                        return __generator(this, function (_c) {
                            if (method === "node.list") {
                                return [2 /*return*/, { nodes: [{ nodeId: "mac-1" }] }];
                            }
                            if (method === "node.invoke") {
                                (0, vitest_1.expect)(params).toMatchObject({
                                    command: "camera.snap",
                                    params: { deviceId: "cam-123" },
                                });
                                return [2 /*return*/, {
                                        payload: {
                                            format: "jpg",
                                            base64: "aGVsbG8=",
                                            width: 1,
                                            height: 1,
                                        },
                                    }];
                            }
                            throw new Error("unexpected method: ".concat(String(method)));
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "nodes"; });
                    if (!tool) {
                        throw new Error("missing nodes tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", {
                            action: "camera_snap",
                            node: "mac-1",
                            facing: "front",
                            deviceId: "cam-123",
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("nodes run", function () {
    (0, vitest_1.beforeEach)(function () {
        callGateway.mockReset();
    });
    (0, vitest_1.it)("passes invoke and command timeouts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGateway.mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var method = _b.method, params = _b.params;
                        return __generator(this, function (_c) {
                            if (method === "node.list") {
                                return [2 /*return*/, { nodes: [{ nodeId: "mac-1", commands: ["system.run"] }] }];
                            }
                            if (method === "node.invoke") {
                                (0, vitest_1.expect)(params).toMatchObject({
                                    nodeId: "mac-1",
                                    command: "system.run",
                                    timeoutMs: 45000,
                                    params: {
                                        command: ["echo", "hi"],
                                        cwd: "/tmp",
                                        env: { FOO: "bar" },
                                        timeoutMs: 12000,
                                    },
                                });
                                return [2 /*return*/, {
                                        payload: { stdout: "", stderr: "", exitCode: 0, success: true },
                                    }];
                            }
                            throw new Error("unexpected method: ".concat(String(method)));
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)().find(function (candidate) { return candidate.name === "nodes"; });
                    if (!tool) {
                        throw new Error("missing nodes tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", {
                            action: "run",
                            node: "mac-1",
                            command: ["echo", "hi"],
                            cwd: "/tmp",
                            env: ["FOO=bar"],
                            commandTimeoutMs: 12000,
                            invokeTimeoutMs: 45000,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
