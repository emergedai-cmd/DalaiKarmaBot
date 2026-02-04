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
exports.runGmailSetup = runGmailSetup;
exports.runGmailService = runGmailService;
var node_child_process_1 = require("node:child_process");
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var exec_js_1 = require("../process/exec.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var gmail_setup_utils_js_1 = require("./gmail-setup-utils.js");
var gmail_js_1 = require("./gmail.js");
var DEFAULT_GMAIL_TOPIC_IAM_MEMBER = "serviceAccount:gmail-api-push@system.gserviceaccount.com";
function runGmailSetup(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var configSnapshot, baseConfig, hooksPath, hookToken, pushToken, topicInput, parsedTopic, topicName, projectId, _a, topicPath, subscription, label, hookUrl, serveBind, servePort, configuredServePath, configuredTailscaleTarget, normalizedServePath, normalizedTailscaleTarget, includeBody, maxBytes, renewEveryMinutes, tailscaleMode, servePath, tailscalePath, pushEndpoint, _b, nextConfig, validated, summary;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
        return __generator(this, function (_26) {
            switch (_26.label) {
                case 0: return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureDependency)("gcloud", ["--cask", "gcloud-cli"])];
                case 1:
                    _26.sent();
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureDependency)("gog", ["gogcli"])];
                case 2:
                    _26.sent();
                    if (!(opts.tailscale !== "off" && !opts.pushEndpoint)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureDependency)("tailscale", ["tailscale"])];
                case 3:
                    _26.sent();
                    _26.label = 4;
                case 4: return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureGcloudAuth)()];
                case 5:
                    _26.sent();
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 6:
                    configSnapshot = _26.sent();
                    if (!configSnapshot.valid) {
                        throw new Error("Config invalid: ".concat(config_js_1.CONFIG_PATH));
                    }
                    baseConfig = configSnapshot.config;
                    hooksPath = (0, gmail_js_1.normalizeHooksPath)((_c = baseConfig.hooks) === null || _c === void 0 ? void 0 : _c.path);
                    hookToken = (_f = (_d = opts.hookToken) !== null && _d !== void 0 ? _d : (_e = baseConfig.hooks) === null || _e === void 0 ? void 0 : _e.token) !== null && _f !== void 0 ? _f : (0, gmail_js_1.generateHookToken)();
                    pushToken = (_k = (_g = opts.pushToken) !== null && _g !== void 0 ? _g : (_j = (_h = baseConfig.hooks) === null || _h === void 0 ? void 0 : _h.gmail) === null || _j === void 0 ? void 0 : _j.pushToken) !== null && _k !== void 0 ? _k : (0, gmail_js_1.generateHookToken)();
                    topicInput = (_p = (_l = opts.topic) !== null && _l !== void 0 ? _l : (_o = (_m = baseConfig.hooks) === null || _m === void 0 ? void 0 : _m.gmail) === null || _o === void 0 ? void 0 : _o.topic) !== null && _p !== void 0 ? _p : gmail_js_1.DEFAULT_GMAIL_TOPIC;
                    parsedTopic = (0, gmail_js_1.parseTopicPath)(topicInput);
                    topicName = (_q = parsedTopic === null || parsedTopic === void 0 ? void 0 : parsedTopic.topicName) !== null && _q !== void 0 ? _q : topicInput;
                    if (!((_s = (_r = opts.project) !== null && _r !== void 0 ? _r : parsedTopic === null || parsedTopic === void 0 ? void 0 : parsedTopic.projectId) !== null && _s !== void 0)) return [3 /*break*/, 7];
                    _a = _s;
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, (0, gmail_setup_utils_js_1.resolveProjectIdFromGogCredentials)()];
                case 8:
                    _a = (_26.sent());
                    _26.label = 9;
                case 9:
                    projectId = _a;
                    // Gmail watch requires the Pub/Sub topic to live in the OAuth client project.
                    if (!projectId) {
                        throw new Error("GCP project id required (use --project or ensure gog credentials are available)");
                    }
                    topicPath = (0, gmail_js_1.buildTopicPath)(projectId, topicName);
                    subscription = (_t = opts.subscription) !== null && _t !== void 0 ? _t : gmail_js_1.DEFAULT_GMAIL_SUBSCRIPTION;
                    label = (_u = opts.label) !== null && _u !== void 0 ? _u : gmail_js_1.DEFAULT_GMAIL_LABEL;
                    hookUrl = (_y = (_v = opts.hookUrl) !== null && _v !== void 0 ? _v : (_x = (_w = baseConfig.hooks) === null || _w === void 0 ? void 0 : _w.gmail) === null || _x === void 0 ? void 0 : _x.hookUrl) !== null && _y !== void 0 ? _y : (0, gmail_js_1.buildDefaultHookUrl)(hooksPath, (0, config_js_1.resolveGatewayPort)(baseConfig));
                    serveBind = (_z = opts.bind) !== null && _z !== void 0 ? _z : gmail_js_1.DEFAULT_GMAIL_SERVE_BIND;
                    servePort = (_0 = opts.port) !== null && _0 !== void 0 ? _0 : gmail_js_1.DEFAULT_GMAIL_SERVE_PORT;
                    configuredServePath = (_1 = opts.path) !== null && _1 !== void 0 ? _1 : (_4 = (_3 = (_2 = baseConfig.hooks) === null || _2 === void 0 ? void 0 : _2.gmail) === null || _3 === void 0 ? void 0 : _3.serve) === null || _4 === void 0 ? void 0 : _4.path;
                    configuredTailscaleTarget = (_5 = opts.tailscaleTarget) !== null && _5 !== void 0 ? _5 : (_8 = (_7 = (_6 = baseConfig.hooks) === null || _6 === void 0 ? void 0 : _6.gmail) === null || _7 === void 0 ? void 0 : _7.tailscale) === null || _8 === void 0 ? void 0 : _8.target;
                    normalizedServePath = typeof configuredServePath === "string" && configuredServePath.trim().length > 0
                        ? (0, gmail_js_1.normalizeServePath)(configuredServePath)
                        : gmail_js_1.DEFAULT_GMAIL_SERVE_PATH;
                    normalizedTailscaleTarget = typeof configuredTailscaleTarget === "string" && configuredTailscaleTarget.trim().length > 0
                        ? configuredTailscaleTarget.trim()
                        : undefined;
                    includeBody = (_9 = opts.includeBody) !== null && _9 !== void 0 ? _9 : true;
                    maxBytes = (_10 = opts.maxBytes) !== null && _10 !== void 0 ? _10 : gmail_js_1.DEFAULT_GMAIL_MAX_BYTES;
                    renewEveryMinutes = (_11 = opts.renewEveryMinutes) !== null && _11 !== void 0 ? _11 : gmail_js_1.DEFAULT_GMAIL_RENEW_MINUTES;
                    tailscaleMode = (_12 = opts.tailscale) !== null && _12 !== void 0 ? _12 : "funnel";
                    servePath = (0, gmail_js_1.normalizeServePath)(tailscaleMode !== "off" && !normalizedTailscaleTarget ? "/" : normalizedServePath);
                    tailscalePath = (0, gmail_js_1.normalizeServePath)((_17 = (_13 = opts.tailscalePath) !== null && _13 !== void 0 ? _13 : (_16 = (_15 = (_14 = baseConfig.hooks) === null || _14 === void 0 ? void 0 : _14.gmail) === null || _15 === void 0 ? void 0 : _15.tailscale) === null || _16 === void 0 ? void 0 : _16.path) !== null && _17 !== void 0 ? _17 : (tailscaleMode !== "off" ? normalizedServePath : servePath));
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.runGcloud)(["config", "set", "project", projectId, "--quiet"])];
                case 10:
                    _26.sent();
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.runGcloud)([
                            "services",
                            "enable",
                            "gmail.googleapis.com",
                            "pubsub.googleapis.com",
                            "--project",
                            projectId,
                            "--quiet",
                        ])];
                case 11:
                    _26.sent();
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureTopic)(projectId, topicName)];
                case 12:
                    _26.sent();
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.runGcloud)([
                            "pubsub",
                            "topics",
                            "add-iam-policy-binding",
                            topicName,
                            "--project",
                            projectId,
                            "--member",
                            DEFAULT_GMAIL_TOPIC_IAM_MEMBER,
                            "--role",
                            "roles/pubsub.publisher",
                            "--quiet",
                        ])];
                case 13:
                    _26.sent();
                    if (!opts.pushEndpoint) return [3 /*break*/, 14];
                    _b = opts.pushEndpoint;
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureTailscaleEndpoint)({
                        mode: tailscaleMode,
                        path: tailscalePath,
                        port: servePort,
                        target: normalizedTailscaleTarget,
                        token: pushToken,
                    })];
                case 15:
                    _b = _26.sent();
                    _26.label = 16;
                case 16:
                    pushEndpoint = _b;
                    if (!pushEndpoint) {
                        throw new Error("push endpoint required (set --push-endpoint)");
                    }
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureSubscription)(projectId, subscription, topicName, pushEndpoint)];
                case 17:
                    _26.sent();
                    return [4 /*yield*/, startGmailWatch({
                            account: opts.account,
                            label: label,
                            topic: topicPath,
                        }, true)];
                case 18:
                    _26.sent();
                    nextConfig = __assign(__assign({}, baseConfig), { hooks: __assign(__assign({}, baseConfig.hooks), { enabled: true, path: hooksPath, token: hookToken, presets: (0, gmail_js_1.mergeHookPresets)((_18 = baseConfig.hooks) === null || _18 === void 0 ? void 0 : _18.presets, "gmail"), gmail: __assign(__assign({}, (_19 = baseConfig.hooks) === null || _19 === void 0 ? void 0 : _19.gmail), { account: opts.account, label: label, topic: topicPath, subscription: subscription, pushToken: pushToken, hookUrl: hookUrl, includeBody: includeBody, maxBytes: maxBytes, renewEveryMinutes: renewEveryMinutes, serve: __assign(__assign({}, (_21 = (_20 = baseConfig.hooks) === null || _20 === void 0 ? void 0 : _20.gmail) === null || _21 === void 0 ? void 0 : _21.serve), { bind: serveBind, port: servePort, path: servePath }), tailscale: __assign(__assign({}, (_23 = (_22 = baseConfig.hooks) === null || _22 === void 0 ? void 0 : _22.gmail) === null || _23 === void 0 ? void 0 : _23.tailscale), { mode: tailscaleMode, path: tailscalePath, target: normalizedTailscaleTarget }) }) }) });
                    validated = (0, config_js_1.validateConfigObjectWithPlugins)(nextConfig);
                    if (!validated.ok) {
                        throw new Error("Config validation failed: ".concat((_25 = (_24 = validated.issues[0]) === null || _24 === void 0 ? void 0 : _24.message) !== null && _25 !== void 0 ? _25 : "invalid"));
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
                case 19:
                    _26.sent();
                    summary = {
                        projectId: projectId,
                        topic: topicPath,
                        subscription: subscription,
                        pushEndpoint: pushEndpoint,
                        hookUrl: hookUrl,
                        hookToken: hookToken,
                        pushToken: pushToken,
                        serve: {
                            bind: serveBind,
                            port: servePort,
                            path: servePath,
                        },
                    };
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(summary, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("Gmail hooks configured:");
                    runtime_js_1.defaultRuntime.log("- project: ".concat(projectId));
                    runtime_js_1.defaultRuntime.log("- topic: ".concat(topicPath));
                    runtime_js_1.defaultRuntime.log("- subscription: ".concat(subscription));
                    runtime_js_1.defaultRuntime.log("- push endpoint: ".concat(pushEndpoint));
                    runtime_js_1.defaultRuntime.log("- hook url: ".concat(hookUrl));
                    runtime_js_1.defaultRuntime.log("- config: ".concat((0, utils_js_1.displayPath)(config_js_1.CONFIG_PATH)));
                    runtime_js_1.defaultRuntime.log("Next: ".concat((0, command_format_js_1.formatCliCommand)("openclaw webhooks gmail run")));
                    return [2 /*return*/];
            }
        });
    });
}
function runGmailService(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var config, overrides, resolved, runtimeConfig, shuttingDown, child, renewMs, renewTimer, shutdown;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureDependency)("gog", ["gogcli"])];
                case 1:
                    _a.sent();
                    config = (0, config_js_1.loadConfig)();
                    overrides = {
                        account: opts.account,
                        topic: opts.topic,
                        subscription: opts.subscription,
                        label: opts.label,
                        hookToken: opts.hookToken,
                        pushToken: opts.pushToken,
                        hookUrl: opts.hookUrl,
                        serveBind: opts.bind,
                        servePort: opts.port,
                        servePath: opts.path,
                        includeBody: opts.includeBody,
                        maxBytes: opts.maxBytes,
                        renewEveryMinutes: opts.renewEveryMinutes,
                        tailscaleMode: opts.tailscale,
                        tailscalePath: opts.tailscalePath,
                        tailscaleTarget: opts.tailscaleTarget,
                    };
                    resolved = (0, gmail_js_1.resolveGmailHookRuntimeConfig)(config, overrides);
                    if (!resolved.ok) {
                        throw new Error(resolved.error);
                    }
                    runtimeConfig = resolved.value;
                    if (!(runtimeConfig.tailscale.mode !== "off")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureDependency)("tailscale", ["tailscale"])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, gmail_setup_utils_js_1.ensureTailscaleEndpoint)({
                            mode: runtimeConfig.tailscale.mode,
                            path: runtimeConfig.tailscale.path,
                            port: runtimeConfig.serve.port,
                            target: runtimeConfig.tailscale.target,
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, startGmailWatch(runtimeConfig)];
                case 5:
                    _a.sent();
                    shuttingDown = false;
                    child = spawnGogServe(runtimeConfig);
                    renewMs = runtimeConfig.renewEveryMinutes * 60000;
                    renewTimer = setInterval(function () {
                        void startGmailWatch(runtimeConfig);
                    }, renewMs);
                    shutdown = function () {
                        if (shuttingDown) {
                            return;
                        }
                        shuttingDown = true;
                        clearInterval(renewTimer);
                        child.kill("SIGTERM");
                    };
                    process.on("SIGINT", shutdown);
                    process.on("SIGTERM", shutdown);
                    child.on("exit", function () {
                        if (shuttingDown) {
                            return;
                        }
                        runtime_js_1.defaultRuntime.log("gog watch serve exited; restarting in 2s");
                        setTimeout(function () {
                            if (shuttingDown) {
                                return;
                            }
                            child = spawnGogServe(runtimeConfig);
                        }, 2000);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function spawnGogServe(cfg) {
    var args = (0, gmail_js_1.buildGogWatchServeArgs)(cfg);
    runtime_js_1.defaultRuntime.log("Starting gog ".concat(args.join(" ")));
    return (0, node_child_process_1.spawn)("gog", args, { stdio: "inherit" });
}
function startGmailWatch(cfg_1) {
    return __awaiter(this, arguments, void 0, function (cfg, fatal) {
        var args, result, message;
        if (fatal === void 0) { fatal = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = __spreadArray(["gog"], (0, gmail_js_1.buildGogWatchStartArgs)(cfg), true);
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(args, { timeoutMs: 120000 })];
                case 1:
                    result = _a.sent();
                    if (result.code !== 0) {
                        message = result.stderr || result.stdout || "gog watch start failed";
                        if (fatal) {
                            throw new Error(message);
                        }
                        runtime_js_1.defaultRuntime.error(message);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
