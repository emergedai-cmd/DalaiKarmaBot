"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.runGatewayUpdateCheck = runGatewayUpdateCheck;
exports.scheduleGatewayUpdateCheck = scheduleGatewayUpdateCheck;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var command_format_js_1 = require("../cli/command-format.js");
var paths_js_1 = require("../config/paths.js");
var version_js_1 = require("../version.js");
var openclaw_root_js_1 = require("./openclaw-root.js");
var update_channels_js_1 = require("./update-channels.js");
var update_check_js_1 = require("./update-check.js");
var UPDATE_CHECK_FILENAME = "update-check.json";
var UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
function shouldSkipCheck(allowInTests) {
    if (allowInTests) {
        return false;
    }
    if (process.env.VITEST || process.env.NODE_ENV === "test") {
        return true;
    }
    return false;
}
function readState(statePath) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(statePath, "utf-8")];
                case 1:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    return [2 /*return*/, parsed && typeof parsed === "object" ? parsed : {}];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function writeState(statePath, state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(statePath), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(statePath, JSON.stringify(state, null, 2), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runGatewayUpdateCheck(params) {
    return __awaiter(this, void 0, void 0, function () {
        var statePath, state, now, lastCheckedAt, root, status, nextState, channel, resolved, tag, cmp, shouldNotify;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (shouldSkipCheck(Boolean(params.allowInTests))) {
                        return [2 /*return*/];
                    }
                    if (params.isNixMode) {
                        return [2 /*return*/];
                    }
                    if (((_a = params.cfg.update) === null || _a === void 0 ? void 0 : _a.checkOnStart) === false) {
                        return [2 /*return*/];
                    }
                    statePath = node_path_1.default.join((0, paths_js_1.resolveStateDir)(), UPDATE_CHECK_FILENAME);
                    return [4 /*yield*/, readState(statePath)];
                case 1:
                    state = _d.sent();
                    now = Date.now();
                    lastCheckedAt = state.lastCheckedAt ? Date.parse(state.lastCheckedAt) : null;
                    if (lastCheckedAt && Number.isFinite(lastCheckedAt)) {
                        if (now - lastCheckedAt < UPDATE_CHECK_INTERVAL_MS) {
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                            moduleUrl: import.meta.url,
                            argv1: process.argv[1],
                            cwd: process.cwd(),
                        })];
                case 2:
                    root = _d.sent();
                    return [4 /*yield*/, (0, update_check_js_1.checkUpdateStatus)({
                            root: root,
                            timeoutMs: 2500,
                            fetchGit: false,
                            includeRegistry: false,
                        })];
                case 3:
                    status = _d.sent();
                    nextState = __assign(__assign({}, state), { lastCheckedAt: new Date(now).toISOString() });
                    if (!(status.installKind !== "package")) return [3 /*break*/, 5];
                    return [4 /*yield*/, writeState(statePath, nextState)];
                case 4:
                    _d.sent();
                    return [2 /*return*/];
                case 5:
                    channel = (_c = (0, update_channels_js_1.normalizeUpdateChannel)((_b = params.cfg.update) === null || _b === void 0 ? void 0 : _b.channel)) !== null && _c !== void 0 ? _c : update_channels_js_1.DEFAULT_PACKAGE_CHANNEL;
                    return [4 /*yield*/, (0, update_check_js_1.resolveNpmChannelTag)({ channel: channel, timeoutMs: 2500 })];
                case 6:
                    resolved = _d.sent();
                    tag = resolved.tag;
                    if (!!resolved.version) return [3 /*break*/, 8];
                    return [4 /*yield*/, writeState(statePath, nextState)];
                case 7:
                    _d.sent();
                    return [2 /*return*/];
                case 8:
                    cmp = (0, update_check_js_1.compareSemverStrings)(version_js_1.VERSION, resolved.version);
                    if (cmp != null && cmp < 0) {
                        shouldNotify = state.lastNotifiedVersion !== resolved.version || state.lastNotifiedTag !== tag;
                        if (shouldNotify) {
                            params.log.info("update available (".concat(tag, "): v").concat(resolved.version, " (current v").concat(version_js_1.VERSION, "). Run: ").concat((0, command_format_js_1.formatCliCommand)("openclaw update")));
                            nextState.lastNotifiedVersion = resolved.version;
                            nextState.lastNotifiedTag = tag;
                        }
                    }
                    return [4 /*yield*/, writeState(statePath, nextState)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function scheduleGatewayUpdateCheck(params) {
    void runGatewayUpdateCheck(params).catch(function () { });
}
