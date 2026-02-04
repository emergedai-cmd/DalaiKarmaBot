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
var makeTempDir = function (prefix) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), prefix))];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var writeExecutable = function (dir, name, content) { return __awaiter(void 0, void 0, void 0, function () {
    var filePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filePath = node_path_1.default.join(dir, name);
                return [4 /*yield*/, promises_1.default.writeFile(filePath, content, { mode: 493 })];
            case 1:
                _a.sent();
                return [2 /*return*/, filePath];
        }
    });
}); };
var makeTempMedia = function (ext) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, filePath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, makeTempDir("openclaw-media-e2e-")];
            case 1:
                dir = _a.sent();
                filePath = node_path_1.default.join(dir, "sample".concat(ext));
                return [4 /*yield*/, promises_1.default.writeFile(filePath, "audio")];
            case 2:
                _a.sent();
                return [2 /*return*/, { dir: dir, filePath: filePath }];
        }
    });
}); };
var loadApply = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.resetModules();
                return [4 /*yield*/, Promise.resolve().then(function () { return require("../src/media-understanding/apply.js"); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var envSnapshot = function () { return ({
    PATH: process.env.PATH,
    SHERPA_ONNX_MODEL_DIR: process.env.SHERPA_ONNX_MODEL_DIR,
    WHISPER_CPP_MODEL: process.env.WHISPER_CPP_MODEL,
}); };
var restoreEnv = function (snapshot) {
    process.env.PATH = snapshot.PATH;
    process.env.SHERPA_ONNX_MODEL_DIR = snapshot.SHERPA_ONNX_MODEL_DIR;
    process.env.WHISPER_CPP_MODEL = snapshot.WHISPER_CPP_MODEL;
};
(0, vitest_1.describe)("media understanding auto-detect (e2e)", function () {
    var tempPaths = [];
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, tempPaths_1, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, tempPaths_1 = tempPaths;
                    _a.label = 1;
                case 1:
                    if (!(_i < tempPaths_1.length)) return [3 /*break*/, 4];
                    p = tempPaths_1[_i];
                    return [4 /*yield*/, promises_1.default.rm(p, { recursive: true, force: true }).catch(function () { })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    tempPaths = [];
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses sherpa-onnx-offline when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snapshot, binDir, modelDir, filePath, applyMediaUnderstanding, ctx, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    snapshot = envSnapshot();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 12, 13]);
                    return [4 /*yield*/, makeTempDir("openclaw-bin-sherpa-")];
                case 2:
                    binDir = _a.sent();
                    return [4 /*yield*/, makeTempDir("openclaw-sherpa-model-")];
                case 3:
                    modelDir = _a.sent();
                    tempPaths.push(binDir, modelDir);
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(modelDir, "tokens.txt"), "a")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(modelDir, "encoder.onnx"), "a")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(modelDir, "decoder.onnx"), "a")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(modelDir, "joiner.onnx"), "a")];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, writeExecutable(binDir, "sherpa-onnx-offline", "#!/usr/bin/env bash\necho \"{\\\"text\\\":\\\"sherpa ok\\\"}\"\n")];
                case 8:
                    _a.sent();
                    process.env.PATH = "".concat(binDir, ":/usr/bin:/bin");
                    process.env.SHERPA_ONNX_MODEL_DIR = modelDir;
                    return [4 /*yield*/, makeTempMedia(".wav")];
                case 9:
                    filePath = (_a.sent()).filePath;
                    tempPaths.push(node_path_1.default.dirname(filePath));
                    return [4 /*yield*/, loadApply()];
                case 10:
                    applyMediaUnderstanding = (_a.sent()).applyMediaUnderstanding;
                    ctx = {
                        Body: "<media:audio>",
                        MediaPath: filePath,
                        MediaType: "audio/wav",
                    };
                    cfg = { tools: { media: { audio: {} } } };
                    return [4 /*yield*/, applyMediaUnderstanding({ ctx: ctx, cfg: cfg })];
                case 11:
                    _a.sent();
                    (0, vitest_1.expect)(ctx.Transcript).toBe("sherpa ok");
                    return [3 /*break*/, 13];
                case 12:
                    restoreEnv(snapshot);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses whisper-cli when sherpa is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snapshot, binDir, modelDir, modelPath, filePath, applyMediaUnderstanding, ctx, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    snapshot = envSnapshot();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 9, 10]);
                    return [4 /*yield*/, makeTempDir("openclaw-bin-whispercpp-")];
                case 2:
                    binDir = _a.sent();
                    return [4 /*yield*/, makeTempDir("openclaw-whispercpp-model-")];
                case 3:
                    modelDir = _a.sent();
                    tempPaths.push(binDir, modelDir);
                    modelPath = node_path_1.default.join(modelDir, "tiny.bin");
                    return [4 /*yield*/, promises_1.default.writeFile(modelPath, "model")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, writeExecutable(binDir, "whisper-cli", "#!/usr/bin/env bash\n" +
                            'out=""\n' +
                            'prev=""\n' +
                            'for arg in "$@"; do\n' +
                            '  if [ "$prev" = "-of" ]; then out="$arg"; break; fi\n' +
                            '  prev="$arg"\n' +
                            "done\n" +
                            'if [ -n "$out" ]; then echo \'whisper cpp ok\' > "${out}.txt"; fi\n')];
                case 5:
                    _a.sent();
                    process.env.PATH = "".concat(binDir, ":/usr/bin:/bin");
                    process.env.WHISPER_CPP_MODEL = modelPath;
                    return [4 /*yield*/, makeTempMedia(".wav")];
                case 6:
                    filePath = (_a.sent()).filePath;
                    tempPaths.push(node_path_1.default.dirname(filePath));
                    return [4 /*yield*/, loadApply()];
                case 7:
                    applyMediaUnderstanding = (_a.sent()).applyMediaUnderstanding;
                    ctx = {
                        Body: "<media:audio>",
                        MediaPath: filePath,
                        MediaType: "audio/wav",
                    };
                    cfg = { tools: { media: { audio: {} } } };
                    return [4 /*yield*/, applyMediaUnderstanding({ ctx: ctx, cfg: cfg })];
                case 8:
                    _a.sent();
                    (0, vitest_1.expect)(ctx.Transcript).toBe("whisper cpp ok");
                    return [3 /*break*/, 10];
                case 9:
                    restoreEnv(snapshot);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses gemini CLI for images when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var snapshot, binDir, filePath, applyMediaUnderstanding, ctx, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    snapshot = envSnapshot();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 7, 8]);
                    return [4 /*yield*/, makeTempDir("openclaw-bin-gemini-")];
                case 2:
                    binDir = _a.sent();
                    tempPaths.push(binDir);
                    return [4 /*yield*/, writeExecutable(binDir, "gemini", "#!/usr/bin/env bash\necho '{\\\"response\\\":\\\"gemini ok\\\"' + \"}'\n")];
                case 3:
                    _a.sent();
                    process.env.PATH = "".concat(binDir, ":/usr/bin:/bin");
                    return [4 /*yield*/, makeTempMedia(".png")];
                case 4:
                    filePath = (_a.sent()).filePath;
                    tempPaths.push(node_path_1.default.dirname(filePath));
                    return [4 /*yield*/, loadApply()];
                case 5:
                    applyMediaUnderstanding = (_a.sent()).applyMediaUnderstanding;
                    ctx = {
                        Body: "<media:image>",
                        MediaPath: filePath,
                        MediaType: "image/png",
                    };
                    cfg = { tools: { media: { image: {} } } };
                    return [4 /*yield*/, applyMediaUnderstanding({ ctx: ctx, cfg: cfg })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(ctx.Body).toContain("gemini ok");
                    return [3 /*break*/, 8];
                case 7:
                    restoreEnv(snapshot);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
