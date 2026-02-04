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
var voicewake_js_1 = require("./voicewake.js");
(0, vitest_1.describe)("voicewake store", function () {
    (0, vitest_1.it)("returns defaults when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-voicewake-"))];
                case 1:
                    baseDir = _a.sent();
                    return [4 /*yield*/, (0, voicewake_js_1.loadVoiceWakeConfig)(baseDir)];
                case 2:
                    cfg = _a.sent();
                    (0, vitest_1.expect)(cfg.triggers).toEqual((0, voicewake_js_1.defaultVoiceWakeTriggers)());
                    (0, vitest_1.expect)(cfg.updatedAtMs).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes and persists triggers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir, saved, loaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-voicewake-"))];
                case 1:
                    baseDir = _a.sent();
                    return [4 /*yield*/, (0, voicewake_js_1.setVoiceWakeTriggers)(["  hi  ", "", "  there "], baseDir)];
                case 2:
                    saved = _a.sent();
                    (0, vitest_1.expect)(saved.triggers).toEqual(["hi", "there"]);
                    (0, vitest_1.expect)(saved.updatedAtMs).toBeGreaterThan(0);
                    return [4 /*yield*/, (0, voicewake_js_1.loadVoiceWakeConfig)(baseDir)];
                case 3:
                    loaded = _a.sent();
                    (0, vitest_1.expect)(loaded.triggers).toEqual(["hi", "there"]);
                    (0, vitest_1.expect)(loaded.updatedAtMs).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to defaults when triggers empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir, saved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-voicewake-"))];
                case 1:
                    baseDir = _a.sent();
                    return [4 /*yield*/, (0, voicewake_js_1.setVoiceWakeTriggers)(["", "   "], baseDir)];
                case 2:
                    saved = _a.sent();
                    (0, vitest_1.expect)(saved.triggers).toEqual((0, voicewake_js_1.defaultVoiceWakeTriggers)());
                    return [2 /*return*/];
            }
        });
    }); });
});
