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
var runner_js_1 = require("./runner.js");
(0, vitest_1.describe)("runCapability auto audio entries", function () {
    (0, vitest_1.it)("uses provider keys to auto-enable audio transcription", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalPath, tmpPath, ctx, media, cache, seenModel, providerRegistry, cfg, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    originalPath = process.env.PATH;
                    process.env.PATH = "/usr/bin:/bin";
                    tmpPath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auto-audio-".concat(Date.now(), ".wav"));
                    return [4 /*yield*/, promises_1.default.writeFile(tmpPath, Buffer.from("RIFF"))];
                case 1:
                    _b.sent();
                    ctx = { MediaPath: tmpPath, MediaType: "audio/wav" };
                    media = (0, runner_js_1.normalizeMediaAttachments)(ctx);
                    cache = (0, runner_js_1.createMediaAttachmentCache)(media);
                    providerRegistry = (0, runner_js_1.buildProviderRegistry)({
                        openai: {
                            id: "openai",
                            capabilities: ["audio"],
                            transcribeAudio: function (req) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    seenModel = req.model;
                                    return [2 /*return*/, { text: "ok", model: req.model }];
                                });
                            }); },
                        },
                    });
                    cfg = {
                        models: {
                            providers: {
                                openai: {
                                    apiKey: "test-key",
                                    models: [],
                                },
                            },
                        },
                    };
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 4, 7]);
                    return [4 /*yield*/, (0, runner_js_1.runCapability)({
                            capability: "audio",
                            cfg: cfg,
                            ctx: ctx,
                            attachments: cache,
                            media: media,
                            providerRegistry: providerRegistry,
                        })];
                case 3:
                    result = _b.sent();
                    (0, vitest_1.expect)((_a = result.outputs[0]) === null || _a === void 0 ? void 0 : _a.text).toBe("ok");
                    (0, vitest_1.expect)(seenModel).toBe("gpt-4o-mini-transcribe");
                    (0, vitest_1.expect)(result.decision.outcome).toBe("success");
                    return [3 /*break*/, 7];
                case 4:
                    process.env.PATH = originalPath;
                    return [4 /*yield*/, cache.cleanup()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.unlink(tmpPath).catch(function () { })];
                case 6:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips auto audio when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalPath, tmpPath, ctx, media, cache, providerRegistry, cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalPath = process.env.PATH;
                    process.env.PATH = "/usr/bin:/bin";
                    tmpPath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auto-audio-".concat(Date.now(), ".wav"));
                    return [4 /*yield*/, promises_1.default.writeFile(tmpPath, Buffer.from("RIFF"))];
                case 1:
                    _a.sent();
                    ctx = { MediaPath: tmpPath, MediaType: "audio/wav" };
                    media = (0, runner_js_1.normalizeMediaAttachments)(ctx);
                    cache = (0, runner_js_1.createMediaAttachmentCache)(media);
                    providerRegistry = (0, runner_js_1.buildProviderRegistry)({
                        openai: {
                            id: "openai",
                            capabilities: ["audio"],
                            transcribeAudio: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ text: "ok", model: "whisper-1" })];
                            }); }); },
                        },
                    });
                    cfg = {
                        models: {
                            providers: {
                                openai: {
                                    apiKey: "test-key",
                                    models: [],
                                },
                            },
                        },
                        tools: {
                            media: {
                                audio: {
                                    enabled: false,
                                },
                            },
                        },
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 7]);
                    return [4 /*yield*/, (0, runner_js_1.runCapability)({
                            capability: "audio",
                            cfg: cfg,
                            ctx: ctx,
                            attachments: cache,
                            media: media,
                            providerRegistry: providerRegistry,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.outputs).toHaveLength(0);
                    (0, vitest_1.expect)(result.decision.outcome).toBe("disabled");
                    return [3 /*break*/, 7];
                case 4:
                    process.env.PATH = originalPath;
                    return [4 /*yield*/, cache.cleanup()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.unlink(tmpPath).catch(function () { })];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
});
