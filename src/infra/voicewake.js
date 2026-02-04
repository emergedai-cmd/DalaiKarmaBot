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
exports.defaultVoiceWakeTriggers = defaultVoiceWakeTriggers;
exports.loadVoiceWakeConfig = loadVoiceWakeConfig;
exports.setVoiceWakeTriggers = setVoiceWakeTriggers;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var DEFAULT_TRIGGERS = ["openclaw", "claude", "computer"];
function resolvePath(baseDir) {
    var root = baseDir !== null && baseDir !== void 0 ? baseDir : (0, paths_js_1.resolveStateDir)();
    return node_path_1.default.join(root, "settings", "voicewake.json");
}
function sanitizeTriggers(triggers) {
    var cleaned = (triggers !== null && triggers !== void 0 ? triggers : [])
        .map(function (w) { return (typeof w === "string" ? w.trim() : ""); })
        .filter(function (w) { return w.length > 0; });
    return cleaned.length > 0 ? cleaned : DEFAULT_TRIGGERS;
}
function readJSON(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(filePath, "utf8")];
                case 1:
                    raw = _b.sent();
                    return [2 /*return*/, JSON.parse(raw)];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function writeJSONAtomic(filePath, value) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, tmp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_path_1.default.dirname(filePath);
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    tmp = "".concat(filePath, ".").concat((0, node_crypto_1.randomUUID)(), ".tmp");
                    return [4 /*yield*/, promises_1.default.writeFile(tmp, JSON.stringify(value, null, 2), "utf8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rename(tmp, filePath)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var lock = Promise.resolve();
function withLock(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var prev, release;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = lock;
                    lock = new Promise(function (resolve) {
                        release = resolve;
                    });
                    return [4 /*yield*/, prev];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, fn()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    release === null || release === void 0 ? void 0 : release();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function defaultVoiceWakeTriggers() {
    return __spreadArray([], DEFAULT_TRIGGERS, true);
}
function loadVoiceWakeConfig(baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = resolvePath(baseDir);
                    return [4 /*yield*/, readJSON(filePath)];
                case 1:
                    existing = _a.sent();
                    if (!existing) {
                        return [2 /*return*/, { triggers: defaultVoiceWakeTriggers(), updatedAtMs: 0 }];
                    }
                    return [2 /*return*/, {
                            triggers: sanitizeTriggers(existing.triggers),
                            updatedAtMs: typeof existing.updatedAtMs === "number" && existing.updatedAtMs > 0
                                ? existing.updatedAtMs
                                : 0,
                        }];
            }
        });
    });
}
function setVoiceWakeTriggers(triggers, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var sanitized, filePath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sanitized = sanitizeTriggers(triggers);
                    filePath = resolvePath(baseDir);
                    return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                            var next;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        next = {
                                            triggers: sanitized,
                                            updatedAtMs: Date.now(),
                                        };
                                        return [4 /*yield*/, writeJSONAtomic(filePath, next)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, next];
                                }
                            });
                        }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
