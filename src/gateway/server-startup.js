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
exports.startGatewaySidecars = startGatewaySidecars;
var defaults_js_1 = require("../agents/defaults.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var gmail_watcher_js_1 = require("../hooks/gmail-watcher.js");
var internal_hooks_js_1 = require("../hooks/internal-hooks.js");
var loader_js_1 = require("../hooks/loader.js");
var env_js_1 = require("../infra/env.js");
var services_js_1 = require("../plugins/services.js");
var server_browser_js_1 = require("./server-browser.js");
var server_restart_sentinel_js_1 = require("./server-restart-sentinel.js");
function startGatewaySidecars(params) {
    return __awaiter(this, void 0, void 0, function () {
        var browserControl, err_1, gmailResult, err_2, hooksModelRef, _a, defaultProvider, defaultModel, catalog, status_1, loadedCount, err_3, skipChannels, err_4, pluginServices, err_5;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    browserControl = null;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, server_browser_js_1.startBrowserControlServerIfEnabled)()];
                case 2:
                    browserControl = _f.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _f.sent();
                    params.logBrowser.error("server failed to start: ".concat(String(err_1)));
                    return [3 /*break*/, 4];
                case 4:
                    if (!!(0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_GMAIL_WATCHER)) return [3 /*break*/, 8];
                    _f.label = 5;
                case 5:
                    _f.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, gmail_watcher_js_1.startGmailWatcher)(params.cfg)];
                case 6:
                    gmailResult = _f.sent();
                    if (gmailResult.started) {
                        params.logHooks.info("gmail watcher started");
                    }
                    else if (gmailResult.reason &&
                        gmailResult.reason !== "hooks not enabled" &&
                        gmailResult.reason !== "no gmail account configured") {
                        params.logHooks.warn("gmail watcher not started: ".concat(gmailResult.reason));
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _f.sent();
                    params.logHooks.error("gmail watcher failed to start: ".concat(String(err_2)));
                    return [3 /*break*/, 8];
                case 8:
                    if (!((_c = (_b = params.cfg.hooks) === null || _b === void 0 ? void 0 : _b.gmail) === null || _c === void 0 ? void 0 : _c.model)) return [3 /*break*/, 10];
                    hooksModelRef = (0, model_selection_js_1.resolveHooksGmailModel)({
                        cfg: params.cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                    });
                    if (!hooksModelRef) return [3 /*break*/, 10];
                    _a = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: params.cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    }), defaultProvider = _a.provider, defaultModel = _a.model;
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: params.cfg })];
                case 9:
                    catalog = _f.sent();
                    status_1 = (0, model_selection_js_1.getModelRefStatus)({
                        cfg: params.cfg,
                        catalog: catalog,
                        ref: hooksModelRef,
                        defaultProvider: defaultProvider,
                        defaultModel: defaultModel,
                    });
                    if (!status_1.allowed) {
                        params.logHooks.warn("hooks.gmail.model \"".concat(status_1.key, "\" not in agents.defaults.models allowlist (will use primary instead)"));
                    }
                    if (!status_1.inCatalog) {
                        params.logHooks.warn("hooks.gmail.model \"".concat(status_1.key, "\" not in the model catalog (may fail at runtime)"));
                    }
                    _f.label = 10;
                case 10:
                    _f.trys.push([10, 12, , 13]);
                    // Clear any previously registered hooks to ensure fresh loading
                    (0, internal_hooks_js_1.clearInternalHooks)();
                    return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(params.cfg, params.defaultWorkspaceDir)];
                case 11:
                    loadedCount = _f.sent();
                    if (loadedCount > 0) {
                        params.logHooks.info("loaded ".concat(loadedCount, " internal hook handler").concat(loadedCount > 1 ? "s" : ""));
                    }
                    return [3 /*break*/, 13];
                case 12:
                    err_3 = _f.sent();
                    params.logHooks.error("failed to load hooks: ".concat(String(err_3)));
                    return [3 /*break*/, 13];
                case 13:
                    skipChannels = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_CHANNELS) ||
                        (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_SKIP_PROVIDERS);
                    if (!!skipChannels) return [3 /*break*/, 18];
                    _f.label = 14;
                case 14:
                    _f.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, params.startChannels()];
                case 15:
                    _f.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_4 = _f.sent();
                    params.logChannels.error("channel startup failed: ".concat(String(err_4)));
                    return [3 /*break*/, 17];
                case 17: return [3 /*break*/, 19];
                case 18:
                    params.logChannels.info("skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)");
                    _f.label = 19;
                case 19:
                    if ((_e = (_d = params.cfg.hooks) === null || _d === void 0 ? void 0 : _d.internal) === null || _e === void 0 ? void 0 : _e.enabled) {
                        setTimeout(function () {
                            var hookEvent = (0, internal_hooks_js_1.createInternalHookEvent)("gateway", "startup", "gateway:startup", {
                                cfg: params.cfg,
                                deps: params.deps,
                                workspaceDir: params.defaultWorkspaceDir,
                            });
                            void (0, internal_hooks_js_1.triggerInternalHook)(hookEvent);
                        }, 250);
                    }
                    pluginServices = null;
                    _f.label = 20;
                case 20:
                    _f.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, (0, services_js_1.startPluginServices)({
                            registry: params.pluginRegistry,
                            config: params.cfg,
                            workspaceDir: params.defaultWorkspaceDir,
                        })];
                case 21:
                    pluginServices = _f.sent();
                    return [3 /*break*/, 23];
                case 22:
                    err_5 = _f.sent();
                    params.log.warn("plugin services failed to start: ".concat(String(err_5)));
                    return [3 /*break*/, 23];
                case 23:
                    if ((0, server_restart_sentinel_js_1.shouldWakeFromRestartSentinel)()) {
                        setTimeout(function () {
                            void (0, server_restart_sentinel_js_1.scheduleRestartSentinelWake)({ deps: params.deps });
                        }, 750);
                    }
                    return [2 /*return*/, { browserControl: browserControl, pluginServices: pluginServices }];
            }
        });
    });
}
