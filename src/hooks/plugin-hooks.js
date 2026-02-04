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
exports.registerPluginHooksFromDir = registerPluginHooksFromDir;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var config_js_1 = require("./config.js");
var workspace_js_1 = require("./workspace.js");
function resolveHookDir(api, dir) {
    if (node_path_1.default.isAbsolute(dir)) {
        return dir;
    }
    return node_path_1.default.resolve(node_path_1.default.dirname(api.source), dir);
}
function normalizePluginHookEntry(api, entry) {
    var _a, _b, _c, _d;
    return __assign(__assign({}, entry), { hook: __assign(__assign({}, entry.hook), { source: "openclaw-plugin", pluginId: api.id }), metadata: __assign(__assign({}, entry.metadata), { hookKey: (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.hookKey) !== null && _b !== void 0 ? _b : "".concat(api.id, ":").concat(entry.hook.name), events: (_d = (_c = entry.metadata) === null || _c === void 0 ? void 0 : _c.events) !== null && _d !== void 0 ? _d : [] }) });
}
function loadHookHandler(entry, api) {
    return __awaiter(this, void 0, void 0, function () {
        var url, cacheBustedUrl, mod, exportName, handler, err_1;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 2, , 3]);
                    url = (0, node_url_1.pathToFileURL)(entry.hook.handlerPath).href;
                    cacheBustedUrl = "".concat(url, "?t=").concat(Date.now());
                    return [4 /*yield*/, Promise.resolve("".concat(cacheBustedUrl)).then(function (s) { return require(s); })];
                case 1:
                    mod = (_g.sent());
                    exportName = (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.export) !== null && _b !== void 0 ? _b : "default";
                    handler = mod[exportName];
                    if (typeof handler === "function") {
                        return [2 /*return*/, handler];
                    }
                    (_d = (_c = api.logger).warn) === null || _d === void 0 ? void 0 : _d.call(_c, "[hooks] ".concat(entry.hook.name, " handler is not a function"));
                    return [2 /*return*/, null];
                case 2:
                    err_1 = _g.sent();
                    (_f = (_e = api.logger).warn) === null || _f === void 0 ? void 0 : _f.call(_e, "[hooks] Failed to load ".concat(entry.hook.name, ": ").concat(String(err_1)));
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function registerPluginHooksFromDir(api, dir) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedDir, hooks, result, _i, hooks_1, entry, normalizedEntry, events, handler, eligible;
        var _this = this;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    resolvedDir = resolveHookDir(api, dir);
                    hooks = (0, workspace_js_1.loadHookEntriesFromDir)({
                        dir: resolvedDir,
                        source: "openclaw-plugin",
                        pluginId: api.id,
                    });
                    result = {
                        hooks: hooks,
                        loaded: 0,
                        skipped: 0,
                        errors: [],
                    };
                    _i = 0, hooks_1 = hooks;
                    _e.label = 1;
                case 1:
                    if (!(_i < hooks_1.length)) return [3 /*break*/, 4];
                    entry = hooks_1[_i];
                    normalizedEntry = normalizePluginHookEntry(api, entry);
                    events = (_b = (_a = normalizedEntry.metadata) === null || _a === void 0 ? void 0 : _a.events) !== null && _b !== void 0 ? _b : [];
                    if (events.length === 0) {
                        (_d = (_c = api.logger).warn) === null || _d === void 0 ? void 0 : _d.call(_c, "[hooks] ".concat(entry.hook.name, " has no events; skipping"));
                        api.registerHook(events, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }, {
                            entry: normalizedEntry,
                            register: false,
                        });
                        result.skipped += 1;
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, loadHookHandler(entry, api)];
                case 2:
                    handler = _e.sent();
                    if (!handler) {
                        result.errors.push("[hooks] Failed to load ".concat(entry.hook.name));
                        api.registerHook(events, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }, {
                            entry: normalizedEntry,
                            register: false,
                        });
                        result.skipped += 1;
                        return [3 /*break*/, 3];
                    }
                    eligible = (0, config_js_1.shouldIncludeHook)({ entry: normalizedEntry, config: api.config });
                    api.registerHook(events, handler, {
                        entry: normalizedEntry,
                        register: eligible,
                    });
                    if (eligible) {
                        result.loaded += 1;
                    }
                    else {
                        result.skipped += 1;
                    }
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
