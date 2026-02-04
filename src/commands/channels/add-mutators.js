"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAccountName = applyAccountName;
exports.applyChannelAccountConfig = applyChannelAccountConfig;
var index_js_1 = require("../../channels/plugins/index.js");
var session_key_js_1 = require("../../routing/session-key.js");
function applyAccountName(params) {
    var _a;
    var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
    var plugin = (0, index_js_1.getChannelPlugin)(params.channel);
    var apply = (_a = plugin === null || plugin === void 0 ? void 0 : plugin.setup) === null || _a === void 0 ? void 0 : _a.applyAccountName;
    return apply ? apply({ cfg: params.cfg, accountId: accountId, name: params.name }) : params.cfg;
}
function applyChannelAccountConfig(params) {
    var _a;
    var accountId = (0, session_key_js_1.normalizeAccountId)(params.accountId);
    var plugin = (0, index_js_1.getChannelPlugin)(params.channel);
    var apply = (_a = plugin === null || plugin === void 0 ? void 0 : plugin.setup) === null || _a === void 0 ? void 0 : _a.applyAccountConfig;
    if (!apply) {
        return params.cfg;
    }
    var input = {
        name: params.name,
        token: params.token,
        tokenFile: params.tokenFile,
        botToken: params.botToken,
        appToken: params.appToken,
        signalNumber: params.signalNumber,
        cliPath: params.cliPath,
        dbPath: params.dbPath,
        service: params.service,
        region: params.region,
        authDir: params.authDir,
        httpUrl: params.httpUrl,
        httpHost: params.httpHost,
        httpPort: params.httpPort,
        webhookPath: params.webhookPath,
        webhookUrl: params.webhookUrl,
        audienceType: params.audienceType,
        audience: params.audience,
        useEnv: params.useEnv,
        homeserver: params.homeserver,
        userId: params.userId,
        accessToken: params.accessToken,
        password: params.password,
        deviceName: params.deviceName,
        initialSyncLimit: params.initialSyncLimit,
        ship: params.ship,
        url: params.url,
        code: params.code,
        groupChannels: params.groupChannels,
        dmAllowlist: params.dmAllowlist,
        autoDiscoverChannels: params.autoDiscoverChannels,
    };
    return apply({ cfg: params.cfg, accountId: accountId, input: input });
}
