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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var legacy_names_js_1 = require("../compat/legacy-names.js");
var schema_js_1 = require("../gateway/protocol/schema.js");
function extractCronChannels(schema) {
    var _a, _b;
    var union = (_a = schema.anyOf) !== null && _a !== void 0 ? _a : [];
    var payloadWithChannel = union.find(function (entry) {
        return Boolean((entry === null || entry === void 0 ? void 0 : entry.properties) && "channel" in entry.properties);
    });
    var channelSchema = (payloadWithChannel === null || payloadWithChannel === void 0 ? void 0 : payloadWithChannel.properties)
        ? payloadWithChannel.properties.channel
        : undefined;
    var channels = ((_b = channelSchema === null || channelSchema === void 0 ? void 0 : channelSchema.anyOf) !== null && _b !== void 0 ? _b : [])
        .map(function (entry) { return entry === null || entry === void 0 ? void 0 : entry.const; })
        .filter(function (value) { return typeof value === "string"; });
    return channels;
}
var UI_FILES = ["ui/src/ui/types.ts", "ui/src/ui/ui-types.ts", "ui/src/ui/views/cron.ts"];
var SWIFT_FILE_CANDIDATES = ["".concat(legacy_names_js_1.MACOS_APP_SOURCES_DIR, "/GatewayConnection.swift")];
function resolveSwiftFiles(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var matches, _i, SWIFT_FILE_CANDIDATES_1, relPath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    matches = [];
                    _i = 0, SWIFT_FILE_CANDIDATES_1 = SWIFT_FILE_CANDIDATES;
                    _b.label = 1;
                case 1:
                    if (!(_i < SWIFT_FILE_CANDIDATES_1.length)) return [3 /*break*/, 6];
                    relPath = SWIFT_FILE_CANDIDATES_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.access(node_path_1.default.join(cwd, relPath))];
                case 3:
                    _b.sent();
                    matches.push(relPath);
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (matches.length === 0) {
                        throw new Error("Missing Swift cron definition. Tried: ".concat(SWIFT_FILE_CANDIDATES.join(", ")));
                    }
                    return [2 /*return*/, matches];
            }
        });
    });
}
(0, vitest_1.describe)("cron protocol conformance", function () {
    (0, vitest_1.it)("ui + swift include all cron providers from gateway schema", function () { return __awaiter(void 0, void 0, void 0, function () {
        var channels, cwd, _i, UI_FILES_1, relPath, content, _a, channels_1, channel, swiftFiles, _b, swiftFiles_1, relPath, content, _c, channels_2, channel, pattern;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    channels = extractCronChannels(schema_js_1.CronPayloadSchema);
                    (0, vitest_1.expect)(channels.length).toBeGreaterThan(0);
                    cwd = process.cwd();
                    _i = 0, UI_FILES_1 = UI_FILES;
                    _d.label = 1;
                case 1:
                    if (!(_i < UI_FILES_1.length)) return [3 /*break*/, 4];
                    relPath = UI_FILES_1[_i];
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(cwd, relPath), "utf-8")];
                case 2:
                    content = _d.sent();
                    for (_a = 0, channels_1 = channels; _a < channels_1.length; _a++) {
                        channel = channels_1[_a];
                        (0, vitest_1.expect)(content.includes("\"".concat(channel, "\"")), "".concat(relPath, " missing ").concat(channel)).toBe(true);
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, resolveSwiftFiles(cwd)];
                case 5:
                    swiftFiles = _d.sent();
                    _b = 0, swiftFiles_1 = swiftFiles;
                    _d.label = 6;
                case 6:
                    if (!(_b < swiftFiles_1.length)) return [3 /*break*/, 9];
                    relPath = swiftFiles_1[_b];
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(cwd, relPath), "utf-8")];
                case 7:
                    content = _d.sent();
                    for (_c = 0, channels_2 = channels; _c < channels_2.length; _c++) {
                        channel = channels_2[_c];
                        pattern = new RegExp("\\bcase\\s+".concat(channel, "\\b"));
                        (0, vitest_1.expect)(pattern.test(content), "".concat(relPath, " missing case ").concat(channel)).toBe(true);
                    }
                    _d.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("cron status shape matches gateway fields in UI + Swift", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cwd, uiTypes, swiftRelPath, swiftPath, swift;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cwd = process.cwd();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(cwd, "ui/src/ui/types.ts"), "utf-8")];
                case 1:
                    uiTypes = _a.sent();
                    (0, vitest_1.expect)(uiTypes.includes("export type CronStatus")).toBe(true);
                    (0, vitest_1.expect)(uiTypes.includes("jobs:")).toBe(true);
                    (0, vitest_1.expect)(uiTypes.includes("jobCount")).toBe(false);
                    return [4 /*yield*/, resolveSwiftFiles(cwd)];
                case 2:
                    swiftRelPath = (_a.sent())[0];
                    swiftPath = node_path_1.default.join(cwd, swiftRelPath);
                    return [4 /*yield*/, promises_1.default.readFile(swiftPath, "utf-8")];
                case 3:
                    swift = _a.sent();
                    (0, vitest_1.expect)(swift.includes("struct CronSchedulerStatus")).toBe(true);
                    (0, vitest_1.expect)(swift.includes("let jobs:")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
