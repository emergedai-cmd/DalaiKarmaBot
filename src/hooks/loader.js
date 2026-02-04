"use strict";
/**
 * Dynamic loader for hook handlers
 *
 * Loads hook handlers from external modules based on configuration
 * and from directory-based discovery (bundled, managed, workspace)
 */
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
exports.loadInternalHooks = loadInternalHooks;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var config_js_1 = require("./config.js");
var config_js_2 = require("./config.js");
var internal_hooks_js_1 = require("./internal-hooks.js");
var workspace_js_1 = require("./workspace.js");
/**
 * Load and register all hook handlers
 *
 * Loads hooks from both:
 * 1. Directory-based discovery (bundled, managed, workspace)
 * 2. Legacy config handlers (backwards compatibility)
 *
 * @param cfg - OpenClaw configuration
 * @param workspaceDir - Workspace directory for hook discovery
 * @returns Number of handlers successfully loaded
 *
 * @example
 * ```ts
 * const config = await loadConfig();
 * const workspaceDir = resolveAgentWorkspaceDir(config, agentId);
 * const count = await loadInternalHooks(config, workspaceDir);
 * console.log(`Loaded ${count} hook handlers`);
 * ```
 */
function loadInternalHooks(cfg, workspaceDir) {
    return __awaiter(this, void 0, void 0, function () {
        var loadedCount, hookEntries, eligible, _i, eligible_1, entry, hookConfig, url, cacheBustedUrl, mod, exportName, handler, events, _a, events_1, event_1, err_1, err_2, handlers, _b, handlers_1, handlerConfig, modulePath, url, cacheBustedUrl, mod, exportName, handler, err_3;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    // Check if hooks are enabled
                    if (!((_d = (_c = cfg.hooks) === null || _c === void 0 ? void 0 : _c.internal) === null || _d === void 0 ? void 0 : _d.enabled)) {
                        return [2 /*return*/, 0];
                    }
                    loadedCount = 0;
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 8, , 9]);
                    hookEntries = (0, workspace_js_1.loadWorkspaceHookEntries)(workspaceDir, { config: cfg });
                    eligible = hookEntries.filter(function (entry) { return (0, config_js_2.shouldIncludeHook)({ entry: entry, config: cfg }); });
                    _i = 0, eligible_1 = eligible;
                    _l.label = 2;
                case 2:
                    if (!(_i < eligible_1.length)) return [3 /*break*/, 7];
                    entry = eligible_1[_i];
                    hookConfig = (0, config_js_1.resolveHookConfig)(cfg, entry.hook.name);
                    // Skip if explicitly disabled in config
                    if ((hookConfig === null || hookConfig === void 0 ? void 0 : hookConfig.enabled) === false) {
                        return [3 /*break*/, 6];
                    }
                    _l.label = 3;
                case 3:
                    _l.trys.push([3, 5, , 6]);
                    url = (0, node_url_1.pathToFileURL)(entry.hook.handlerPath).href;
                    cacheBustedUrl = "".concat(url, "?t=").concat(Date.now());
                    return [4 /*yield*/, Promise.resolve("".concat(cacheBustedUrl)).then(function (s) { return require(s); })];
                case 4:
                    mod = (_l.sent());
                    exportName = (_f = (_e = entry.metadata) === null || _e === void 0 ? void 0 : _e.export) !== null && _f !== void 0 ? _f : "default";
                    handler = mod[exportName];
                    if (typeof handler !== "function") {
                        console.error("Hook error: Handler '".concat(exportName, "' from ").concat(entry.hook.name, " is not a function"));
                        return [3 /*break*/, 6];
                    }
                    events = (_h = (_g = entry.metadata) === null || _g === void 0 ? void 0 : _g.events) !== null && _h !== void 0 ? _h : [];
                    if (events.length === 0) {
                        console.warn("Hook warning: Hook '".concat(entry.hook.name, "' has no events defined in metadata"));
                        return [3 /*break*/, 6];
                    }
                    for (_a = 0, events_1 = events; _a < events_1.length; _a++) {
                        event_1 = events_1[_a];
                        (0, internal_hooks_js_1.registerInternalHook)(event_1, handler);
                    }
                    console.log("Registered hook: ".concat(entry.hook.name, " -> ").concat(events.join(", ")).concat(exportName !== "default" ? " (export: ".concat(exportName, ")") : ""));
                    loadedCount++;
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _l.sent();
                    console.error("Failed to load hook ".concat(entry.hook.name, ":"), err_1 instanceof Error ? err_1.message : String(err_1));
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _l.sent();
                    console.error("Failed to load directory-based hooks:", err_2 instanceof Error ? err_2.message : String(err_2));
                    return [3 /*break*/, 9];
                case 9:
                    handlers = (_j = cfg.hooks.internal.handlers) !== null && _j !== void 0 ? _j : [];
                    _b = 0, handlers_1 = handlers;
                    _l.label = 10;
                case 10:
                    if (!(_b < handlers_1.length)) return [3 /*break*/, 15];
                    handlerConfig = handlers_1[_b];
                    _l.label = 11;
                case 11:
                    _l.trys.push([11, 13, , 14]);
                    modulePath = node_path_1.default.isAbsolute(handlerConfig.module)
                        ? handlerConfig.module
                        : node_path_1.default.join(process.cwd(), handlerConfig.module);
                    url = (0, node_url_1.pathToFileURL)(modulePath).href;
                    cacheBustedUrl = "".concat(url, "?t=").concat(Date.now());
                    return [4 /*yield*/, Promise.resolve("".concat(cacheBustedUrl)).then(function (s) { return require(s); })];
                case 12:
                    mod = (_l.sent());
                    exportName = (_k = handlerConfig.export) !== null && _k !== void 0 ? _k : "default";
                    handler = mod[exportName];
                    if (typeof handler !== "function") {
                        console.error("Hook error: Handler '".concat(exportName, "' from ").concat(modulePath, " is not a function"));
                        return [3 /*break*/, 14];
                    }
                    // Register the handler
                    (0, internal_hooks_js_1.registerInternalHook)(handlerConfig.event, handler);
                    console.log("Registered hook (legacy): ".concat(handlerConfig.event, " -> ").concat(modulePath).concat(exportName !== "default" ? "#".concat(exportName) : ""));
                    loadedCount++;
                    return [3 /*break*/, 14];
                case 13:
                    err_3 = _l.sent();
                    console.error("Failed to load hook handler from ".concat(handlerConfig.module, ":"), err_3 instanceof Error ? err_3.message : String(err_3));
                    return [3 /*break*/, 14];
                case 14:
                    _b++;
                    return [3 /*break*/, 10];
                case 15: return [2 /*return*/, loadedCount];
            }
        });
    });
}
