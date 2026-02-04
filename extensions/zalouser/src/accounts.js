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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listZalouserAccountIds = listZalouserAccountIds;
exports.resolveDefaultZalouserAccountId = resolveDefaultZalouserAccountId;
exports.checkZcaAuthenticated = checkZcaAuthenticated;
exports.resolveZalouserAccount = resolveZalouserAccount;
exports.resolveZalouserAccountSync = resolveZalouserAccountSync;
exports.listEnabledZalouserAccounts = listEnabledZalouserAccounts;
exports.getZcaUserInfo = getZcaUserInfo;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var zca_js_1 = require("./zca.js");
function listConfiguredAccountIds(cfg) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return [];
    }
    return Object.keys(accounts).filter(Boolean);
}
function listZalouserAccountIds(cfg) {
    var ids = listConfiguredAccountIds(cfg);
    if (ids.length === 0) {
        return [plugin_sdk_1.DEFAULT_ACCOUNT_ID];
    }
    return ids.toSorted(function (a, b) { return a.localeCompare(b); });
}
function resolveDefaultZalouserAccountId(cfg) {
    var _a, _b, _c;
    var zalouserConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser;
    if ((_b = zalouserConfig === null || zalouserConfig === void 0 ? void 0 : zalouserConfig.defaultAccount) === null || _b === void 0 ? void 0 : _b.trim()) {
        return zalouserConfig.defaultAccount.trim();
    }
    var ids = listZalouserAccountIds(cfg);
    if (ids.includes(plugin_sdk_1.DEFAULT_ACCOUNT_ID)) {
        return plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    }
    return (_c = ids[0]) !== null && _c !== void 0 ? _c : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
}
function resolveAccountConfig(cfg, accountId) {
    var _a, _b;
    var accounts = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) === null || _b === void 0 ? void 0 : _b.accounts;
    if (!accounts || typeof accounts !== "object") {
        return undefined;
    }
    return accounts[accountId];
}
function mergeZalouserAccountConfig(cfg, accountId) {
    var _a, _b, _c;
    var raw = ((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) !== null && _b !== void 0 ? _b : {});
    var _ignored = raw.accounts, _ignored2 = raw.defaultAccount, base = __rest(raw, ["accounts", "defaultAccount"]);
    var account = (_c = resolveAccountConfig(cfg, accountId)) !== null && _c !== void 0 ? _c : {};
    return __assign(__assign({}, base), account);
}
function resolveZcaProfile(config, accountId) {
    var _a, _b;
    if ((_a = config.profile) === null || _a === void 0 ? void 0 : _a.trim()) {
        return config.profile.trim();
    }
    if ((_b = process.env.ZCA_PROFILE) === null || _b === void 0 ? void 0 : _b.trim()) {
        return process.env.ZCA_PROFILE.trim();
    }
    if (accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        return accountId;
    }
    return "default";
}
function checkZcaAuthenticated(profile) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, zca_js_1.runZca)(["auth", "status"], { profile: profile, timeout: 5000 })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.ok];
            }
        });
    });
}
function resolveZalouserAccount(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, baseEnabled, merged, accountEnabled, enabled, profile, authenticated;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
                    baseEnabled = ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
                    merged = mergeZalouserAccountConfig(params.cfg, accountId);
                    accountEnabled = merged.enabled !== false;
                    enabled = baseEnabled && accountEnabled;
                    profile = resolveZcaProfile(merged, accountId);
                    return [4 /*yield*/, checkZcaAuthenticated(profile)];
                case 1:
                    authenticated = _d.sent();
                    return [2 /*return*/, {
                            accountId: accountId,
                            name: ((_c = merged.name) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                            enabled: enabled,
                            profile: profile,
                            authenticated: authenticated,
                            config: merged,
                        }];
            }
        });
    });
}
function resolveZalouserAccountSync(params) {
    var _a, _b, _c;
    var accountId = (0, plugin_sdk_1.normalizeAccountId)(params.accountId);
    var baseEnabled = ((_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    var merged = mergeZalouserAccountConfig(params.cfg, accountId);
    var accountEnabled = merged.enabled !== false;
    var enabled = baseEnabled && accountEnabled;
    var profile = resolveZcaProfile(merged, accountId);
    return {
        accountId: accountId,
        name: ((_c = merged.name) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
        enabled: enabled,
        profile: profile,
        authenticated: false, // unknown without async check
        config: merged,
    };
}
function listEnabledZalouserAccounts(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ids = listZalouserAccountIds(cfg);
                    return [4 /*yield*/, Promise.all(ids.map(function (accountId) { return resolveZalouserAccount({ cfg: cfg, accountId: accountId }); }))];
                case 1:
                    accounts = _a.sent();
                    return [2 /*return*/, accounts.filter(function (account) { return account.enabled; })];
            }
        });
    });
}
function getZcaUserInfo(profile) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, zca_js_1.runZca)(["me", "info", "-j"], { profile: profile, timeout: 10000 })];
                case 1:
                    result = _a.sent();
                    if (!result.ok) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, (0, zca_js_1.parseJsonOutput)(result.stdout)];
            }
        });
    });
}
