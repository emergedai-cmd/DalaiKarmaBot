"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMSTeamsCredentials = resolveMSTeamsCredentials;
function resolveMSTeamsCredentials(cfg) {
    var _a, _b, _c, _d, _e, _f;
    var appId = ((_a = cfg === null || cfg === void 0 ? void 0 : cfg.appId) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = process.env.MSTEAMS_APP_ID) === null || _b === void 0 ? void 0 : _b.trim());
    var appPassword = ((_c = cfg === null || cfg === void 0 ? void 0 : cfg.appPassword) === null || _c === void 0 ? void 0 : _c.trim()) || ((_d = process.env.MSTEAMS_APP_PASSWORD) === null || _d === void 0 ? void 0 : _d.trim());
    var tenantId = ((_e = cfg === null || cfg === void 0 ? void 0 : cfg.tenantId) === null || _e === void 0 ? void 0 : _e.trim()) || ((_f = process.env.MSTEAMS_TENANT_ID) === null || _f === void 0 ? void 0 : _f.trim());
    if (!appId || !appPassword || !tenantId) {
        return undefined;
    }
    return { appId: appId, appPassword: appPassword, tenantId: tenantId };
}
