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
exports.channelsAddCommand = channelsAddCommand;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var catalog_js_1 = require("../../channels/plugins/catalog.js");
var index_js_1 = require("../../channels/plugins/index.js");
var config_js_1 = require("../../config/config.js");
var session_key_js_1 = require("../../routing/session-key.js");
var runtime_js_1 = require("../../runtime.js");
var clack_prompter_js_1 = require("../../wizard/clack-prompter.js");
var onboard_channels_js_1 = require("../onboard-channels.js");
var plugin_install_js_1 = require("../onboarding/plugin-install.js");
var add_mutators_js_1 = require("./add-mutators.js");
var shared_js_1 = require("./shared.js");
function parseList(value) {
    if (!(value === null || value === void 0 ? void 0 : value.trim())) {
        return undefined;
    }
    var parsed = value
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
    return parsed.length > 0 ? parsed : undefined;
}
function resolveCatalogChannelEntry(raw, cfg) {
    var trimmed = raw.trim().toLowerCase();
    if (!trimmed) {
        return undefined;
    }
    var workspaceDir = cfg ? (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg)) : undefined;
    return (0, catalog_js_1.listChannelPluginCatalogEntries)({ workspaceDir: workspaceDir }).find(function (entry) {
        var _a;
        if (entry.id.toLowerCase() === trimmed) {
            return true;
        }
        return ((_a = entry.meta.aliases) !== null && _a !== void 0 ? _a : []).some(function (alias) { return alias.trim().toLowerCase() === trimmed; });
    });
}
function channelsAddCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime, params) {
        var cfg, nextConfig, useWizard, prompter, selection_2, accountIds_1, nextConfig_1, wantsNames, _i, selection_1, channel_1, accountId_1, plugin_1, account, snapshot, existingName, name_1, rawChannel, channel, catalogEntry, prompter, workspaceDir, result, hint, plugin, accountId, useEnv, initialSyncLimit, groupChannels, dmAllowlist, validationError;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _p.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    nextConfig = cfg;
                    useWizard = (0, shared_js_1.shouldUseWizard)(params);
                    if (!useWizard) return [3 /*break*/, 13];
                    prompter = (0, clack_prompter_js_1.createClackPrompter)();
                    selection_2 = [];
                    accountIds_1 = {};
                    return [4 /*yield*/, prompter.intro("Channel setup")];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)(cfg, runtime, prompter, {
                            allowDisable: false,
                            allowSignalInstall: true,
                            promptAccountIds: true,
                            onSelection: function (value) {
                                selection_2 = value;
                            },
                            onAccountId: function (channel, accountId) {
                                accountIds_1[channel] = accountId;
                            },
                        })];
                case 3:
                    nextConfig_1 = _p.sent();
                    if (!(selection_2.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.outro("No channels selected.")];
                case 4:
                    _p.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, prompter.confirm({
                        message: "Add display names for these accounts? (optional)",
                        initialValue: false,
                    })];
                case 6:
                    wantsNames = _p.sent();
                    if (!wantsNames) return [3 /*break*/, 10];
                    _i = 0, selection_1 = selection_2;
                    _p.label = 7;
                case 7:
                    if (!(_i < selection_1.length)) return [3 /*break*/, 10];
                    channel_1 = selection_1[_i];
                    accountId_1 = (_a = accountIds_1[channel_1]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID;
                    plugin_1 = (0, index_js_1.getChannelPlugin)(channel_1);
                    account = plugin_1 === null || plugin_1 === void 0 ? void 0 : plugin_1.config.resolveAccount(nextConfig_1, accountId_1);
                    snapshot = (_c = plugin_1 === null || plugin_1 === void 0 ? void 0 : (_b = plugin_1.config).describeAccount) === null || _c === void 0 ? void 0 : _c.call(_b, account, nextConfig_1);
                    existingName = (_d = snapshot === null || snapshot === void 0 ? void 0 : snapshot.name) !== null && _d !== void 0 ? _d : account === null || account === void 0 ? void 0 : account.name;
                    return [4 /*yield*/, prompter.text({
                            message: "".concat(channel_1, " account name (").concat(accountId_1, ")"),
                            initialValue: existingName,
                        })];
                case 8:
                    name_1 = _p.sent();
                    if (name_1 === null || name_1 === void 0 ? void 0 : name_1.trim()) {
                        nextConfig_1 = (0, add_mutators_js_1.applyAccountName)({
                            cfg: nextConfig_1,
                            channel: channel_1,
                            accountId: accountId_1,
                            name: name_1,
                        });
                    }
                    _p.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig_1)];
                case 11:
                    _p.sent();
                    return [4 /*yield*/, prompter.outro("Channels updated.")];
                case 12:
                    _p.sent();
                    return [2 /*return*/];
                case 13:
                    rawChannel = String((_e = opts.channel) !== null && _e !== void 0 ? _e : "");
                    channel = (0, index_js_1.normalizeChannelId)(rawChannel);
                    catalogEntry = channel ? undefined : resolveCatalogChannelEntry(rawChannel, nextConfig);
                    if (!(!channel && catalogEntry)) return [3 /*break*/, 15];
                    prompter = (0, clack_prompter_js_1.createClackPrompter)();
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(nextConfig, (0, agent_scope_js_1.resolveDefaultAgentId)(nextConfig));
                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                            cfg: nextConfig,
                            entry: catalogEntry,
                            prompter: prompter,
                            runtime: runtime,
                            workspaceDir: workspaceDir,
                        })];
                case 14:
                    result = _p.sent();
                    nextConfig = result.cfg;
                    if (!result.installed) {
                        return [2 /*return*/];
                    }
                    (0, plugin_install_js_1.reloadOnboardingPluginRegistry)({ cfg: nextConfig, runtime: runtime, workspaceDir: workspaceDir });
                    channel = (_f = (0, index_js_1.normalizeChannelId)(catalogEntry.id)) !== null && _f !== void 0 ? _f : catalogEntry.id;
                    _p.label = 15;
                case 15:
                    if (!channel) {
                        hint = catalogEntry
                            ? "Plugin ".concat(catalogEntry.meta.label, " could not be loaded after install.")
                            : "Unknown channel: ".concat(String((_g = opts.channel) !== null && _g !== void 0 ? _g : ""));
                        runtime.error(hint);
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                    if (!((_h = plugin === null || plugin === void 0 ? void 0 : plugin.setup) === null || _h === void 0 ? void 0 : _h.applyAccountConfig)) {
                        runtime.error("Channel ".concat(channel, " does not support add."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    accountId = (_l = (_k = (_j = plugin.setup).resolveAccountId) === null || _k === void 0 ? void 0 : _k.call(_j, { cfg: nextConfig, accountId: opts.account })) !== null && _l !== void 0 ? _l : (0, session_key_js_1.normalizeAccountId)(opts.account);
                    useEnv = opts.useEnv === true;
                    initialSyncLimit = typeof opts.initialSyncLimit === "number"
                        ? opts.initialSyncLimit
                        : typeof opts.initialSyncLimit === "string" && opts.initialSyncLimit.trim()
                            ? Number.parseInt(opts.initialSyncLimit, 10)
                            : undefined;
                    groupChannels = parseList(opts.groupChannels);
                    dmAllowlist = parseList(opts.dmAllowlist);
                    validationError = (_o = (_m = plugin.setup).validateInput) === null || _o === void 0 ? void 0 : _o.call(_m, {
                        cfg: nextConfig,
                        accountId: accountId,
                        input: {
                            name: opts.name,
                            token: opts.token,
                            tokenFile: opts.tokenFile,
                            botToken: opts.botToken,
                            appToken: opts.appToken,
                            signalNumber: opts.signalNumber,
                            cliPath: opts.cliPath,
                            dbPath: opts.dbPath,
                            service: opts.service,
                            region: opts.region,
                            authDir: opts.authDir,
                            httpUrl: opts.httpUrl,
                            httpHost: opts.httpHost,
                            httpPort: opts.httpPort,
                            webhookPath: opts.webhookPath,
                            webhookUrl: opts.webhookUrl,
                            audienceType: opts.audienceType,
                            audience: opts.audience,
                            homeserver: opts.homeserver,
                            userId: opts.userId,
                            accessToken: opts.accessToken,
                            password: opts.password,
                            deviceName: opts.deviceName,
                            initialSyncLimit: initialSyncLimit,
                            useEnv: useEnv,
                            ship: opts.ship,
                            url: opts.url,
                            code: opts.code,
                            groupChannels: groupChannels,
                            dmAllowlist: dmAllowlist,
                            autoDiscoverChannels: opts.autoDiscoverChannels,
                        },
                    });
                    if (validationError) {
                        runtime.error(validationError);
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    nextConfig = (0, add_mutators_js_1.applyChannelAccountConfig)({
                        cfg: nextConfig,
                        channel: channel,
                        accountId: accountId,
                        name: opts.name,
                        token: opts.token,
                        tokenFile: opts.tokenFile,
                        botToken: opts.botToken,
                        appToken: opts.appToken,
                        signalNumber: opts.signalNumber,
                        cliPath: opts.cliPath,
                        dbPath: opts.dbPath,
                        service: opts.service,
                        region: opts.region,
                        authDir: opts.authDir,
                        httpUrl: opts.httpUrl,
                        httpHost: opts.httpHost,
                        httpPort: opts.httpPort,
                        webhookPath: opts.webhookPath,
                        webhookUrl: opts.webhookUrl,
                        audienceType: opts.audienceType,
                        audience: opts.audience,
                        homeserver: opts.homeserver,
                        userId: opts.userId,
                        accessToken: opts.accessToken,
                        password: opts.password,
                        deviceName: opts.deviceName,
                        initialSyncLimit: initialSyncLimit,
                        useEnv: useEnv,
                        ship: opts.ship,
                        url: opts.url,
                        code: opts.code,
                        groupChannels: groupChannels,
                        dmAllowlist: dmAllowlist,
                        autoDiscoverChannels: opts.autoDiscoverChannels,
                    });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 16:
                    _p.sent();
                    runtime.log("Added ".concat((0, shared_js_1.channelLabel)(channel), " account \"").concat(accountId, "\"."));
                    return [2 /*return*/];
            }
        });
    });
}
